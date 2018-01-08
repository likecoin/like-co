import { Router } from 'express';

const Account = require('eth-lib/lib/account');
const Multer = require('multer');
const sha256 = require('js-sha256');
const sharp = require('sharp');
const Web3 = require('web3');

const dbRef = require('../util/firebase').collection;
const fbBucket = require('../util/firebase').bucket;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const ONE_DATE_IN_MS = 86400000;

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
      ts,
    } = JSON.parse(payload);

    // check address match
    if (from !== wallet) {
      throw new Error('wallet address not match');
    }

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new Error('payload expired');
    }

    // Check user/wallet uniqueness
    const userNameQuery = dbRef.doc(user).get().then((doc) => {
      const isOldUser = !doc.exists;
      if (isOldUser) {
        const { wallet: docWallet } = doc.data();
        if (docWallet !== from) throw new Error('User already Exist');
      }
      return isOldUser;
    });
    const walletQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        const docUser = doc.id;
        if (user !== docUser) {
          throw new Error('Wallet already Exist');
        }
      });
      return true;
    });
    const [isOldUser] = await Promise.all([userNameQuery, walletQuery]);

    // update avatar
    const { file } = req;
    let url;
    if (file) {
      const hash256 = sha256(file.buffer);
      if (hash256 !== avatarSHA256) throw new Error('avatar sha not match');
      const resizedBuffer = await sharp(file.buffer).resize(400, 400).toBuffer();
      file.buffer = resizedBuffer;
      [url] = await uploadFile(file, `likecoin_store_user_${user}`);
    }

    const updateObj = {
      displayName,
      wallet,
    };
    if (url) updateObj.avatar = url;
    if (!isOldUser) updateObj.timestamp = Date.now();
    await dbRef.doc(user).set(updateObj, { merge: true });

    res.status(200);
    res.end();
  } catch (err) {
    console.error(err || err.message);
    res.sendStatus(400);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const username = req.params.id;
    const doc = await dbRef.doc(username).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err || err.message);
    res.sendStatus(500);
  }
});

export default router;
