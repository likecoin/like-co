import { Router } from 'express';

const Web3 = require('web3');

const LIKECOIN = require('../../constant/contract/likecoin');
const accounts = require('../config/accounts.js');

const router = Router();

const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/ywCD9mvUruQeYcZcyghk'));
const LikeCoin = new web3.eth.Contract(LIKECOIN.LIKE_COIN_ABI, LIKECOIN.LIKE_COIN_ADDRESS);
const {
  privateKey,
  gasPrice,
  gasLimit,
} = accounts[0];

function sendTransaction(tx, txHashCb) {
  return new Promise((resolve, reject) => {
    const txEventEmitter = web3.eth.sendSignedTransaction(tx.rawTransaction);
    if (txHashCb) {
      txEventEmitter.on('transactionHash', txHashCb);
    }
    txEventEmitter.on('confirmation', resolve).on('error', reject);
  });
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
    const tx = await web3.eth.accounts.signTransaction({
      to: LIKECOIN.LIKE_COIN_ADDRESS,
      data: txData,
      gasPrice,
      gas: gasLimit,
    }, privateKey);
    await sendTransaction(tx, (txHash) => {
      res.json({ txHash });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || err);
  }
});

export default router;
