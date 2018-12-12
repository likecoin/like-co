import { IS_TESTNET } from '../../../constant';
import {
  AUTH_COOKIE_OPTION,
  W3C_EMAIL_REGEX,
} from '../../constant/server';

import { ValidationHelper as Validate, ValidationError } from '../../../util/ValidationHelper';
import { getEmailBlacklist, getEmailNoDot } from '../poller';
import { jwtSign } from '../jwt';
import { personalEcRecover, web3 } from '../web3';

const disposableDomains = require('disposable-email-domains');

const {
  userCollection: dbRef,
  userAuthCollection: authDbRef,
  FieldValue,
} = require('../firebase');

export const FIVE_MIN_IN_MS = 300000;

export async function setAuthCookies(req, res, { user, wallet }) {
  const payload = {
    user,
    wallet,
    permissions: ['read', 'write', 'like'],
  };
  const { token, jwtid } = jwtSign(payload);
  res.cookie('likecoin_auth', token, AUTH_COOKIE_OPTION);
  await dbRef.doc(user).collection('session').doc(jwtid).create({
    lastAccessedUserAgent: req.headers['user-agent'] || 'unknown',
    lastAccessedIP: req.headers['x-real-ip'] || req.ip,
    lastAccessedTs: Date.now(),
    ts: Date.now(),
  });
}

export async function clearAuthCookies(req, res) {
  if (req.cookies && req.cookies['__session']) { // eslint-disable-line dot-notation
    const sessionCookie = req.cookies['__session']; // eslint-disable-line dot-notation
    try {
      const cookiePayload = JSON.parse(sessionCookie);
      delete cookiePayload.likecoin;
      res.cookie('__session', JSON.stringify(cookiePayload), AUTH_COOKIE_OPTION);
    } catch (err) {
      // do nth
    }
  }
  res.clearCookie('likecoin_auth', AUTH_COOKIE_OPTION);
}

export function checkSignPayload(from, payload, sign) {
  const recovered = personalEcRecover(payload, sign);
  if (recovered.toLowerCase() !== from.toLowerCase()) {
    throw new ValidationError('RECOVEREED_ADDRESS_NOT_MATCH');
  }

  // trims away sign message header before JSON
  const message = web3.utils.hexToUtf8(payload);
  const actualPayload = JSON.parse(message.substr(message.indexOf('{')));
  const {
    wallet,
    ts,
  } = actualPayload;

  // check address match
  if (from !== wallet || !Validate.checkAddressValid(wallet)) {
    throw new ValidationError('PAYLOAD_WALLET_NOT_MATCH');
  }

  // Check ts expire
  if (Math.abs(ts - Date.now()) > FIVE_MIN_IN_MS) {
    throw new ValidationError('PAYLOAD_EXPIRED');
  }
  return actualPayload;
}

export function handleEmailBlackList(emailInput) {
  if ((process.env.CI || !IS_TESTNET) && !(W3C_EMAIL_REGEX.test(emailInput))) throw new ValidationError('invalid email');
  let email = emailInput.toLowerCase();
  const customBlackList = getEmailBlacklist();
  const BLACK_LIST_DOMAIN = disposableDomains.concat(customBlackList);
  const parts = email.split('@');
  if (BLACK_LIST_DOMAIN.includes(parts[1])) {
    throw new ValidationError('DOMAIN_NOT_ALLOWED');
  }
  customBlackList.forEach((keyword) => {
    if (parts[1].includes(keyword)) {
      throw new ValidationError('DOMAIN_NEED_EXTRA_CHECK');
    }
  });
  if (getEmailNoDot().includes(parts[1])) {
    email = `${parts[0].split('.').join('')}@${parts[1]}`;
  }
  return email;
}

