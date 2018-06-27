import test from 'ava';
import {
  url,
  testingUser1,
  testingDisplayName1,
  testingEmail1,
  testingWallet1,
  testingUser2,
  testingEmail2,
  testingWallet2,
  invalidWallet,
  testingWallet3,
  privateKey1,
  privateKey3,
} from './data';

const sigUtil = require('eth-sig-util');
const Web3 = require('web3');
const axiosist = require('axiosist');
const jwt = require('jsonwebtoken');

const app = require('../../build/main.js'); // eslint-disable-line import/no-unresolved

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
  const res = await axiosist(app).put(`${url}/api/users/new`, {
    from: testingWallet1,
    payload,
    sign,
  });

  t.is(res.status, 200);
  axiosist(app).defaults.headers.common.Authorization = `Bearer ${res.data.token}`;
});

test.serial('USER: Email verification (Need restart server for clean memory data)', async (t) => {
  const res = await axiosist(app).post(`${url}/api/email/verify/user/${testingUser1}`, {}, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data, 'OK');
});

test.serial('USER: Verify uuid. Case: wrong uuid', async (t) => {
  const uuid = '99999999-0000-0000-0000-000000000000';
  const res = await axiosist(app).post(`${url}/api/email/verify/${uuid}`, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(err => err.response);
  t.is(res.status, 404);
});

test.serial('USER: Verify uuid. Case: success (Need restart server for clean memory data)', async (t) => {
  const uuid = '00000000-0000-0000-0000-000000000000';
  const res = await axiosist(app).post(`${url}/api/email/verify/${uuid}`, {
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
    const res = await axiosist(app).put(`${url}/api/users/new`, {
      from,
      payload: formatedPayload,
      sign,
    }).catch(err => err.response);

    t.is(res.status, 400);
  });
}

test('USER: Get user by id', async (t) => {
  const user = testingUser1;
  const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });
  const res = await axiosist(app).get(`${url}/api/users/id/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.wallet, testingWallet1);
  t.is(res.data.displayName, testingDisplayName1);
});

test('USER: Get user by address', async (t) => {
  const wallet = testingWallet1;
  const token = jwt.sign({ wallet }, 'likecoin', { expiresIn: '7d' });
  const res = await axiosist(app).get(`${url}/api/users/addr/${wallet}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.user, testingUser1);
  t.is(res.data.wallet, testingWallet1);
  t.is(res.data.displayName, testingDisplayName1);
});

test('OEMBED: success cases', async (t) => {
  let res;

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingDisplayName1} (${testingUser1})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser1}`);
  t.is(res.data.thumbnail_width, 100);
  t.is(res.data.thumbnail_height, 100);

  res = await axiosist(app).get(`${url}/api/oembed?url=http://rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingDisplayName1} (${testingUser1})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser1}`);
  t.is(res.data.thumbnail_width, 100);
  t.is(res.data.thumbnail_height, 100);

  res = await axiosist(app).get(`${url}/api/oembed?url=rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingDisplayName1} (${testingUser1})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser1}`);
  t.is(res.data.thumbnail_width, 100);
  t.is(res.data.thumbnail_height, 100);

  res = await axiosist(app).get(`${url}/api/oembed?url=www.rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingDisplayName1} (${testingUser1})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser1}`);
  t.is(res.data.thumbnail_width, 100);
  t.is(res.data.thumbnail_height, 100);

  res = await axiosist(app).get(`${url}/api/oembed?url=https://www.rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingDisplayName1} (${testingUser1})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser1}`);
  t.is(res.data.thumbnail_width, 100);
  t.is(res.data.thumbnail_height, 100);

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/${testingUser2}&maxwidth=50`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingUser2} (${testingUser2})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser2}`);
  t.is(res.data.thumbnail_width, 50);
  t.is(res.data.thumbnail_height, 50);
});

test('OEMBED: failure cases', async (t) => {
  let res;

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/nosuchuser`)
    .catch(err => err.response);
  t.is(res.status, 404);

  res = await axiosist(app).get(`${url}/api/oembed`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'No url query in oEmbed request');

  res = await axiosist(app).get(`${url}/api/oembed?url=www.invalidurl.like.co/testing`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'Invalid url query (www.invalidurl.like.co/testing) in oEmbed request');

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/${testingUser1}&format=nosuchformat`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'Invalid format nosuchformat in oEmbed request');
});
