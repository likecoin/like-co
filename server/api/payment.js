import { Router } from 'express';
import BigNumber from 'bignumber.js';

import {
  INFURA_HOST,
  ONE_LIKE,
  PUBSUB_TOPIC_MISC,
} from '../../constant';
import Validate from '../../util/ValidationHelper';
import { logTransferDelegatedTx } from '../util/logger';
import publisher from '../util/gcloudPub';

const Web3 = require('web3');

const txLogRef = require('../util/firebase').txCollection;
const LIKECOIN = require('../../constant/contract/likecoin');
const accounts = require('@ServerConfig/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies
const {
  db,
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_HOST));
const LikeCoin = new web3.eth.Contract(LIKECOIN.LIKE_COIN_ABI, LIKECOIN.LIKE_COIN_ADDRESS);
const {
  address,
  privateKey,
  gasPrice,
  gasLimit,
} = accounts[0];

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sendTransaction(tx) {
  return new Promise((resolve, reject) => {
    const txEventEmitter = web3.eth.sendSignedTransaction(tx.rawTransaction);
    txEventEmitter.on('transactionHash', resolve)
      .on('error', (err) => {
        if (err.message === 'Returned error: replacement transaction underpriced'
          || err.message.includes('Returned error: known transaction:')) resolve(false);
        else reject(err);
      });
  });
}

async function signTransaction(txData, count) {
  const pendingCount = count;
  const tx = await web3.eth.accounts.signTransaction({
    to: LIKECOIN.LIKE_COIN_ADDRESS,
    nonce: pendingCount,
    data: txData,
    gasPrice,
    gas: gasLimit,
  }, privateKey);
  return tx;
}

router.post('/payment', async (req, res) => {
  try {
    const {
      from,
      to,
      value,
      maxReward,
      nonce,
      signature,
    } = req.body;
    if (!Validate.checkAddressValid(to) || !Validate.checkAddressValid(from)) {
      throw new Error('Invalid address');
    }
    const balance = await LikeCoin.methods.balanceOf(from).call();
    if ((new BigNumber(balance)).lt(new BigNumber(value))) throw new Error('Not enough balance');
    const methodCall = LikeCoin.methods.transferDelegated(
      from,
      to,
      value,
      maxReward,
      maxReward,
      nonce,
      signature,
    );
    const txData = methodCall.encodeABI();
    const counterRef = txLogRef.doc('!counter');
    let pendingCount = await db.runTransaction(t => t.get(counterRef).then((d) => {
      const v = d.data().value + 1;
      t.update(counterRef, { value: v });
      return d.data().value;
    }));
    let tx = await signTransaction(txData, pendingCount);
    let txHash;
    try {
      txHash = await sendTransaction(tx);
    } catch (err) {
      console.log(`Nonce ${pendingCount} failed, trying web3 pending`);
    }
    while (!txHash) {
      /* eslint-disable no-await-in-loop */
      pendingCount = await web3.eth.getTransactionCount(address, 'pending');
      tx = await signTransaction(txData, pendingCount);
      txHash = await sendTransaction(tx);
      if (!txHash) {
        await timeout(200);
      }
    }
    await db.runTransaction(t => t.get(counterRef).then((d) => {
      if (pendingCount + 1 > d.data().value) {
        return t.update(counterRef, {
          value: pendingCount + 1,
        });
      }
      return Promise.resolve();
    }));
    res.json({ txHash });
    const fromQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const fromUser = snapshot.docs[0].data();
        return {
          fromId: snapshot.docs[0].id,
          fromDisplayName: fromUser.displayName,
          fromEmail: fromUser.email,
          fromReferrer: fromUser.referrer,
        };
      }
      return true;
    });
    const toQuery = dbRef.where('wallet', '==', to).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const toUser = snapshot.docs[0].data();
        return {
          toId: snapshot.docs[0].id,
          toDisplayName: toUser.displayName,
          toEmail: toUser.email,
          toReferrer: toUser.referrer,
        };
      }
      return true;
    });
    const [{
      fromId,
      fromDisplayName,
      fromEmail,
      fromReferrer,
    }, {
      toId,
      toDisplayName,
      toEmail,
      toReferrer,
    },
    currentBlock,
    ] = await Promise.all([fromQuery, toQuery, web3.eth.getBlockNumber()]);
    await logTransferDelegatedTx({
      txHash,
      from,
      to,
      value,
      fromId,
      toId,
      currentBlock,
      nonce: pendingCount,
    });
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventPay',
      fromUser: fromId,
      fromWallet: from,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      toUser: toId,
      toWallet: to,
      toDisplayName,
      toEmail,
      toReferrer,
      likeAmount: new BigNumber(value).dividedBy(ONE_LIKE).toNumber(),
      likeAmountUnitStr: new BigNumber(value).toFixed(),
      txHash,
      txStatus: 'pending',
      txNonce: pendingCount,
      currentBlock,
    });
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/payment/eth', async (req, res) => {
  try {
    const {
      from,
      to,
      value,
      txHash,
    } = req.body;
    const fromQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const fromUser = snapshot.docs[0].data();
        return {
          fromId: snapshot.docs[0].id,
          fromDisplayName: fromUser.displayName,
          fromEmail: fromUser.email,
          fromReferrer: fromUser.referrer,
        };
      }
      return true;
    });
    const toQuery = dbRef.where('wallet', '==', to).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const toUser = snapshot.docs[0].data();
        return {
          toId: snapshot.docs[0].id,
          toDisplayName: toUser.displayName,
          toEmail: toUser.email,
          toReferrer: toUser.referrer,
        };
      }
      return true;
    });
    const [{
      fromId,
      fromDisplayName,
      fromEmail,
      fromReferrer,
    }, {
      toId,
      toDisplayName,
      toEmail,
      toReferrer,
    }] = await Promise.all([fromQuery, toQuery]);
    await logTransferDelegatedTx({
      txHash,
      from,
      to,
      value,
      fromId,
      toId,
    });
    publisher.publish(PUBSUB_TOPIC_MISC, {
      logType: 'eventPayETH',
      fromUser: fromId,
      fromWallet: from,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      toUser: toId,
      toWallet: to,
      toDisplayName,
      toEmail,
      toReferrer,
      ETHAmount: new BigNumber(value).dividedBy(ONE_LIKE).toNumber(),
      ETHAmountUnitStr: new BigNumber(value).toFixed(),
      txHash,
      txStatus: 'pending',
    });
    res.json({ txHash });
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/tx/id/:id', async (req, res) => {
  try {
    const txHash = req.params.id;
    const doc = await txLogRef.doc(txHash).get();
    if (doc.exists) {
      const payload = doc.data();
      res.json(payload);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/tx/addr/to/:addr', async (req, res) => {
  try {
    const { addr } = req.params;
    const doc = await txLogRef
      .where('to', '==', addr)
      .orderBy('ts', 'desc')
      .limit(5)
      .get();
    res.json(doc.docs.map(d => ({ id: d.id, value: d.data().value })));
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/tx/addr/from/:addr', async (req, res) => {
  try {
    const { addr } = req.params;
    const doc = await txLogRef
      .where('from', '==', addr)
      .orderBy('ts', 'desc')
      .limit(5)
      .get();
    res.json(doc.docs.map(d => ({ id: d.id, value: d.data().value })));
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;
