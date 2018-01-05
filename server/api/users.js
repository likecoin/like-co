import { Router } from 'express'
const Account = require("eth-lib/lib/account");
const Multer = require('multer');

const dbRef = require("../util/firebase").collection;
const fbBucket = require("../util/firebase").bucket;

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

function uploadFile(file, newFilename) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No file');
    }
    const filename = newFilename || file.originalname;
    const blob = fbBucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobStream.on('error', (err) => {
      reject(`Something is wrong! ${err || err.msg}`);
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

const router = Router()

// Mock Users
const USERS = {
  williamchong007: {
    displayName: 'William Chong',
    wallet: '0x98e6269f33d3191b6e6DEdD01e93c51cc14257d3',
    avatar: 'https://firebasestorage.googleapis.com/v0/b/likecoin-foundation.appspot.com/o/18341999_10155300823687920_3191374639800195485_n.jpg?alt=media',
  },
  ckxpress: {
    displayName: 'Kin',
    wallet: '0x83D3F8effbf3924D34F51531ce57C97C9fA2E5CF',
    avatar: 'https://likecoin.foundation/static/img/kin.749505b.png',
  },
}

router.put("/users/new", multer.single('avatar'), async (req, res) => {
  try {
    const {from, payload, sign} = req.body;

    // const recovered = Account.recover(payload, sign);
    // if (recovered.toLowerCase() !== from.toLowerCase()) {
    //   throw "recovered address not match";
    // }

    const { user, displayName, wallet } = JSON.parse(payload);
    if (from !== wallet) {
       throw "wallet address not match";
    }

    const userNameQuery = dbRef.doc(user).get().then(doc => {
        if (doc.exists) {
          const { wallet } = doc.data();
          if (wallet !== from) throw "User already Exist";
        }
        return true;
    });
    const walletQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
        snapshot.forEach(doc => {
          const docUser = doc.id;
          if (user !== docUser) {
            throw "Wallet already Exist";
          }
        });
        return true;
    });

    await Promise.all([userNameQuery, walletQuery]);

    const file = req.file;
    let url = undefined;
    if (file) {
      url = await uploadFile(file, `likecoin_store_user_${user}`);
    }

    const updateObj = {
       displayName,
       wallet,
       timestamp: Date.now(),
    }
    if (url) updateObj.avatar = url;
    const updateUserQuery = await dbRef.doc(user).set(updateObj, { merge: true });

    res.status(200);
    res.end();
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
});

router.get('/users/:id', async (req, res, next) => {
  try {
    const username = req.params.id;
    const doc = await dbRef.doc(username).get();
    if (doc.exists) {
      res.json(doc.data());
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router
