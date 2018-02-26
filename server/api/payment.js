import { Router } from 'express';
import BigNumber from 'bignumber.js';

import { IS_TESTNET, INFURA_HOST } from '../../constant';
import Validate from '../../util/ValidationHelper';
import { logTransferDelegatedTx } from '../util/logger';

const Web3 = require('web3');

const txLogRef = require('../util/firebase').txCollection;
const LIKECOIN = require('../../constant/contract/likecoin');
const accounts = require('@ServerConfig/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies
const {
  userCollection: dbRef,
} = require('../util/firebase');
const { publisher } = require('../util/gcloudPub');

const router = Router();

const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_HOST));
const LikeCoin = new web3.eth.Contract(LIKECOIN.LIKE_COIN_ABI, LIKECOIN.LIKE_COIN_ADDRESS);
const {
  address,
  privateKey,
  gasPrice,
  gasLimit,
} = accounts[0];
const ONE_LIKE = new BigNumber(10).pow(18);

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
      v,
      r,
      s,
      signature,
    } = req.body;
    if (!Validate.checkAddressValid(to) || !Validate.checkAddressValid(from)) {
      throw new Error('Invalid address');
    }
    const balance = await LikeCoin.methods.balanceOf(from).call();
    if ((new BigNumber(balance)).lt(new BigNumber(value))) throw new Error('Not enough balance');
    /* TODO: clean up TESTNET code */
    let methodCall;
    if (IS_TESTNET) {
      methodCall = LikeCoin.methods.transferDelegated(
        from,
        to,
        value,
        maxReward,
        maxReward,
        nonce,
        v,
        r,
        s,
      );
    } else {
      methodCall = LikeCoin.methods.transferDelegated(
        from,
        to,
        value,
        maxReward,
        maxReward,
        nonce,
        signature,
      );
    }
    const txData = methodCall.encodeABI();
    let txHash;
    let pendingCount = await web3.eth.getTransactionCount(address, 'pending');
    while (!txHash) {
      // eslint-disable-next-line no-await-in-loop
      const tx = await signTransaction(txData, pendingCount);
      pendingCount += 1;
      txHash = await sendTransaction(tx); // eslint-disable-line no-await-in-loop
    }
    res.json({ txHash });
    await logTransferDelegatedTx({
      txHash,
      from,
      to,
      value,
    });
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
      fromId, fromDisplayName, fromEmail, fromReferrer,
    }, {
      toId, toDisplayName, toEmail, toReferrer,
    }] = await Promise.all([fromQuery, toQuery]);
    publisher.publish('misc', {
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
      txHash,
      txStatus: 'pending',
    });
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
