import { Router } from 'express'
const Account = require("eth-lib/lib/account");

const dbRef = require("../util/firebase-db");

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

router.put("/users/new", async (req, res) => {
  try {
    const {from, payload, sign} = req.body;
    const recovered = Account.recover(payload, sign);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      throw "recovered address not match";
    }
    const { user, displayName, wallet, avatar } = JSON.parse(payload);
    if (from !== wallet || USERS[user]) {
      res.sendStatus(400);
      return;
    }
    USERS[user] = { displayName, wallet, avatar };
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
