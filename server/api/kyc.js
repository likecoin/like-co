import { Router } from 'express';

import Validate from '../../util/ValidationHelper';
import {
  web3,
  typedSignatureHash,
  sendTransactionWithLoop,
} from '../util/web3';
import {
  KYC_STATUS_ENUM,
  IS_TESTNET,
} from '../../constant';
import { uploadFileAndGetMeta } from '../util/fileupload';

const Multer = require('multer');
const Account = require('eth-lib/lib/account');

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
  'png',
]);

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

async function handleDocumentUpload(user, file, documentSHA256s, index) {
  const type = imageType(file.buffer);
  if (!SUPPORTED_DOCUMENT_TYPE.has(type && type.ext)) throw new Error('unsupported file format!');
  const hash256 = sha256(file.buffer);
  if (hash256 !== documentSHA256s[index]) throw new Error('document sha not match');
  const [meta] = await uploadFileAndGetMeta(file, `ico/likecoin_store_user_${user}_${index}_${IS_TESTNET ? 'test' : 'main'}`);
  return meta;
}

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
      KYC: KYC_STATUS_ENUM.STANDARD,
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

router.post('/kyc/advanced', multer.array('documents', 2), async (req, res) => {
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
      passportName,
      country,
      document0SHA256,
      document1SHA256,
    } = JSON.parse(payload);

    // Check ts expire
    if (Math.abs(ts - Date.now()) > ONE_DATE_IN_MS) {
      throw new Error('payload expired');
    }
    if (!notPRC || !notUSA || !passportName || !country) throw new Error('Invalid KYC');
    if (!document0SHA256 || !document1SHA256) throw new Error('Invalid checksum');

    const documentSHA256s = [document0SHA256, document1SHA256];

    const userRef = dbRef.doc(user);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new Error('Invalid user');
    if (!userDoc.data().isEmailVerified) throw new Error('Email not verified');
    const { wallet, email, KYC } = userDoc.data();
    if (wallet !== from) throw new Error('User wallet not match');

    if (userDoc.data().pendingKYC || userDoc.data().KYC >= KYC_STATUS_ENUM.ADVANCED) throw new Error('KYC already in progress');

    const { files } = req;
    if (!files || files.length !== 2) throw new Error('Invalid document');

    const document0 = await handleDocumentUpload(user, files[0], documentSHA256s, 0);
    const document1 = await handleDocumentUpload(user, files[1], documentSHA256s, 1);

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
      country,
      passportName,
      document0,
      document1,
      txHash,
      clientTs: ts,
      ts: Date.now(),
      currentBlock,
      nonce: pendingCount,
    });
    const updatePayload = {};
    if (KYC && KYC >= KYC_STATUS_ENUM.STANDARD) {
      updatePayload.pendingKYC = true;
    } else {
      updatePayload.KYC = KYC_STATUS_ENUM.PENDING;
    }
    const updateUser = userRef.update(updatePayload);
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
