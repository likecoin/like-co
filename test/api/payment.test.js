import test from 'ava';
import {
  url,
  invalidWallet,
  txHash,
  txFrom,
  txTo,
  txValue,
} from './data';

const jwt = require('jsonwebtoken');
const axiosist = require('axiosist');

const app = require('../../build/main.js');


test('PAYMENT: Payment. Case: Invalid address.', async (t) => {
  const res = await axiosist(app).post(`${url}/api/payment`, {
    from: txFrom,
    to: invalidWallet,
    value: 1,
    maxReward: 0,
    nonce: 1,
    signature: '',
  }, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 400);
});

test('PAYMENT: Get tx by id', async (t) => {
  const res = await axiosist(app).get(`${url}/api/tx/id/${txHash}`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.from, txFrom);
  t.is(res.data.to, txTo);
  t.is(res.data.value, txValue);
});

test('PAYMENT: Get tx history by addr', async (t) => {
  const token = jwt.sign({ wallet: txTo }, 'likecoin', { expiresIn: '7d' });
  axiosist(app).defaults.headers.common.Authorization = `Bearer ${token}`;
  const res = await axiosist(app).get(`${url}/api/tx/history/addr/${txTo}`)
    .catch(err => err.response);

  t.is(res.status, 200);
  // check test record exists
  for (let i = 0; i < res.data.length; i += 1) {
    if (res.data[i].id === txHash) {
      t.is(res.data[i].from, txFrom);
      t.is(res.data[i].to, txTo);
      t.is(res.data[i].value, txValue);
    }
  }
});

