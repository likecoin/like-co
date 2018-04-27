import { Router } from 'express';
import BigNumber from 'bignumber.js';

import {
  ONE_LIKE,
  ETH_TO_LIKECOIN_RATIO,
  PUBSUB_TOPIC_MISC,
  TRANSACTION_QUERY_LIMIT,
} from '../../constant';
import Validate from '../../util/ValidationHelper';
import { logTransferDelegatedTx, logETHTx } from '../util/logger';
import { web3, sendTransactionWithLoop } from '../util/web3';
import { sendPreSale } from '../util/ses';

import publisher from '../util/gcloudPub';

const LIKECOIN = require('../../constant/contract/likecoin');
const LIKECOIN_ICO = require('../../constant/contract/likecoin-ico');
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
    const {
      tx,
      txHash,
      pendingCount,
      delegatorAddress,
    } = await sendTransactionWithLoop(
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
      delegatorAddress: web3.utils.toChecksumAddress(delegatorAddress),
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
      isPreSale,
    } = req.body;
    let fromUserRef;
    let fromUser;
    const fromQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        fromUserRef = snapshot.docs[0].ref;
        fromUser = snapshot.docs[0].data();
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
    if ((isPreSale && to === LIKECOIN_ICO.LIKE_COIN_PRESALE_ADDRESS) ||
      (to === LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS)) {
      const eth = new BigNumber(value).dividedBy(ONE_LIKE);
      const base = eth.multipliedBy(new BigNumber(ETH_TO_LIKECOIN_RATIO));
      let bonus = new BigNumber(0);
      if (isPreSale && eth.gte(new BigNumber(10))) {
        bonus = base.multipliedBy(new BigNumber(0.25));
      }
      const updateObj = {
        txHash,
        fromId,
        value,
        base: base.toString(),
        ts: Date.now(),
      };
      if (isPreSale) {
        updateObj.bonus = bonus.toString();
      }
      const promises = [
        fromUserRef.collection(isPreSale ? 'PreSale' : 'ICO').doc(txHash).create(updateObj),
        fromUserRef.collection('mission').doc('joinTokenSale').get()
          .then((doc) => {
            if (!doc.exists || !doc.data().done) {
              return doc.ref.set({ status: 'pending' }, { merge: true });
            }
            return true;
          }),
      ];
      if (isPreSale) {
        promises.push(fromUserRef.update({ isPreSale }));
        promises.push(sendPreSale(res, fromUser, eth, base, bonus, txHash));
      } else {
        promises.push(fromUserRef.update({ isICO: true }));
      }

      await Promise.all(promises);
    }
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
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

router.get('/tx/history/addr/:addr', async (req, res) => {
  try {
    const { addr } = req.params;
    let { ts, count } = req.query;
    ts = Number(ts);
    if (!ts || Number.isNaN(ts)) ts = Date.now();
    count = Number(count);
    if (!count || Number.isNaN(count) || count > TRANSACTION_QUERY_LIMIT) {
      count = TRANSACTION_QUERY_LIMIT;
    }
    const queryTo = txLogRef
      .where('to', '==', web3.utils.toChecksumAddress(addr))
      .orderBy('ts', 'desc')
      .startAt(ts)
      .limit(count)
      .get();
    const queryFrom = txLogRef
      .where('from', '==', web3.utils.toChecksumAddress(addr))
      .orderBy('ts', 'desc')
      .startAt(ts)
      .limit(count)
      .get();
    const [dataTo, dataFrom] = await Promise.all([queryTo, queryFrom]);
    let results = dataTo.docs.concat(dataFrom.docs);
    results = results.map(d => ({ id: d.id, ...Validate.filterTxData(d.data()) }));
    results.sort((a, b) => (b.ts - a.ts));
    results.splice(count);
    res.json(results);
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/tx/tokensale/:addr', async (req, res) => {
  try {
    const { addr } = req.params;
    const doc = await txLogRef
      .where('from', '==', web3.utils.toChecksumAddress(addr))
      .where('to', '==', LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS)
      .orderBy('ts', 'desc')
      .get();
    res.json(doc.docs.map(d => ({ id: d.id, ...Validate.filterTxData(d.data()) })));
  } catch (err) {
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;
