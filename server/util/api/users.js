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

const { userCollection: dbRef } = require('../firebase');

export const ONE_DATE_IN_MS = 86400000;

export function setSessionCookie(req, res, token) {
  let cookiePayload = { likecoin: token };
  if (req.cookies && req.cookies['__session']) { // eslint-disable-line dot-notation
    const sessionCookie = req.cookies['__session']; // eslint-disable-line dot-notation
    try {
      const decoded = JSON.parse(sessionCookie);
      cookiePayload = { ...decoded, ...cookiePayload };
    } catch (err) {
      // do nth
    }
  }
  res.cookie('__session', JSON.stringify(cookiePayload), AUTH_COOKIE_OPTION);
}

export async function setAuthCookies(req, res, { user, wallet }) {
  const payload = {
    user,
    wallet,
    permissions: ['read', 'write', 'like'],
  };
  const { token, jwtid } = jwtSign(payload);
  res.cookie('likecoin_auth', token, AUTH_COOKIE_OPTION);
  setSessionCookie(req, res, token);
  await dbRef.doc(user).collection('session').doc(jwtid).create({
    lastAccessedUserAgent: req.headers['user-agent'] || 'unknown',
    lastAccessedIP: req.headers['x-real-ip'] || req.ip,
    lastAccessedTs: Date.now(),
    ts: Date.now(),
  });
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
  if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
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
}) {
  const userNameQuery = dbRef.doc(user).get().then((doc) => {
    const isOldUser = doc.exists;
    let oldUserObj;
    if (isOldUser) {
      const { wallet: docWallet } = doc.data();
      oldUserObj = doc.data();
      if (docWallet !== wallet) throw new ValidationError('USER_ALREADY_EXIST');
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
  const [{
    isOldUser, oldUserObj,
  }] = await Promise.all([userNameQuery, walletQuery, emailQuery, firebaseQuery]);
  return { isOldUser, oldUserObj };
}

export async function checkUserInfoUniqueness({
  user,
  wallet,
  email,
  firebaseUserId,
}) {
  const { isOldUser } = await userInfoQuery({
    user,
    wallet,
    email,
    firebaseUserId,
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
