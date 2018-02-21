import { Router } from 'express';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import { sendVerificationEmail, sendVerificationWithCouponEmail } from '../util/ses';
import { IS_TESTNET } from '../../constant';

import Validate from '../../util/ValidationHelper';

const Account = require('eth-lib/lib/account');
const Multer = require('multer');
const sha256 = require('js-sha256');
const sharp = require('sharp');
const Web3 = require('web3');
const imageType = require('image-type');
const uuidv4 = require('uuid/v4');

const {
  userCollection: dbRef,
  bucket: fbBucket,
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

function uploadFile(file, newFilename) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file'));
    }
    const filename = newFilename || file.originalname;
    const blob = fbBucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobStream.on('error', (err) => {
      reject(new Error(`Something is wrong! ${err || err.msg}`));
    });
    blobStream.on('finish', () => {
      resolve(blob.getSignedUrl({
        action: 'read',
        expires: '01-07-2047',
      }));
    });
    blobStream.end(file.buffer);
  });
}

function typedSignatureHash(signData) {
  const paramSignatures = signData.map(item => ({ type: 'string', value: `${item.type} ${item.name}` }));
  const params = signData.map(item => ({ type: item.type, value: item.value }));
  return Web3.utils.soliditySha3(
    { type: 'bytes32', value: Web3.utils.soliditySha3(...paramSignatures) },
    { type: 'bytes32', value: Web3.utils.soliditySha3(...params) },
  );
}

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
      let oldEmail;
      if (isOldUser) {
        const { wallet: docWallet } = doc.data();
        oldEmail = doc.data().email;
        if (docWallet !== from) throw new Error('User already exist');
      }
      return { isOldUser, oldEmail };
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
    const [{ isOldUser, oldEmail }] = await Promise.all([userNameQuery, walletQuery, emailQuery]);

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
      [url] = await uploadFile(file, `likecoin_store_user_${user}_${IS_TESTNET ? 'test' : 'main'}`);
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
    if (!isOldUser) updateObj.timestamp = Date.now();
    await dbRef.doc(user).set(updateObj, { merge: true });

    res.sendStatus(200);
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
    const { coupon } = req.body;
    const userRef = dbRef.doc(username);
    const doc = await userRef.get();
    if (doc.exists) {
      const user = doc.data();
      if (!user.email) throw new Error('Invalid email');
      if (user.isEmailVerified) throw new Error('Already verified');
      if (user.lastVerifyTs && Math.abs(user.lastVerifyTs - Date.now()) < THIRTY_S_IN_MS) {
        throw new Error('An email has already been sent recently, Please try again later');
      }
      let { verificationUUID } = user;
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
          await sendVerificationWithCouponEmail(res, user, coupon);
        } else {
          await sendVerificationEmail(res, user);
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
      res.json({ wallet: user.data().wallet });
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
