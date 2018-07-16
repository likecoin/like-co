import BigNumber from 'bignumber.js';
import { INFURA_HOST, PUBSUB_TOPIC_MISC } from '../../constant';
import publisher from './gcloudPub';
import { getGasPrice } from './poller';

const {
  db,
  txCollection: txLogRef,
} = require('./firebase');

const Web3 = require('web3');
const sigUtil = require('eth-sig-util');

export const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_HOST));
const accounts = require('@ServerConfig/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function personalEcRecover(data, sig) {
  return sigUtil.recoverPersonalSignature({ data, sig });
}

export function sendTransaction(tx) {
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

export async function signTransaction(addr, txData, pendingCount, gasPrice, gasLimit, privateKey) {
  return web3.eth.accounts.signTransaction({
    to: addr,
    nonce: pendingCount,
    data: txData,
    gasPrice,
    gas: gasLimit,
  }, privateKey);
}

async function sendWithLoop(
  addr,
  txData,
  { gasLimit, privateKey, address },
) {
  const RETRY_LIMIT = 10;
  let retryCount = 0;
  let retry = false;
  let txHash;
  let tx;
  const networkGas = await web3.eth.getGasPrice();
  const gasPrice = BigNumber.min(getGasPrice(), networkGas).toString();
  const counterRef = txLogRef.doc(`!counter_${address}`);
  /* eslint-disable no-await-in-loop */
  let pendingCount = await db.runTransaction(async (t) => {
    const d = await t.get(counterRef);
    const v = d.data().value + 1;
    await t.update(counterRef, { value: v });
    return d.data().value;
  });
  do {
    retry = false;
    tx = await signTransaction(addr, txData, pendingCount, gasPrice, gasLimit, privateKey);
    try {
      txHash = await sendTransaction(tx);
    } catch (err) {
      console.error(err);
      if (err.message.includes('replacement transaction underpriced')
        || err.message.includes('known transaction:')
        || err.message.includes('nonce too low')) {
        console.log(`Nonce ${pendingCount} failed, trying web3 pending`);
      } else {
        retry = true;
        retryCount += 1;
        await timeout(500);
      }
    }
  } while (retry && retryCount < RETRY_LIMIT);
  try {
    while (!txHash) {
      pendingCount = await web3.eth.getTransactionCount(address, 'pending');
      tx = await signTransaction(addr, txData, pendingCount, gasLimit, privateKey);
      txHash = await sendTransaction(tx);
      if (!txHash) {
        await timeout(200);
      }
    }
    /* eslint-enable no-await-in-loop */
    await db.runTransaction(t => t.get(counterRef).then((d) => {
      if (pendingCount + 1 > d.data().value) {
        return t.update(counterRef, {
          value: pendingCount + 1,
        });
      }
      return Promise.resolve();
    }));
  } catch (err) {
    await publisher.publish(PUBSUB_TOPIC_MISC, null, {
      logType: 'eventInfuraError',
      fromWallet: address,
      txHash,
      rawSignedTx: tx.rawTransaction,
      txNonce: pendingCount,
      error: err.toString(),
    });
    throw err;
  }
  return {
    tx,
    txHash,
    gasPrice,
    delegatorAddress: address,
    pendingCount,
  };
}

export async function sendTransactionWithLoop(addr, txData) {
  const {
    address,
    privateKey,
    gasLimit,
  } = accounts[0];
  return sendWithLoop(
    addr,
    txData,
    {
      gasLimit,
      privateKey,
      address,
    },
  );
}

export async function sendPriorityTransactionWithLoop(addr, txData) {
  if (!accounts[1]) {
    return sendTransactionWithLoop(addr, txData);
  }
  const {
    address,
    privateKey,
    gasLimit,
  } = accounts[1];
  return sendWithLoop(
    addr,
    txData,
    {
      gasLimit,
      privateKey,
      address,
    },
  );
}

export default web3;
