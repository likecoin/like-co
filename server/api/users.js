import { Router } from 'express';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import BigNumber from 'bignumber.js';
import { sendVerificationEmail, sendVerificationWithCouponEmail } from '../util/ses';
import {
  PUBSUB_TOPIC_MISC,
  ONE_LIKE,
} from '../../constant';
import {
  handleEmailBlackList,
  checkReferrerExists,
  checkUserInfoUniqueness,
  checkIsOldUser,
  checkSignPayload,
  setSessionCookie,
  setAuthCookies,
  clearAuthCookies,
} from '../util/api/users';
import { tryToLinkSocialPlatform } from '../util/api/social';

import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';
import { handleAvatarUploadAndGetURL } from '../util/fileupload';
import { jwtAuth } from '../util/jwt';
import publisher from '../util/gcloudPub';

const Multer = require('multer');
const uuidv4 = require('uuid/v4');
const RateLimit = require('express-rate-limit');
const {
  REGISTER_LIMIT_WINDOW,
  REGISTER_LIMIT_COUNT,
  NEW_USER_BONUS_COOLDOWN,
} = require('../config/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const {
  userCollection: dbRef,
  FieldValue,
  admin,
} = require('../util/firebase');

export const THIRTY_S_IN_MS = 30000;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const router = Router();

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

