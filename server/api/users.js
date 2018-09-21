import { Router } from 'express';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import BigNumber from 'bignumber.js';
import { sendVerificationEmail, sendVerificationWithCouponEmail } from '../util/ses';
import {
  IS_TESTNET,
  TEST_MODE,
  PUBSUB_TOPIC_MISC,
  ONE_LIKE,
} from '../../constant';
import { getEmailBlacklist, getEmailNoDot } from '../util/poller';

import axios from '../../plugins/axios';
import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';
import { personalEcRecover, web3 } from '../util/web3';
import { uploadFileAndGetLink } from '../util/fileupload';
import { jwtSign, jwtAuth, jwtVerify } from '../util/jwt';
import publisher from '../util/gcloudPub';


const querystring = require('querystring');
const Multer = require('multer');
const sha256 = require('js-sha256');
const sharp = require('sharp');
const imageType = require('image-type');
const uuidv4 = require('uuid/v4');
const disposableDomains = require('disposable-email-domains');
const RateLimit = require('express-rate-limit');
const {
  RECAPTCHA_SECRET,
  REGISTER_LIMIT_WINDOW,
  REGISTER_LIMIT_COUNT,
  NEW_USER_BONUS_COOLDOWN,
} = require('../config/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const {
  userCollection: dbRef,
  FieldValue,
} = require('../util/firebase');

const SUPPORTED_AVATER_TYPE = new Set([
  'jpg',
  'png',
  'gif',
  'webp',
  'tif',
  'bmp',
]);

const AUTH_COOKIE_OPTION = {
  maxAge: 31556926000, // 365d
  domain: TEST_MODE ? undefined : '.like.co',
  secure: !TEST_MODE,
  httpOnly: true,
};

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const ONE_DATE_IN_MS = 86400000;
const THIRTY_S_IN_MS = 30000;
const W3C_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const router = Router();

function setSessionCookie(req, res, payload) {
  /* eslint-disable no-param-reassign */

  /* make sure exp exist */
  if (!payload.exp) payload.exp = Math.floor(Date.now() / 1000);
  /* prevent exisiting aud/iss causing error */
  delete payload.aud;
  delete payload.iss;

  /* eslint-enable no-param-reassign */

  let token = jwtSign(payload);
  if (req.cookies && req.cookies['__session']) { // eslint-disable-line dot-notation
    const sessionCookie = req.cookies['__session'];// eslint-disable-line dot-notation
    try {
      const decoded = jwtVerify(sessionCookie, { ignoreExpiration: true });
      token = jwtSign({ ...decoded, ...payload });
    } catch (err) {
      // do nth
    }
  }
  res.cookie('__session', token, AUTH_COOKIE_OPTION);
}

function setAuthCookies(req, res, { user, wallet }) {
  const payload = {
    user,
    wallet,
    permissions: ['read', 'write', 'like'],
  };
  const token = jwtSign(payload);
  res.cookie('likecoin_auth', token, AUTH_COOKIE_OPTION);
  setSessionCookie(req, res, payload);
}

const apiLimiter = new RateLimit({
  windowMs: REGISTER_LIMIT_WINDOW,
  max: REGISTER_LIMIT_COUNT || 0,
  skipFailedRequests: true,
  keyGenerator: req => (req.headers['x-real-ip'] || req.ip),
  onLimitReached: (req) => {
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventAPILimitReached',
    });
  },
});

