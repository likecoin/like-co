import test from 'ava';

const sigUtil = require('eth-sig-util');
const Web3 = require('web3');
const axios = require('axios');

const userData = require('./data/user.json');
const txData = require('./data/tx.json');

//
// test data
//
const url = 'http://localhost:3000';
const {
  id: testingUser1,
  displayName: testingDisplayName1,
  email: testingEmail1,
  wallet: testingWallet1,
} = userData.users[0];
const {
  id: testingUser2,
  email: testingEmail2,
  wallet: testingWallet2,
} = userData.users[1];
const invalidWallet = '4b25758E41f9240C8EB8831cEc7F1a02686387fa';
const testingWallet3 = '0x9113EC0624802E6BB2b13d7e123C91Aa5D130314'; // wallet that is not used

const {
  id: txHash,
  from: txFrom,
  to: txTo,
  value: txValue,
} = txData.tx[0];

// confidential
const privateKey1 = '0x3b298aeb848c19257e334160b52aae9790fbae9607bd68aea8cfcfc89572cb15';
// const privateKey2 = '0x8163e9a0e9ec131844c520d292380bd93f39fd45d1bbce5c8ae3d2a4ef0a702b';
const privateKey3 = '0xd9d199217049b92cb321d3e636b1d6642d89af0cef08b56d61bf04467b4d3862';

//
// functions
//
function signProfile(signData, privateKey) {
  const privKey = Buffer.from(privateKey.substr(2), 'hex');
  return sigUtil.personalSign(privKey, { data: signData });
}

//
// serial will run first
//
test.serial('USER: Register or edit user. Case: success', async (t) => {
  const payload = Web3.utils.utf8ToHex(JSON.stringify({
    user: testingUser1,
    displayName: testingDisplayName1,
    ts: Date.now(),
    wallet: testingWallet1,
    email: 'noreply@likecoin.store',
  }));
  const sign = signProfile(payload, privateKey1);
  const res = await axios.put(`${url}/api/users/new`, {
    from: testingWallet1,
    payload,
    sign,
  });

  t.is(res.status, 200);
  t.is(res.data, 'OK');
});

test.serial('USER: Email verification', async (t) => {
  const res = await axios.post(`${url}/api/email/verify/user/${testingUser1}`, {}, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data, 'OK');
});

test.serial('USER: Verify uuid. Case: wrong uuid', async (t) => {
  const uuid = '00000000-0000-0000-0000-000000000001';
  const res = await axios.post(`${url}/api/email/verify/${uuid}`, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 404);
});

test.serial('USER: Verify uuid. Case: success', async (t) => {
  const uuid = '00000000-0000-0000-0000-000000000000';
  const res = await axios.post(`${url}/api/email/verify/${uuid}`, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.wallet, testingWallet2);
});

//
// concurrent cases
//
const expiredDate = new Date();
expiredDate.setDate(expiredDate.getDate() - 1);
const userCases = [
  {
    name: 'USER: Register or edit user. Case: wrong wallet',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet1,
      email: testingEmail1,
    },
    from: testingWallet2,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: wrong wallet (ii)',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet2,
      email: testingEmail1,
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: wrong wallet (iii)',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: invalidWallet,
      email: testingEmail1,
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: expired',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: expiredDate.getTime(),
      wallet: testingWallet1,
      email: testingEmail1,
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: invalid email',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet1,
      email: 'invalid@@mail',
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: invalid email (ii)',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet1,
      email: 'invalidmail',
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: invalid email (iii)',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet1,
      email: '@likecoin.store',
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: User, wallet already exist',
    payload: {
      user: testingUser2,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet1,
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: Email already exist',
    payload: {
      user: testingUser1,
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet1,
      email: testingEmail2,
    },
    from: testingWallet1,
    privateKey: privateKey1,
  },
  {
    name: 'USER: Register or edit user. Case: Invalid user name char',
    payload: {
      user: 'Helloworld',
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet3,
    },
    from: testingWallet3,
    privateKey: privateKey3,
  },
  {
    name: 'USER: Register or edit user. Case: Invalid user name length',
    payload: {
      user: 'hello',
      displayName: testingDisplayName1,
      ts: Date.now(),
      wallet: testingWallet3,
    },
    from: testingWallet3,
    privateKey: privateKey3,
  },
];

for (let i = 0; i < userCases.length; i += 1) {
  const {
    name,
    payload,
    from,
    privateKey,
  } = userCases[i];
  test(name, async (t) => {
    const formatedPayload = Web3.utils.utf8ToHex(JSON.stringify(payload));
    const sign = signProfile(formatedPayload, privateKey);
    const res = await axios.put(`${url}/api/users/new`, {
      from,
      payload: formatedPayload,
      sign,
    }).catch(err => err.response);

    t.is(res.status, 400);
  });
}

test('USER: Get user by id', async (t) => {
  const res = await axios.get(`${url}/api/users/id/${testingUser1}`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.wallet, testingWallet1);
  t.is(res.data.displayName, testingDisplayName1);
});

test('USER: Get user by address', async (t) => {
  const res = await axios.get(`${url}/api/users/addr/${testingWallet1}`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.user, testingUser1);
  t.is(res.data.wallet, testingWallet1);
  t.is(res.data.displayName, testingDisplayName1);
});

test('PAYMENT: Payment. Case: Invalid address.', async (t) => {
  const res = await axios.post(`${url}/api/payment`, {
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
  const res = await axios.get(`${url}/api/tx/id/${txHash}`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.from, txFrom);
  t.is(res.data.to, txTo);
  t.is(res.data.value, txValue);
});

test('PAYMENT: Get tx history by addr', async (t) => {
  const res = await axios.get(`${url}/api/tx/history/addr/${txTo}`)
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
