import { INFURA_HOST } from '../../constant';

const {
  db,
  txCollection: txLogRef,
} = require('./firebase');

const Web3 = require('web3');

export const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_HOST));
const accounts = require('@ServerConfig/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies

const {
  address,
  privateKey,
  gasPrice,
  gasLimit,
} = accounts[0];

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function typedSignatureHash(signData) {
  const paramSignatures = signData.map(item => ({ type: 'string', value: `${item.type} ${item.name}` }));
  const params = signData.map(item => ({ type: item.type, value: item.value }));
  return Web3.utils.soliditySha3(
    { type: 'bytes32', value: Web3.utils.soliditySha3(...paramSignatures) },
    { type: 'bytes32', value: Web3.utils.soliditySha3(...params) },
  );
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

export async function signTransaction(addr, txData, pendingCount) {
  return web3.eth.accounts.signTransaction({
    to: addr,
    nonce: pendingCount,
    data: txData,
    gasPrice,
    gas: gasLimit,
  }, privateKey);
}

export async function sendTransactionWithLoop(addr, txData) {
  const counterRef = txLogRef.doc('!counter');
  let pendingCount = await db.runTransaction(t => t.get(counterRef).then((d) => {
    const v = d.data().value + 1;
    t.update(counterRef, { value: v });
    return d.data().value;
  }));
  let tx = await signTransaction(addr, txData, pendingCount);
  let txHash;
  try {
    txHash = await sendTransaction(tx);
  } catch (err) {
    console.log(`Nonce ${pendingCount} failed, trying web3 pending`);
  }
  while (!txHash) {
    /* eslint-disable no-await-in-loop */
    pendingCount = await web3.eth.getTransactionCount(address, 'pending');
    tx = await signTransaction(addr, txData, pendingCount);
    txHash = await sendTransaction(tx);
    if (!txHash) {
      await timeout(200);
    }
  }
  await db.runTransaction(t => t.get(counterRef).then((d) => {
    if (pendingCount + 1 > d.data().value) {
      return t.update(counterRef, {
        value: pendingCount + 1,
      });
    }
    return Promise.resolve();
  }));
  return { txHash, pendingCount };
}

export default web3;
