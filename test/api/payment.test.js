import test from 'ava';
import {
  testingUser2,
  testingWallet2,
  invalidWallet,
  txHash,
  txFrom,
  txTo,
  txValue,
} from './data';
import axiosist from './axiosist';

const { jwtSign } = require('./jwt');

test('PAYMENT: Payment. Case: Login needed.', async (t) => {
  const res = await axiosist.post('/api/payment', {
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
  t.is(res.status, 401);
});

test('PAYMENT: Payment. Case: Invalid address.', async (t) => {
  const token = jwtSign({ user: testingUser2, wallet: txTo });
  const res = await axiosist.post('/api/payment', {
    from: testingWallet2,
    to: invalidWallet,
    value: 1,
    maxReward: 0,
    nonce: 1,
    signature: '',
  }, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 400);
});

test('PAYMENT: Get tx by id', async (t) => {
  const res = await axiosist.get(`/api/tx/id/${txHash}`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.from, txFrom);
  t.is(res.data.to, txTo);
  t.is(res.data.value, txValue);
});

test('PAYMENT: Get tx history by addr', async (t) => {
  const token = jwtSign({ user: testingUser2, wallet: txTo });
  const res = await axiosist.get(`/api/tx/history/addr/${txTo}`, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);

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