async function userInfoQuery({
  user,
  wallet,
  email,
  firebaseUserId,
  platform,
  platformUserId,
}) {
  const userNameQuery = dbRef.doc(user).get().then((doc) => {
    const isOldUser = doc.exists;
    let oldUserObj;
    if (isOldUser) {
      const { wallet: docWallet } = doc.data();
      oldUserObj = doc.data();
      if (wallet && docWallet !== wallet) throw new ValidationError('USER_ALREADY_EXIST');
    }
    return { isOldUser, oldUserObj };
  });

  const walletQuery = wallet ? dbRef.where('wallet', '==', wallet).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const docUser = doc.id;
      if (user !== docUser) {
        throw new ValidationError('WALLET_ALREADY_EXIST');
      }
    });
    return true;
  }) : Promise.resolve();

  const emailQuery = email ? dbRef.where('email', '==', email).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const docUser = doc.id;
      if (user !== docUser) {
        throw new ValidationError('EMAIL_ALREADY_USED');
      }
    });
    return true;
  }) : Promise.resolve();

  const firebaseQuery = firebaseUserId ? dbRef.where('firebaseUserId', '==', firebaseUserId).get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const docUser = doc.id;
      if (user !== docUser) {
        throw new ValidationError('FIREBASE_USER_DUPLICATED');
      }
    });
    return true;
  }) : Promise.resolve();

  const authQuery = platform && platformUserId ? (
    authDbRef
      .where(`${platform}UserId`, '==', platformUserId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          const docUser = doc.id;
          if (user !== docUser) {
            throw new ValidationError('FIREBASE_USER_DUPLICATED');
          }
        });
        return true;
      })
  ) : Promise.resolve();

  const [{
    isOldUser,
    oldUserObj,
  }] = await Promise.all([
    userNameQuery,
    walletQuery,
    emailQuery,
    firebaseQuery,
    authQuery,
  ]);

  return { isOldUser, oldUserObj };
}

export async function checkUserInfoUniqueness({
  user,
  wallet,
  email,
  firebaseUserId,
  platform,
  platformUserId,
}) {
  const { isOldUser } = await userInfoQuery({
    user,
    wallet,
    email,
    firebaseUserId,
    platform,
    platformUserId,
  });
  return !isOldUser;
}

export async function checkIsOldUser({
  user,
  wallet,
  email,
  firebaseUserId,
}) {
  const { isOldUser, oldUserObj } = await userInfoQuery({
    user,
    wallet,
    email,
    firebaseUserId,
  });
  return isOldUser ? oldUserObj : null;
}

export async function checkReferrerExists(referrer) {
  const referrerRef = await dbRef.doc(referrer).get();
  if (!referrerRef.exists) throw new ValidationError('REFERRER_NOT_EXIST');
  if (!referrerRef.data().isEmailVerified) throw new ValidationError('REFERRER_EMAIL_UNVERIFIED');
  if (referrerRef.data().isBlackListed) {
    throw new ValidationError('REFERRER_LIMIT_EXCCEDDED');
  }
  return referrerRef.exists;
}

export async function checkEmailIsSoleLogin(id) {
  const [
    userDoc,
    authDoc,
  ] = await Promise.all([
    dbRef.doc(id).get(),
    authDbRef.doc(id).get(),
  ]);
  const user = userDoc.data();
  const userHasOauth = authDoc.exists && Object.keys(authDoc.data()).length;
  const { wallet } = user;
  return (!wallet && !userHasOauth);
}

export async function tryToLinkOAuthLogin({
  likeCoinId,
  platform,
  platformUserId,
}) {
  // Make sure no one has linked with this platform and user ID for OAuth login
  const query = await (
    authDbRef
      .where(`${platform}.userId`, '==', platformUserId)
      .limit(1)
      .get()
  );
  if (query.docs.length > 0) return false;

  // Add or update auth doc
  const authDocRef = authDbRef.doc(likeCoinId);
  await authDocRef.set({
    [platform]: {
      userId: platformUserId,
    },
  }, { merge: true });
  return true;
}

export async function tryToUnlinkOAuthLogin({
  likeCoinId,
  platform,
}) {
  // Check if auth doc exists
  const authDocRef = authDbRef.doc(likeCoinId);
  const authDoc = await authDocRef.get();
  if (!authDoc.exists) return false;

  const data = authDoc.data();
  if (!data[platform]) return false;
  const isSole = Object.keys(data).length <= 1;
  if (isSole) {
    // Make sure user has other sign in methods before unlink
    const userDoc = await dbRef.doc(likeCoinId).get();
    const { wallet } = userDoc.data();
    if (wallet) {
      await authDocRef.delete();
    } else {
      throw new ValidationError('USER_UNLINK_SOLE_OAUTH_LOGIN');
    }
  } else {
    await authDocRef.update({
      [platform]: FieldValue.delete(),
    });
  }
  return true;
}