router.put('/users/new', apiLimiter, multer.single('avatar'), async (req, res, next) => {
  try {
    const {
      from,
      payload,
      sign,
      reCaptchaResponse,
    } = req.body;
    const recovered = personalEcRecover(payload, sign);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      throw new ValidationError('recovered address not match');
    }

    const message = web3.utils.hexToUtf8(payload);
    const actualPayload = JSON.parse(message.substr(message.indexOf('{')));
    const {
      user,
      displayName,
      wallet,
      avatarSHA256,
      isEmailEnabled,
      ts,
      referrer,
      locale,
    } = actualPayload;

    let { email } = actualPayload;

    // trims away sign message header before JSON

    // check address match
    if (from !== wallet || !Validate.checkAddressValid(wallet)) {
      throw new ValidationError('wallet address not match');
    }

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new ValidationError('payload expired');
    }

    if (email) {
      if ((process.env.CI || !IS_TESTNET) && !(W3C_EMAIL_REGEX.test(email))) throw new ValidationError('invalid email');
      email = email.toLowerCase();
      const customBlackList = getEmailBlacklist();
      const BLACK_LIST_DOMAIN = disposableDomains.concat(customBlackList);
      const parts = email.split('@');
      if (BLACK_LIST_DOMAIN.includes(parts[1])) {
        publisher.publish(PUBSUB_TOPIC_MISC, req, {
          logType: 'eventBlockEmail',
          user,
          email,
          displayName,
          wallet,
          referrer: referrer || undefined,
          locale,
        });
        throw new ValidationError('email domain not allowed');
      }
      customBlackList.forEach((keyword) => {
        if (parts[1].includes(keyword)) {
          publisher.publish(PUBSUB_TOPIC_MISC, req, {
            logType: 'eventBlockEmail',
            user,
            email,
            displayName,
            wallet,
            keyword,
            referrer: referrer || undefined,
            locale,
          });
          throw new ValidationError('email domain needs extra verification, please contact us in intercom');
        }
      });
      if (getEmailNoDot().includes(parts[1])) {
        email = `${parts[0].split('.').join('')}@${parts[1]}`;
      }
    }

    // Check user/wallet uniqueness
    const userNameQuery = dbRef.doc(user).get().then((doc) => {
      const isOldUser = doc.exists;
      let oldUserObj;
      if (isOldUser) {
        const { wallet: docWallet } = doc.data();
        oldUserObj = doc.data();
        if (docWallet !== from) throw new ValidationError('USER_ALREADY_EXIST');
      }
      return { isOldUser, oldUserObj };
    });
    const walletQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const docUser = doc.id;
        if (user !== docUser) {
          throw new ValidationError('Wallet already exist');
        }
      });
      return true;
    });
    const emailQuery = email ? dbRef.where('email', '==', email).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const docUser = doc.id;
        if (user !== docUser) {
          throw new ValidationError('EMAIL_ALREADY_USED');
        }
      });
      return true;
    }) : Promise.resolve();
    const [{
      isOldUser, oldUserObj,
    }] = await Promise.all([userNameQuery, walletQuery, emailQuery]);

    let oldAvatar;
    let oldEmail = '';
    if (isOldUser && oldUserObj) {
      oldEmail = oldUserObj.email;
      oldAvatar = oldUserObj.avatar;
    }

    // check username length
    if (!isOldUser) {
      if (!/^[a-z0-9-_]+$/.test(user)) throw new ValidationError('Invalid user name char');
      if (user.length < 7 || user.length > 20) throw new ValidationError('Invalid user name length');
      /* istanbul ignore if */
      if (!IS_TESTNET) {
        if (!reCaptchaResponse) throw new ValidationError('reCAPTCHA missing');
        const { data } = await axios.post(
          'https://www.recaptcha.net/recaptcha/api/siteverify',
          querystring.stringify({
            secret: RECAPTCHA_SECRET,
            response: reCaptchaResponse,
            remoteip: req.headers['x-real-ip'] || req.ip,
          }),
        );
        if (!data || !data.success) throw new ValidationError('reCAPTCHA Failed');
      }
    }

    // update avatar
    const { file } = req;
    let url;
    if (file) {
      const type = imageType(file.buffer);
      if (!SUPPORTED_AVATER_TYPE.has(type && type.ext)) throw new ValidationError('unsupported file format!');
      const hash256 = sha256(file.buffer);
      if (hash256 !== avatarSHA256) throw new ValidationError('avatar sha not match');
      const resizedBuffer = await sharp(file.buffer).resize(400, 400).toBuffer();
      file.buffer = resizedBuffer;
      [url] = await uploadFileAndGetLink(file, `likecoin_store_user_${user}_${IS_TESTNET ? 'test' : 'main'}`);
    }

    let hasReferrer = false;
    if (!isOldUser && referrer) {
      const referrerRef = await dbRef.doc(referrer).get();
      if (!referrerRef.exists) throw new ValidationError('REFERRER_NOT_EXIST');
      if (!referrerRef.data().isEmailVerified) throw new ValidationError('referrer email not verified');
      if (referrerRef.data().isBlackListed) {
        publisher.publish(PUBSUB_TOPIC_MISC, req, {
          logType: 'eventBlockReferrer',
          user,
          email,
          displayName,
          wallet,
          referrer,
          locale,
        });
        throw new ValidationError('referrer limit exceeded');
      }
      hasReferrer = referrerRef.exists;
    }

    const updateObj = {
      displayName,
      wallet,
    };
    if (email && email !== oldEmail) {
      updateObj.email = email;
      updateObj.verificationUUID = FieldValue.delete();
      updateObj.isEmailVerified = false;
      updateObj.lastVerifyTs = FieldValue.delete();
    }
    if (typeof isEmailEnabled !== 'undefined') {
      updateObj.isEmailEnabled = isEmailEnabled;
    }
    if (url) updateObj.avatar = url;
    if (locale) updateObj.locale = locale;

    const timestampObj = { timestamp: Date.now() };
    if (NEW_USER_BONUS_COOLDOWN) {
      timestampObj.bonusCooldown = Date.now() + NEW_USER_BONUS_COOLDOWN;
    }
    if (!isOldUser) Object.assign(updateObj, timestampObj);
    if (hasReferrer) updateObj.referrer = referrer;
    await dbRef.doc(user).set(updateObj, { merge: true });

    if (hasReferrer) {
      await dbRef.doc(referrer).collection('referrals').doc(user).create(timestampObj);
    }
    setAuthCookies(req, res, { user, wallet });
    res.sendStatus(200);

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: !isOldUser ? 'eventUserRegister' : 'eventUserEdit',
      user,
      email: email || undefined,
      displayName,
      wallet,
      avatar: url || oldAvatar,
      referrer: referrer || undefined,
      locale,
      registerTime: isOldUser ? oldUserObj.timestamp : updateObj.timestamp,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/users/login/check', jwtAuth('read'), (req, res) => {
  const { wallet } = req.body;
  if (req.user.wallet !== wallet) {
    res.status(401).send('LOGIN_NEEDED');
    return;
  }
  try {
    // eslint-disable-next-line no-underscore-dangle
    const payload = jwtVerify(req.cookies.__session, { ignoreExpiration: true });
    if (!payload.user || !payload.wallet
      || payload.user !== req.user.user
      || payload.wallet !== req.user.wallet) {
      throw new Error('session is missing user');
    }
  } catch (err) {
    setSessionCookie(req, res, req.user);
  }
  res.sendStatus(200);
});

