import { Router } from 'express';

import axios from '../../plugins/axios';
import Validate from '../../util/ValidationHelper';
import {
  web3,
  personalEcRecover,
  sendTransactionWithLoop,
} from '../util/web3';

import {
  callKYCAPI,
  getKYCAPIStatus,
} from '../util/kycApi';

import {
  KYC_STATUS_ENUM,
  IS_TESTNET,
  PUBSUB_TOPIC_MISC,
} from '../../constant';
import { logRegisterKYC } from '../util/logger';
import publisher from '../util/gcloudPub';

const { RECAPTCHA_SECRET } = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies
const querystring = require('querystring');
const Multer = require('multer');

const LIKECOIN_ICO = require('../../constant/contract/likecoin-ico');
const {
  userCollection: dbRef,
} = require('../util/firebase');

const sha256 = require('js-sha256');
const imageType = require('image-type');

const ONE_DATE_IN_MS = 86400000;

const router = Router();

const LikeCoinICO = new web3.eth.Contract(
  LIKECOIN_ICO.LIKE_COIN_ICO_ABI,
  LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
);

const SUPPORTED_DOCUMENT_TYPE = new Set([
  'jpg',
  'jpeg',
  'png',
]);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // no larger than 2mb, you can change as needed.
  },
});

function handleDocumentUpload(user, file, documentSHA256) {
  const type = imageType(file.buffer);
  if (!SUPPORTED_DOCUMENT_TYPE.has(type && type.ext)) throw new Error('unsupported file format!');
  const hash256 = sha256(file.buffer);
  if (hash256 !== documentSHA256) throw new Error('document sha not match');
}

