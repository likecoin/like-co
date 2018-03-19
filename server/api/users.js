import { Router } from 'express';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import { sendVerificationEmail, sendVerificationWithCouponEmail } from '../util/ses';
import {
  IS_TESTNET,
  PUBSUB_TOPIC_MISC,
} from '../../constant';

import Validate from '../../util/ValidationHelper';
import { typedSignatureHash } from '../util/web3';
import { uploadFileAndGetLink } from '../util/fileupload';
import publisher from '../util/gcloudPub';

const Account = require('eth-lib/lib/account');
const Multer = require('multer');
const sha256 = require('js-sha256');
const sharp = require('sharp');
const imageType = require('image-type');
const uuidv4 = require('uuid/v4');

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

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const ONE_DATE_IN_MS = 86400000;
const THIRTY_S_IN_MS = 30000;
const W3C_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const router = Router();

router.put('/users/new', multer.single('avatar'), async (req, res) => {
  try {
    const { from, payload, sign } = req.body;

    const signData = [
      { type: 'string', name: 'payload', value: payload },
    ];
    const hash = typedSignatureHash(signData);
    const recovered = Account.recover(hash, sign);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      throw new Error('recovered address not match');
    }

    const {
      user,
      displayName,
      wallet,
      avatarSHA256,
      email,
      ts,
      referrer,
      locale,
    } = JSON.parse(payload);

    // check address match
    if (from !== wallet || !Validate.checkAddressValid(wallet)) {
      throw new Error('wallet address not match');
    }

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new Error('payload expired');
    }

    if (email && !(W3C_EMAIL_REGEX.test(email))) {
      throw new Error('invalid email');
    }

    // Check user/wallet uniqueness
    const userNameQuery = dbRef.doc(user).get().then((doc) => {
      const isOldUser = doc.exists;
      let oldUserObj;
      if (isOldUser) {
        const { wallet: docWallet } = doc.data();
        oldUserObj = doc.data();
        if (docWallet !== from) throw new Error('User already exist');
      }
      return { isOldUser, oldUserObj };
    });
    const walletQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const docUser = doc.id;
        if (user !== docUser) {
          throw new Error('Wallet already exist');
        }
      });
      return true;
    });
    const emailQuery = email ? dbRef.where('email', '==', email).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const docUser = doc.id;
        if (user !== docUser) {
          throw new Error('Email already used');
        }
      });
      return true;
    }) : Promise.resolve();
    const [{
      isOldUser, oldUserObj,
    }] = await Promise.all([userNameQuery, walletQuery, emailQuery]);

    let oldAvatar = null;
    let oldEmail = '';
    if (isOldUser && oldUserObj) {
      oldEmail = oldUserObj.email;
      oldAvatar = oldUserObj.avatar;
    }

    // check username length
    if (!isOldUser) {
      if (!/^[a-z0-9-_]+$/.test(user)) throw new Error('Invalid user name char');
      if (user.length < 7 || user.length > 20) throw new Error('Invalid user name length');
    }

    // update avatar
    const { file } = req;
    let url;
    if (file) {
      const type = imageType(file.buffer);
      if (!SUPPORTED_AVATER_TYPE.has(type && type.ext)) throw new Error('unsupported file format!');
      const hash256 = sha256(file.buffer);
      if (hash256 !== avatarSHA256) throw new Error('avatar sha not match');
      const resizedBuffer = await sharp(file.buffer).resize(400, 400).toBuffer();
      file.buffer = resizedBuffer;
      [url] = await uploadFileAndGetLink(file, `likecoin_store_user_${user}_${IS_TESTNET ? 'test' : 'main'}`);
    }

    let hasReferrer = false;
    if (!isOldUser && referrer) {
      const referrerRef = await dbRef.doc(referrer).get();
      if (!referrerRef.exists) throw new Error('referrer not exist');
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
    }
    if (url) updateObj.avatar = url;
    if (locale) updateObj.locale = locale;
    if (!isOldUser) updateObj.timestamp = Date.now();
    if (hasReferrer) updateObj.referrer = referrer;
    await dbRef.doc(user).set(updateObj, { merge: true });

    if (hasReferrer) {
      await dbRef.doc(referrer).collection('referrals').doc(user).create({ timestamp: Date.now() });
    }

    res.sendStatus(200);
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: !isOldUser ? 'eventUserRegister' : 'eventUserEdit',
      user,
      email,
      displayName,
      wallet,
      avatar: url || oldAvatar,
      referrer,
      locale,
    });
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/users/referral/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const col = await dbRef.doc(username).collection('referrals').get();
    if (col.docs) {
      const pending = col.docs.filter(d => !d.data().isEmailVerified).length;
      const verified = col.docs.filter(d => d.data().isEmailVerified).length;
      res.json({ pending, verified });
    } else {
      res.json({ pending: 0, verified: 0 });
    }
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/users/id/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const doc = await dbRef.doc(username).get();
    if (doc.exists) {
      const payload = doc.data();
      if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);
      res.json(Validate.filterUserData(payload));
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/users/addr/:addr', async (req, res) => {
  try {
    const { addr } = req.params;
    if (!Validate.checkAddressValid(addr)) throw new Error('Invalid address');
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
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/email/verify/user/:id/', async (req, res) => {
  try {
    const username = req.params.id;
    const { coupon, ref } = req.body;
    const userRef = dbRef.doc(username);
    const doc = await userRef.get();
    let user = {};
    let verificationUUID;
    if (doc.exists) {
      user = doc.data();
      if (!user.email) throw new Error('Invalid email');
      if (user.isEmailVerified) throw new Error('Already verified');
      if (user.lastVerifyTs && Math.abs(user.lastVerifyTs - Date.now()) < THIRTY_S_IN_MS) {
        throw new Error('An email has already been sent recently, Please try again later');
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
    });
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/email/verify/:uuid', async (req, res) => {
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
      const { referrer } = user.data();
      if (referrer) {
        await dbRef.doc(referrer).collection('referrals').doc(user.id).update({ isEmailVerified: true });
      }
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
      });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;
