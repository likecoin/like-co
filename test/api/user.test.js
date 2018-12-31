import test from 'ava';
import {
  testingWallet0,
  testingUser1,
  testingDisplayName1,
  testingEmail1,
  testingWallet1,
  testingUser2,
  testingEmail2,
  testingWallet2,
  testingMerchantId1,
  invalidWallet,
  testingWallet3,
  privateKey0,
  privateKey1,
  privateKey3,
} from './data';

const sigUtil = require('eth-sig-util');
const Web3 = require('web3');
const { jwtSign } = require('./jwt');
const axiosist = require('./axiosist');

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
test.serial('USER: Register user. Case: success', async (t) => {
  const payload = Web3.utils.utf8ToHex(JSON.stringify({
    user: 'testing-user-0',
    displayName: 'testingNewUser0',
    ts: Date.now(),
    wallet: testingWallet0,
  }));
  const sign = signProfile(payload, privateKey0);
  const res = await axiosist.post('/api/users/new', {
    from: testingWallet0,
    platform: 'wallet',
    payload,
    sign,
  }, {
    headers: {
      Cookie: '_csrf=unit_test',
      'x-csrf-token': '73fb9061-W0SmQvlNKd0uKS4d2nKoZd0u7SA',
    },
  });

  t.is(res.status, 200);
});

test.serial('USER: Login user. Case: success', async (t) => {
  const payload = Web3.utils.utf8ToHex(JSON.stringify({
    ts: Date.now(),
    wallet: testingWallet1,
  }));
  const sign = signProfile(payload, privateKey1);
  const res = await axiosist.post('/api/users/login', {
    from: testingWallet1,
    platform: 'wallet',
    payload,
    sign,
  });
  t.is(res.status, 200);
});

test.serial('USER: Edit user. Case: success', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  const payload = {
    user,
    displayName: testingDisplayName1,
    ts: Date.now(),
    wallet: testingWallet1,
    email: 'noreply@likecoin.store',
  };
  const res = await axiosist.post('/api/users/update', payload, {
    headers: {
      Cookie: `likecoin_auth=${token}; _csrf=unit_test`,
      'x-csrf-token': '73fb9061-W0SmQvlNKd0uKS4d2nKoZd0u7SA',
    },
  });

  t.is(res.status, 200);
});

test.serial('USER: Edit user. Case: invalid csrf token', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  const payload = {
    user,
    displayName: testingDisplayName1,
    ts: Date.now(),
    wallet: testingWallet1,
    email: 'noreply@likecoin.store',
  };
  const res = await axiosist.post('/api/users/update', payload, {
    headers: {
      Cookie: `likecoin_auth=${token};`,
    },
  }).catch(err => err.response);

  t.is(res.status, 400);
  t.is(res.data, 'BAD_CSRF_TOKEN');
});

test.serial('USER: Email verification (Need restart server for clean memory data)', async (t) => {
  const token = jwtSign({ user: testingUser1 });
  const res = await axiosist.post(`/api/email/verify/user/${testingUser1}`, {}, {
    headers: {
      Accept: 'application/json',
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data, 'OK');
});

test.serial('USER: Verify uuid. Case: wrong uuid', async (t) => {
  const token = jwtSign({ user: testingUser2 });
  const uuid = '99999999-0000-0000-0000-000000000000';
  const res = await axiosist.post(`/api/email/verify/${uuid}`, {}, {
    headers: {
      Accept: 'application/json',
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 404);
});

test.serial('USER: Verify uuid. Case: success (Need restart server for clean memory data)', async (t) => {
  const token = jwtSign({ user: testingUser2 });
  const uuid = '00000000-0000-0000-0000-000000000000';
  const res = await axiosist.post(`/api/email/verify/${uuid}`, {}, {
    headers: {
      Accept: 'application/json',
      Cookie: `likecoin_auth=${token}`,
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
    const res = await axiosist.post('/api/users/new', {
      from,
      payload: formatedPayload,
      sign,
      platform: 'wallet',
    }, {
      headers: {
        Cookie: '_csrf=unit_test',
        'x-csrf-token': '73fb9061-W0SmQvlNKd0uKS4d2nKoZd0u7SA',
      },
    }).catch(err => err.response);

    t.is(res.status, 400);
  });
}

test('USER: Get user by id', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  let res = await axiosist.get(`/api/users/id/${user}`)
    .catch(err => err.response);

  t.is(res.status, 401);

  res = await axiosist.get(`/api/users/id/${user}`, {
    headers: {
      Cookie: `likecoin_auth=${token};`,
    },
  }).catch(err => console.log(err));
  t.is(res.status, 200);
  t.is(res.data.wallet, testingWallet1);
  t.is(res.data.displayName, testingDisplayName1);
});

test('USER: Get user by id min', async (t) => {
  const user = testingUser1;
  const res = await axiosist.get(`/api/users/id/${user}/min`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.wallet, testingWallet1);
  t.not(res.data.email, testingEmail1);
});

test('USER: Get user by merchant id min', async (t) => {
  const merchantId = testingMerchantId1;
  const res = await axiosist
    .get(`/api/users/merchant/${merchantId}/min`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.wallet, testingWallet1);
});

test('USER: Get user by address min', async (t) => {
  let wallet = testingWallet1;
  let res = await axiosist.get(`/api/users/addr/${wallet}/min`)
    .catch(err => err.response);

  t.is(res.status, 200);

  res = await axiosist.get('/api/users/addr/0xazdfsadf/min')
    .catch(err => err.response);

  t.is(res.status, 400);

  wallet = testingWallet3;
  res = await axiosist.get(`/api/users/addr/${wallet}/min`)
    .catch(err => err.response);

  t.is(res.status, 404);
});

test('USER: check user login status', async (t) => {
  const wallet = testingWallet1;
  const user = testingUser1;
  const token = jwtSign({ user, wallet });
  let res = await axiosist.get('/api/users/self')
    .catch(err => err.response);

  t.is(res.status, 401);

  res = await axiosist.get('/api/users/self', {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
});

test('USER: Get user referral status', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  let res = await axiosist.get(`/api/users/referral/${user}`)
    .catch(err => err.response);

  t.is(res.status, 401);

  res = await axiosist.get(`/api/users/referral/${user}`, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.pending, 0);
  t.is(res.data.verified, 1);
});

test('USER: Get user bonus status', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  let res = await axiosist.get(`/api/users/bonus/${user}`)
    .catch(err => err.response);

  t.is(res.status, 401);

  res = await axiosist.get(`/api/users/bonus/${user}`, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.bonus, '3.0000');
});

test('USER: Post user notitication option', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  let res = await axiosist.post(`/api/users/email/${user}`, {
    isEmailEnabled: true,
  }, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
  res = await axiosist.get(`/api/users/id/${user}`, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  });
  t.is(res.status, 200);
  t.is(res.data.isEmailEnabled, true);
});
