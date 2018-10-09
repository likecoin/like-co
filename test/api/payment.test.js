import test from 'ava';
import {
  invalidWallet,
  txHash,
  txFrom,
  txTo,
  txValue,
} from './data';

const { jwtSign } = require('./jwt');
const axiosist = require('./axiosist');

test('PAYMENT: Payment. Case: Invalid address.', async (t) => {
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
  const token = jwtSign({ wallet: txTo });
  axiosist.defaults.headers.common.Cookie = `likecoin_auth=${token}`;
  const res = await axiosist.get(`/api/tx/history/addr/${txTo}`)
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
