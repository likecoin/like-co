import { Router } from 'express';

import Validate from '../../util/ValidationHelper';
import {
  web3,
  typedSignatureHash,
  sendTransactionWithLoop,
} from '../util/web3';

const Account = require('eth-lib/lib/account');

const LIKECOIN_ICO = require('../../constant/contract/likecoin-ico');
const {
  userCollection: dbRef,
} = require('../util/firebase');

const ONE_DATE_IN_MS = 86400000;

const router = Router();

const LikeCoinICO = new web3.eth.Contract(
  LIKECOIN_ICO.LIKE_COIN_ICO_ABI,
  LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
);

router.post('/kyc', async (req, res) => {
  try {
    const { from, payload, sign } = req.body;

    if (!Validate.checkAddressValid(from)) {
      throw new Error('Invalid address');
    }

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
      ts,
      notPRC,
      notUSA,
      isBelowThersold,
    } = JSON.parse(payload);

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new Error('payload expired');
    }
    if (!notPRC || !notUSA || !isBelowThersold) throw new Error('Invalid KYC');

    const userRef = dbRef.doc(user);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error('Invalid user');
    if (!userDoc.data().isEmailVerified) throw new Error('Email not verified');
    const { wallet, email } = userDoc.data();
    if (wallet !== from) throw new Error('User wallet not match');

    const kycCheck = await LikeCoinICO.methods.kycDone(from).call();
    if (kycCheck) throw new Error('Already KYC-ed');
    if (userDoc.data().pendingKYC || userDoc.data().KYC) throw new Error('KYC already in progress');

    const methodCall = LikeCoinICO.methods.registerKYC([wallet]);
    const txData = methodCall.encodeABI();
    const { txHash, pendingCount } = await sendTransactionWithLoop(
      LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
      txData,
    );
    const currentBlock = await web3.eth.getBlockNumber();

    const upateKYC = userRef.collection('ICO').doc('KYC').set({
      wallet,
      email,
      notPRC,
      notUSA,
      isBelowThersold,
      txHash,
      clientTs: ts,
      ts: Date.now(),
      currentBlock,
      nonce: pendingCount,
    });
    const updateUser = userRef.update({
      KYC: 2,
    });
    await Promise.all([upateKYC, updateUser]);

    res.json({ txHash });
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;
