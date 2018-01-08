import { Router } from 'express';

const Account = require('eth-lib/lib/account');
const Multer = require('multer');
const sha256 = require('js-sha256');

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

const router = Router();

router.put('/users/new', multer.single('avatar'), async (req, res) => {
  try {
    const { from, payload, sign } = req.body;

    const recovered = Account.recover(payload, sign);
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

    if (from !== wallet) {
      throw new Error('wallet address not match');
    }
    if (ts + ONE_DATE_IN_MS > Date.now()) {
      throw new Error('payload expired');
    }

    const { file } = req;
    let url;
    if (file) {
      const hash256 = sha256(file.buffer);
      if (hash256 !== avatarSHA256) throw new Error('avatar sha not match');
      url = await uploadFile(file, `likecoin_store_user_${user}`);
    }

    const userNameQuery = dbRef.doc(user).get().then((doc) => {
      if (doc.exists) {
        const { wallet: docWallet } = doc.data();
        if (docWallet !== from) throw new Error('User already Exist');
      }
      return true;
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

    await Promise.all([userNameQuery, walletQuery]);
    const updateObj = {
      displayName,
      wallet,
      timestamp: Date.now(), // TODO: only update ts for new user
    };
    if (url) updateObj.avatar = url;
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