router.post('/users/new', apiLimiter, multer.single('avatar'), async (req, res, next) => {
  try {
    let payload;
    let firebaseUserId;
    const { platform } = req.body;

    if (!platform) throw new ValidationError('INVALID_PLATFORM');

    if (platform === 'wallet') {
      const {
        from,
        payload: stringPayload,
        sign,
      } = req.body;
      payload = checkSignPayload(from, stringPayload, sign);
    } else {
      const { firebaseIdToken } = req.body;
      ({ uid: firebaseUserId } = await admin.auth().verifyIdToken(firebaseIdToken));
      payload = req.body;
    }

    const {
      user,
      displayName = user,
      wallet,
      avatarSHA256,
      referrer,
      locale = 'en',
      accessToken,
      secret,
    } = payload;
    let { email, isEmailEnabled = true } = payload;

    // handle isEmailEnabled is string
    if (typeof isEmailEnabled === 'string') {
      isEmailEnabled = isEmailEnabled !== 'false';
    }

    if (!Validate.checkUserNameValid(user)) throw new ValidationError('Invalid user name');

    if (email) {
      try {
        email = handleEmailBlackList(email);
      } catch (err) {
        if (err.message === 'DOMAIN_NOT_ALLOWED' || err.message === 'DOMAIN_NEED_EXTRA_CHECK') {
          publisher.publish(PUBSUB_TOPIC_MISC, req, {
            logType: 'eventBlockEmail',
            user,
            email,
            displayName,
            wallet,
            referrer: referrer || undefined,
            locale,
          });
        }
        throw err;
      }
    }

    const isNew = await checkUserInfoUniqueness({
      user,
      wallet,
      email,
      firebaseUserId,
    });
    if (!isNew) throw new ValidationError('USER_ALREADY_EXIST');

    // upload avatar
    const { file } = req;
    let avatarUrl;
    if (file) {
      avatarUrl = await handleAvatarUploadAndGetURL(user, file, avatarSHA256);
    }
    let hasReferrer = false;
    if (referrer) {
      try {
        hasReferrer = await checkReferrerExists(referrer);
      } catch (err) {
        if (err.message === 'REFERRER_LIMIT_EXCCEDDED') {
          publisher.publish(PUBSUB_TOPIC_MISC, req, {
            logType: 'eventBlockReferrer',
            user,
            email,
            displayName,
            wallet,
            referrer,
            locale,
          });
        }
        throw err;
      }
    }
    const createObj = {
      displayName,
      wallet,
      isEmailEnabled,
      firebaseUserId,
      avatar: avatarUrl,
      locale,
    };

    const timestampObj = { timestamp: Date.now() };
    if (NEW_USER_BONUS_COOLDOWN) {
      timestampObj.bonusCooldown = Date.now() + NEW_USER_BONUS_COOLDOWN;
    }
    Object.assign(createObj, timestampObj);

    if (hasReferrer) createObj.referrer = referrer;

    Object.keys(createObj).forEach((key) => {
      if (createObj[key] === undefined) {
        delete createObj[key];
      }
    });

    await dbRef.doc(user).create(createObj);
    if (hasReferrer) {
      await dbRef.doc(referrer).collection('referrals').doc(user).create(timestampObj);
    }

    const socialPayload = await tryToLinkSocialPlatform(user, platform, { accessToken, secret });

    await setAuthCookies(req, res, { user, wallet });
    res.sendStatus(200);

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventUserRegister',
      user,
      email: email || undefined,
      displayName,
      wallet,
      avatar: avatarUrl,
      referrer: referrer || undefined,
      locale,
      registerTime: createObj.timestamp,
    });
    if (socialPayload) {
      publisher.publish(PUBSUB_TOPIC_MISC, req, {
        logType: 'eventSocialLink',
        platform,
        user,
        email: email || undefined,
        displayName,
        wallet,
        referrer: referrer || undefined,
        locale,
        registerTime: createObj.timestamp,
        ...socialPayload,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/users/update', jwtAuth('write'), multer.single('avatar'), async (req, res, next) => {
  try {
    const {
      user,
      displayName,
      wallet,
      avatarSHA256,
      locale,
    } = req.body;
    let { email, isEmailEnabled } = req.body;

    // handle isEmailEnable is string
    if (typeof isEmailEnabled === 'string') {
      isEmailEnabled = isEmailEnabled !== 'false';
    }

    const oldUserObj = await checkIsOldUser({ user, wallet, email });
    if (!oldUserObj) throw new ValidationError('USER_NOT_FOUND');

    if (oldUserObj.wallet && oldUserObj.wallet !== wallet) {
      throw new ValidationError('USER_WALLET_NOT_MATCH');
    }

    if (email) {
      try {
        email = handleEmailBlackList(email);
      } catch (err) {
        if (err.message === 'DOMAIN_NOT_ALLOWED' || err.message === 'DOMAIN_NEED_EXTRA_CHECK') {
          publisher.publish(PUBSUB_TOPIC_MISC, req, {
            logType: 'eventBlockEmail',
            user,
            email,
            displayName,
            wallet,
            referrer: oldUserObj.referrer || undefined,
            locale,
          });
        }
        throw err;
      }
    }

    // update avatar
    const { file } = req;
    let avatarUrl;
    if (file) {
      avatarUrl = await handleAvatarUploadAndGetURL(user, file, avatarSHA256);
    }
    const updateObj = {
      displayName,
      wallet,
      isEmailEnabled,
      avatar: avatarUrl,
      locale,
    };
    const oldEmail = oldUserObj.email;
    if (email && email !== oldEmail) {
      updateObj.email = email;
      updateObj.verificationUUID = FieldValue.delete();
      updateObj.isEmailVerified = false;
      updateObj.lastVerifyTs = FieldValue.delete();
    }

    Object.keys(updateObj).forEach((key) => {
      if (updateObj[key] === undefined) {
        delete updateObj[key];
      }
    });

    await dbRef.doc(user).update(updateObj);
    res.sendStatus(200);

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventUserUpdate',
      user,
      email: email || oldEmail,
      displayName,
      wallet,
      avatar: avatarUrl || oldUserObj.avatar,
      referrer: oldUserObj.referrer,
      locale,
      registerTime: oldUserObj.timestamp,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/users/login/check', jwtAuth('read'), async (req, res) => {
  const { wallet } = req.body;
  if (req.user.wallet !== wallet) {
    res.status(401).send('LOGIN_NEEDED');
    return;
  }
  setSessionCookie(req, res, req.cookies.likecoin_auth);
  res.sendStatus(200);
  await dbRef.doc(req.user.user).collection('session').doc(req.user.jti).update({
    lastAccessedUserAgent: req.headers['user-agent'] || 'unknown',
    lastAccessedIP: req.headers['x-real-ip'] || req.ip,
    lastAccessedTs: Date.now(),
  });
});

router.post('/users/login', async (req, res, next) => {
  try {
    let user;
    let wallet;
    const { platform } = req.body;

    if (!platform) throw new ValidationError('INVALID_PLATFORM');

    if (platform === 'wallet') {
      const {
        from,
        payload: stringPayload,
        sign,
      } = req.body;
      wallet = from;
      checkSignPayload(wallet, stringPayload, sign);
      const query = await dbRef.where('wallet', '==', wallet).get();
      if (query.docs.length > 0) {
        user = query.docs[0].id;
      }
    } else {
      const { firebaseIdToken } = req.body;
      const { uid: firebaseUserId } = await admin.auth().verifyIdToken(firebaseIdToken);
      const query = await dbRef.where('firebaseUserId', '==', firebaseUserId).get();
      if (query.docs.length > 0) {
        user = query.docs[0].id;
      }
    }
    if (user) {
      await setAuthCookies(req, res, { user, wallet });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/users/logout', (req, res) => {
  clearAuthCookies(req, res);
  res.sendStatus(200);
});

router.post('/users/login/add', jwtAuth('write'), async (req, res, next) => {
  try {
    const { user, platform } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (!platform) throw new ValidationError('INVALID_PLATFORM');

    if (platform === 'wallet') {
      const {
        from,
        payload: stringPayload,
        sign,
      } = req.body;
      const wallet = from;
      const payload = checkSignPayload(wallet, stringPayload, sign);
      if (payload !== user) throw new ValidationError('WALLET_NOT_MATCH');
      const query = await dbRef.where('wallet', '==', wallet).get();
      if (query.docs.length > 0) throw new ValidationError('WALLET_ALREADY_USED');
      await dbRef.doc(user).update({ wallet });
    } else {
      const { accessToken, secret, firebaseIdToken } = req.body;
      const { uid: firebaseUserId } = await admin.auth().verifyIdToken(firebaseIdToken);
      const query = await dbRef.where('firebaseUserId', '==', firebaseUserId).get();
      if (query.docs.length > 0) {
        query.forEach((doc) => {
          const docUser = doc.id;
          if (user !== docUser) {
            throw new ValidationError('FIREBASE_USER_DUPLICATED');
          }
        });
      } else {
        await dbRef.doc(user).update({ firebaseUserId });
      }

      const socialPayload = await tryToLinkSocialPlatform(user, platform, { accessToken, secret });

      if (socialPayload) {
        const userDoc = await dbRef.doc(user).get();
        const {
          email,
          displayName,
          wallet,
          referrer,
          locale,
          timestamp,
        } = userDoc.data();
        publisher.publish(PUBSUB_TOPIC_MISC, req, {
          logType: 'eventSocialLink',
          platform,
          user,
          email,
          displayName,
          wallet,
          referrer,
          locale,
          registerTime: timestamp,
          ...socialPayload,
        });
      }

      /* TODO: update firebase auth linked platform info in a subcollection? */
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.get('/users/self', jwtAuth('read'), async (req, res, next) => {
  try {
    const username = req.user.user;
    const doc = await dbRef.doc(username).get();
    if (doc.exists) {
      const payload = doc.data();
      payload.user = username;
      if (payload.wallet && !payload.avatar) {
        payload.avatar = toDataUrl(payload.wallet);
      }
      res.json(Validate.filterUserData(payload));
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
      if (payload.wallet && !payload.avatar) {
        payload.avatar = toDataUrl(payload.wallet);
      }
      payload.user = username;
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
      if (payload.wallet && !payload.avatar) {
        payload.avatar = toDataUrl(payload.wallet);
      }
      payload.user = username;
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
      if (payload.wallet && !payload.avatar) {
        payload.avatar = toDataUrl(payload.wallet);
      }
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
