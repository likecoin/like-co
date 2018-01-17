import { Router } from 'express';

import Validate from '../../util/ValidationHelper';

const Web3 = require('web3');

const LIKECOIN = require('../../constant/contract/likecoin');
const accounts = require('../config/accounts.js');

const router = Router();

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/ywCD9mvUruQeYcZcyghk'));
const LikeCoin = new web3.eth.Contract(LIKECOIN.LIKE_COIN_ABI, LIKECOIN.LIKE_COIN_ADDRESS);
const {
  address,
  privateKey,
  gasPrice,
  gasLimit,
} = accounts[0];

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
    } = req.body;
    if (!Validate.checkAddressValid(to) || !Validate.checkAddressValid(from)) {
      throw new Error('Invalid address');
    }
    const methodCall = LikeCoin.methods.transferDelegated(
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
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;