router.post('/users/login', async (req, res, next) => {
  try {
    const { from, payload, sign } = req.body;
    const recovered = personalEcRecover(payload, sign);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      throw new ValidationError('recovered address not match');
    }
    const query = await dbRef.where('wallet', '==', from).get();
    if (query.docs.length > 0) {
      const user = query.docs[0].id;
      setAuthCookies(req, res, { user, wallet: from });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/referral/:id', jwtAuth('read'), async (req, res, next) => {
  try {
    const username = req.params.id;
    if (req.user.user !== username) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    const col = await dbRef.doc(username).collection('referrals').get();
    if (col.docs) {
      const pending = col.docs.filter(d => !d.data().isEmailVerified).length;
      const verified = col.docs.filter(d => d.data().isEmailVerified).length;
      res.json({ pending, verified });
    } else {
      res.json({ pending: 0, verified: 0 });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/id/:id', jwtAuth('read'), async (req, res, next) => {
  try {
    const username = req.params.id;
    if (req.user.user !== username) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    const doc = await dbRef.doc(username).get();
    if (doc.exists) {
      const payload = doc.data();
      if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);
      res.json(Validate.filterUserData(payload));
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/id/:id/min', async (req, res, next) => {
  try {
    const username = req.params.id;
    const doc = await dbRef.doc(username).get();
    if (doc.exists) {
      const payload = doc.data();
      if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);
      res.json(Validate.filterUserDataMin(payload));
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/merchant/:id/min', async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    const query = await dbRef.where('merchantId', '==', merchantId).get();
    if (query.docs.length > 0) {
      const payload = query.docs[0].data();
      if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);
      payload.user = query.docs[0].id;
      res.json(Validate.filterUserDataMin(payload));
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/addr/:addr', jwtAuth('read'), async (req, res, next) => {
  try {
    const { addr } = req.params;
    if (!Validate.checkAddressValid(addr)) throw new ValidationError('Invalid address');
    if (req.user.wallet !== addr) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    const query = await dbRef.where('wallet', '==', addr).get();
    if (query.docs.length > 0) {
      const payload = query.docs[0].data();
      if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);
      payload.user = query.docs[0].id;
      res.json(Validate.filterUserData(payload));
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/addr/:addr/min', async (req, res, next) => {
  try {
    const { addr } = req.params;
    if (!Validate.checkAddressValid(addr)) throw new ValidationError('Invalid address');
    const query = await dbRef.where('wallet', '==', addr).get();
    if (query.docs.length > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/email/verify/user/:id/', async (req, res, next) => {
  try {
    const username = req.params.id;
    const { coupon, ref } = req.body;
    const userRef = dbRef.doc(username);
    const doc = await userRef.get();
    let user = {};
    let verificationUUID;
    if (doc.exists) {
      user = doc.data();
      if (!user.email) throw new ValidationError('Invalid email');
      if (user.isEmailVerified) throw new ValidationError('Already verified');
      if (user.lastVerifyTs && Math.abs(user.lastVerifyTs - Date.now()) < THIRTY_S_IN_MS) {
        throw new ValidationError('An email has already been sent recently, Please try again later');
      }
      ({ verificationUUID } = user);
      if (!verificationUUID) {
        verificationUUID = uuidv4();
        user.verificationUUID = verificationUUID;
      }
      await userRef.update({
        lastVerifyTs: Date.now(),
        verificationUUID,
      });
      try {
        if (coupon && /[2-9A-HJ-NP-Za-km-z]{8}/.test(coupon)) {
          await sendVerificationWithCouponEmail(res, user, coupon, ref);
        } else {
          await sendVerificationEmail(res, user, ref);
        }
      } catch (err) {
        await userRef.update({
          lastVerifyTs: FieldValue.delete(),
          verificationUUID: FieldValue.delete(),
        });
        throw err;
      }
    } else {
      res.sendStatus(404);
    }
    res.sendStatus(200);
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventSendVerifyEmail',
      user: username,
      email: user.email,
      displayName: user.displayName,
      wallet: user.wallet,
      avatar: user.avatar,
      verificationUUID,
      referrer: user.referrer,
      locale: user.locale,
      registerTime: user.timestamp,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/email/verify/:uuid', async (req, res, next) => {
  try {
    const verificationUUID = req.params.uuid;
    const query = await dbRef.where('verificationUUID', '==', verificationUUID).get();
    if (query.docs.length > 0) {
      const [user] = query.docs;
      await user.ref.update({
        lastVerifyTs: FieldValue.delete(),
        verificationUUID: FieldValue.delete(),
        isEmailVerified: true,
      });

      const promises = [];
      const payload = { done: true };
      const { referrer } = user.data();
      if (referrer) {
        promises.push(dbRef.doc(referrer).collection('referrals').doc(user.id).update({ isEmailVerified: true }));
      } else {
        payload.bonusId = 'none';
      }
      promises.push(dbRef.doc(user.id).collection('mission').doc('verifyEmail').set(payload, { merge: true }));
      await Promise.all(promises);
      res.json({ referrer: !!user.data().referrer, wallet: user.data().wallet });
      const userObj = user.data();
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'eventVerify',
        user: user.id,
        email: userObj.email,
        displayName: userObj.displayName,
        wallet: userObj.wallet,
        avatar: userObj.avatar,
        verificationUUID,
        referrer: userObj.referrer,
        locale: userObj.locale,
        registerTime: userObj.timestamp,
      });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/users/bonus/:id', jwtAuth('read'), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.user !== id) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    const query = await dbRef.doc(id).collection('bonus').get();
    const sum = query.docs
      .filter(t => t.data().txHash && t.data().value)
      .reduce((acc, t) => acc.plus(new BigNumber(t.data().value)), new BigNumber(0));
    res.json({ bonus: sum.dividedBy(ONE_LIKE).toFixed(4) });
  } catch (err) {
    next(err);
  }
});

router.post('/users/email/:id', jwtAuth('write'), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.user !== id) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    const doc = await dbRef.doc(id).get();
    if (!doc.exists) throw new Error('user not found');
    const {
      isEmailEnabled,
    } = req.body;
    if (typeof (isEmailEnabled) !== 'boolean') throw new Error('invalid input');
    await doc.ref.update({ isEmailEnabled });
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.put('/users/read/:id', jwtAuth('write'), async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.user !== id) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const doc = await dbRef.doc(id).get();
    if (!doc.exists) throw new Error('user not found');
    const {
      likebuttonIntro,
    } = req.body;

    const updateObj = {};
    if (typeof (likebuttonIntro) !== 'boolean') {
      throw new Error('invalid input');
    } else {
      updateObj['read.likebuttonIntro'] = likebuttonIntro;
    }

    await dbRef.doc(id).update(updateObj);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export default router;