router.post('/kyc', async (req, res) => {
  try {
    const {
      from,
      payload,
      sign,
      reCaptchaResponse,
    } = req.body;

    if (!Validate.checkAddressValid(from)) {
      throw new Error('Invalid address');
    }

    const recovered = personalEcRecover(payload, sign);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      throw new Error('recovered address not match');
    }

    if (!reCaptchaResponse) throw new Error('reCAPTCHA missing');
    const { data } = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: RECAPTCHA_SECRET,
        response: reCaptchaResponse,
        remoteip: req.headers['x-real-ip'] || req.ip,
      }),
    );
    if (!data || !data.success) throw new Error('reCAPTCHA Failed');

    const message = web3.utils.hexToUtf8(payload);
    const {
      user,
      ts,
      notPRC,
      notUSA,
      isUSAAccredited,
    } = JSON.parse(message.substr(message.indexOf('{')));

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new Error('payload expired');
    }
    if (!notPRC || (!notUSA && !isUSAAccredited)) throw new Error('Invalid KYC');

    const userRef = dbRef.doc(user);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error('Invalid user');
    if (!userDoc.data().isEmailVerified) throw new Error('Email not verified');
    const { wallet, email } = userDoc.data();
    if (wallet !== from) throw new Error('User wallet not match');

    const kycCheck = await LikeCoinICO.methods.kycDone(from).call();
    if (!IS_TESTNET && kycCheck) throw new Error('Already KYC-ed');
    if (userDoc.data().pendingKYC || userDoc.data().KYC) throw new Error('KYC already in progress');

    const methodCall = LikeCoinICO.methods.registerKYC([wallet]);
    const txData = methodCall.encodeABI();
    const {
      tx,
      txHash,
      delegatorAddress,
      pendingCount,
    } = await sendTransactionWithLoop(
      LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
      txData,
    );
    const currentBlock = await web3.eth.getBlockNumber();

    const upateKYC = userRef.collection('ICO').doc('KYC').set({
      wallet,
      email,
      notPRC,
      notUSA,
      isUSAAccredited,
      txHash,
      clientTs: ts,
      ts: Date.now(),
      currentBlock,
      nonce: pendingCount,
      KYC: KYC_STATUS_ENUM.STANDARD,
    });
    const updateUser = userRef.update({
      KYC: KYC_STATUS_ENUM.STANDARD,
    });
    await Promise.all([upateKYC, updateUser]);

    await logRegisterKYC({
      txHash,
      from,
      fromId: user,
      to: LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
      toId: 'LikeCoinTokenSale',
      currentBlock,
      nonce: pendingCount,
      rawSignedTx: tx.rawTransaction,
      delegatorAddress: web3.utils.toChecksumAddress(delegatorAddress),
    });

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventStandardKYC',
      user,
      email,
      wallet,
      notPRC,
      notUSA,
      isUSAAccredited,
      txHash,
      txStatus: 'pending',
      txNonce: pendingCount,
      currentBlock,
    });

    res.json({ txHash });
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.post('/kyc/advanced', multer.array('documents', 2), async (req, res) => {
  try {
    const {
      from,
      payload,
      sign,
      reCaptchaResponse,
    } = req.body;

    if (!Validate.checkAddressValid(from)) {
      throw new Error('Invalid address');
    }

    const recovered = personalEcRecover(payload, sign);
    if (recovered.toLowerCase() !== from.toLowerCase()) {
      throw new Error('recovered address not match');
    }

    if (!reCaptchaResponse) throw new Error('reCAPTCHA missing');
    const { data } = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      querystring.stringify({
        secret: RECAPTCHA_SECRET,
        response: reCaptchaResponse,
        remoteip: req.headers['x-real-ip'] || req.ip,
      }),
    );
    if (!data || !data.success) throw new Error('reCAPTCHA Failed');

    const message = web3.utils.hexToUtf8(payload);
    const {
      user,
      ts,
      notPRC,
      notUSA,
      isUSAAccredited,
      firstName,
      lastName,
      nationality,
      country,
      document0SHA256,
      document1SHA256,
    } = JSON.parse(message.substr(message.indexOf('{')));

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new Error('payload expired');
    }
    if (!notPRC || (!notUSA && !isUSAAccredited) || !firstName || !lastName || !country) throw new Error('Invalid KYC');
    if (!document0SHA256 || !document1SHA256) throw new Error('Invalid checksum');

    const { files } = req;
    if (!files || files.length !== 2) throw new Error('Invalid document');

    handleDocumentUpload(user, files[0], document0SHA256);
    handleDocumentUpload(user, files[1], document1SHA256);

    const userRef = dbRef.doc(user);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error('Invalid user');
    if (!userDoc.data().isEmailVerified) throw new Error('Email not verified');
    const { wallet, email, KYC } = userDoc.data();
    if (wallet !== from) throw new Error('User wallet not match');

    if (userDoc.data().pendingKYC || userDoc.data().KYC >= KYC_STATUS_ENUM.ADVANCED) throw new Error('KYC already in progress');

    const methodCall = LikeCoinICO.methods.registerKYC([wallet]);
    const txData = methodCall.encodeABI();
    const {
      tx,
      txHash,
      pendingCount,
      delegatorAddress,
    } = await sendTransactionWithLoop(
      LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
      txData,
    );
    const currentBlock = await web3.eth.getBlockNumber();

    const upateKYC = userRef.collection('ICO').doc('KYC').set({
      wallet,
      email,
      notPRC,
      notUSA,
      isUSAAccredited,
      country,
      nationality,
      firstName,
      lastName,
      txHash,
      clientTs: ts,
      ts: Date.now(),
      currentBlock,
      nonce: pendingCount,
    });
    const updatePayload = {
      pendingKYC: true,
    };
    if (!KYC || KYC < KYC_STATUS_ENUM.STANDARD) {
      updatePayload.KYC = KYC_STATUS_ENUM.PENDING;
    }
    const updateUser = userRef.update(updatePayload);
    await Promise.all([upateKYC, updateUser]);

    await logRegisterKYC({
      txHash,
      from,
      fromId: user,
      to: LIKECOIN_ICO.LIKE_COIN_ICO_ADDRESS,
      toId: 'LikeCoinTokenSale',
      currentBlock,
      nonce: pendingCount,
      rawSignedTx: tx.rawTransaction,
      delegatorAddress: web3.utils.toChecksumAddress(delegatorAddress),
    });

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventAdvancedKYC',
      user,
      email,
      wallet,
      notPRC,
      notUSA,
      isUSAAccredited,
      firstName,
      lastName,
      country,
      nationality,
      document0SHA256,
      document1SHA256,
      txHash,
      txStatus: 'pending',
      txNonce: pendingCount,
      currentBlock,
    });

    res.json({ txHash });
    const status = await callKYCAPI({
      user,
      firstName,
      lastName,
      country,
      nationality,
      selfieFile: files[0],
      passportFile: files[1],
      email,
    });
    if (status === 'CLEARED' || status === 'ACCEPTED') {
      await Promise.all([
        userRef.update({
          KYC: KYC_STATUS_ENUM.ADVANCED,
          pendingKYC: false,
        }),
        userRef.collection('ICO').doc('KYC').set({
          KYC: KYC_STATUS_ENUM.ADVANCED,
        }),
      ]);
    }
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

router.get('/kyc/advanced/:id', async (req, res) => {
  const { id } = req.params;
  const status = await getKYCAPIStatus(id);
  if (status === 'CLEARED' || status === 'ACCEPTED') {
    await Promise.all([
      dbRef.doc(id).update({
        KYC: KYC_STATUS_ENUM.ADVANCED,
        pendingKYC: false,
      }),
      dbRef.doc(id).collection('ICO').doc('KYC').set({
        KYC: KYC_STATUS_ENUM.ADVANCED,
      }),
    ]);
  }
  res.json({ status });
});

export default router;
