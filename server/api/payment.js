import { Router } from 'express';
import BigNumber from 'bignumber.js';

import {
  ONE_LIKE,
  PUBSUB_TOPIC_MISC,
  TRANSACTION_QUERY_LIMIT,
} from '../../constant';
import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';
import { logTransferDelegatedTx, logETHTx } from '../util/logger';
import { web3, sendTransactionWithLoop } from '../util/web3';
import { jwtAuth } from '../util/jwt';
import publisher from '../util/gcloudPub';

const LIKECOIN = require('../../constant/contract/likecoin');
const {
  txCollection: txLogRef,
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

const LikeCoin = new web3.eth.Contract(LIKECOIN.LIKE_COIN_ABI, LIKECOIN.LIKE_COIN_ADDRESS);

/* temp hack to handle medium referrer */
const mediumRegexp = new RegExp('^(?:https?:\\/\\/)?medium\\.com\\/media\\/[a-zA-Z0-9_]+\\?postId=([a-zA-Z0-9_]+)');

router.post('/payment', async (req, res, next) => {
  try {
    const {
      from,
      to,
      value,
      maxReward,
      nonce,
      signature,
      httpReferrer,
    } = req.body;
    if (!Validate.checkAddressValid(to) || !Validate.checkAddressValid(from)) {
      throw new ValidationError('Invalid address');
    }
    const balance = await LikeCoin.methods.balanceOf(from).call();
    if ((new BigNumber(balance)).lt(new BigNumber(value))) throw new ValidationError('Not enough balance');
    const fromQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const fromUser = snapshot.docs[0].data();
        if (fromUser.isBlackListed) {
          publisher.publish(PUBSUB_TOPIC_MISC, req, {
            logType: 'eventBakError',
            user: snapshot.docs[0].id,
            wallet: fromUser.wallet,
            displayName: fromUser.displayName,
            email: fromUser.email,
            referrer: fromUser.referrer,
            locale: fromUser.locale,
            registerTime: fromUser.timestamp,
          });
          throw new ValidationError('ERROR_FROM_BAK');
        }
        return {
          fromId: snapshot.docs[0].id,
          fromDisplayName: fromUser.displayName,
          fromEmail: fromUser.email,
          fromReferrer: fromUser.referrer,
          fromLocale: fromUser.locale,
          fromRegisterTime: fromUser.timestamp,
        };
      }
      return {};
    });
    const toQuery = dbRef.where('wallet', '==', to).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const toUser = snapshot.docs[0].data();
        if (toUser.isBlackListed) {
          publisher.publish(PUBSUB_TOPIC_MISC, req, {
            logType: 'eventBakError',
            user: snapshot.docs[0].id,
            wallet: toUser.wallet,
            displayName: toUser.displayName,
            email: toUser.email,
            referrer: toUser.referrer,
            locale: toUser.locale,
            registerTime: toUser.timestamp,
          });
          throw new ValidationError('ERROR_TO_BAK');
        }
        return {
          toId: snapshot.docs[0].id,
          toDisplayName: toUser.displayName,
          toEmail: toUser.email,
          toReferrer: toUser.referrer,
          toLocale: toUser.locale,
          toRegisterTime: toUser.timestamp,
        };
      }
      return {};
    });
    const [{
      fromId,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
      fromRegisterTime,
    }, {
      toId,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
      toRegisterTime,
    },
    currentBlock,
    ] = await Promise.all([fromQuery, toQuery, web3.eth.getBlockNumber()]);
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
      gasPrice,
      delegatorAddress,
    } = await sendTransactionWithLoop(
      LIKECOIN.LIKE_COIN_ADDRESS,
      txData,
    );
    res.json({ txHash });

    const txRecord = {
      txHash,
      from,
      to,
      value,
      fromId: fromId || null,
      toId: toId || null,
      currentBlock,
      nonce: pendingCount,
      rawSignedTx: tx.rawTransaction,
      delegatorAddress: web3.utils.toChecksumAddress(delegatorAddress),
    };

    /* temp hack to handle medium referrer */
    if (httpReferrer) {
      const match = mediumRegexp.exec(decodeURIComponent(httpReferrer));
      if (match && match[1]) {
        txRecord.remarks = `@LikeCoin Widget: https://medium.com/p/${match[1]}`;
      }
    }

    await logTransferDelegatedTx(txRecord);
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventPay',
      fromUser: fromId,
      fromWallet: from,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
      fromRegisterTime,
      toUser: toId,
      toWallet: to,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
      toRegisterTime,
      likeAmount: new BigNumber(value).dividedBy(ONE_LIKE).toNumber(),
      likeAmountUnitStr: new BigNumber(value).toFixed(),
      txHash,
      txStatus: 'pending',
      txNonce: pendingCount,
      gasPrice,
      currentBlock,
      txSignature: signature,
      delegatorAddress: web3.utils.toChecksumAddress(delegatorAddress),
      sourceURL: httpReferrer,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/payment/eth', async (req, res, next) => {
  try {
    const {
      from,
      to,
      value,
      txHash,
    } = req.body;
    let fromUser;
    const fromQuery = dbRef.where('wallet', '==', from).get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
        fromUser = snapshot.docs[0].data();
        return {
          fromId: snapshot.docs[0].id,
          fromDisplayName: fromUser.displayName,
          fromEmail: fromUser.email,
          fromReferrer: fromUser.referrer,
          fromLocale: fromUser.locale,
          fromRegisterTime: fromUser.timestamp,
        };
      }
      return {};
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
          toRegisterTime: toUser.timestamp,
        };
      }
      return {};
    });
    const [{
      fromId,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
      fromRegisterTime,
    }, {
      toId,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
      toRegisterTime,
    }] = await Promise.all([fromQuery, toQuery]);
    await logETHTx({
      txHash,
      from,
      to,
      value,
      fromId: fromId || null,
      toId: toId || null,
    });
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventPayETH',
      fromUser: fromId,
      fromWallet: from,
      fromDisplayName,
      fromEmail,
      fromReferrer,
      fromLocale,
      fromRegisterTime,
      toUser: toId,
      toWallet: to,
      toDisplayName,
      toEmail,
      toReferrer,
      toLocale,
      toRegisterTime,
      ETHAmount: new BigNumber(value).dividedBy(ONE_LIKE).toNumber(),
      ETHAmountUnitStr: new BigNumber(value).toFixed(),
      txHash,
      txStatus: 'pending',
    });
    res.json({ txHash });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/tx/id/:id', async (req, res, next) => {
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
    next(err);
  }
});

router.get('/tx/history/addr/:addr', jwtAuth, async (req, res, next) => {
  try {
    const { addr } = req.params;
    if (req.user.wallet !== addr) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
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
    next(err);
  }
});

export default router;
