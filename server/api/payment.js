import { Router } from 'express';
import BigNumber from 'bignumber.js';

import {
  ONE_LIKE,
  PUBSUB_TOPIC_MISC,
} from '../../constant';
import Validate from '../../util/ValidationHelper';
import { logTransferDelegatedTx, logETHTx } from '../util/logger';
import { web3, sendTransactionWithLoop } from '../util/web3';

import publisher from '../util/gcloudPub';

const LIKECOIN = require('../../constant/contract/likecoin');
const {
  txCollection: txLogRef,
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

const LikeCoin = new web3.eth.Contract(LIKECOIN.LIKE_COIN_ABI, LIKECOIN.LIKE_COIN_ADDRESS);

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
    const { tx, txHash, pendingCount } = await sendTransactionWithLoop(
      LIKECOIN.LIKE_COIN_ADDRESS,
      txData,
    );
    res.json({ txHash });
    const fromQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const fromUser = snapshot.docs[0].data();
        return {
          fromId: snapshot.docs[0].id,
          fromDisplayName: fromUser.displayName,
          fromEmail: fromUser.email,
          fromReferrer: fromUser.referrer,
          fromLocale: fromUser.locale,
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
          toLocale: toUser.locale,
        };
      }
      return true;
    });
    const [{
      fromId,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
    }, {
      toId,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
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
      rawSignedTx: tx.rawTransaction,
      delegatorAddress: web3.utils.toChecksumAddress(address),
    });
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventPay',
      fromUser: fromId,
      fromWallet: from,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
      toUser: toId,
      toWallet: to,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
      likeAmount: new BigNumber(value).dividedBy(ONE_LIKE).toNumber(),
      likeAmountUnitStr: new BigNumber(value).toFixed(),
      txHash,
      txStatus: 'pending',
      txNonce: pendingCount,
      currentBlock,
      txSignature: signature,
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
          fromLocale: fromUser.locale,
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
          toLocale: toUser.locale,
        };
      }
      return true;
    });
    const [{
      fromId,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
    }, {
      toId,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
    }] = await Promise.all([fromQuery, toQuery]);
    await logETHTx({
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
      fromLocale,
      toUser: toId,
      toWallet: to,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
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
      res.json(Validate.filterTxData(payload));
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
