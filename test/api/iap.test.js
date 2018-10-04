import test from 'ava';

const { jwtSign } = require('./jwt');
const axiosist = require('./axiosist');

test('IAP: Get iap product list', async (t) => {
  const res = await axiosist.get('/api/iap/list')
    .catch(err => err.response);

  t.is(res.status, 200);
  t.deepEqual(res.data, []);
});

test('IAP: Get iap subscriber info', async (t) => {
  const token = jwtSign({ user: 'testing' });
  const res = await axiosist.get('/api/iap/subscription/donation/testing', {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  })
    .catch(err => err.response);

  t.is(res.status, 200);
  t.deepEqual(res.data, {
    currentPeriodEnd: 0,
    currentPeriodStart: 0,
    isCanceled: false,
    isSubscribed: true,
  });
});

test('IAP: Get iap non-subscriber info', async (t) => {
  const token = jwtSign({ user: 'testuser' });
  const res = await axiosist.get('/api/iap/subscription/donation/testuser', {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  })
    .catch(err => err.response);

  t.is(res.status, 404);
});

test('IAP: Claim iap subscription with subscriber', async (t) => {
  const user = 'testing';
  const subscriptionId = 'sub_00000000000000';
  const token = jwtSign({ user });
  const res = await axiosist.post('/api/iap/subscription/claim', {
    subscriptionId,
    user,
  }, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  })
    .catch(err => err.response);

  t.is(res.status, 400);
});

test('IAP: Claim iap subscription with non-subscriber', async (t) => {
  const user = 'testuser';
  const subscriptionId = 'sub_00000000000000';
  const token = jwtSign({ user });
  const res = await axiosist.post('/api/iap/subscription/claim', {
    subscriptionId,
    user,
  }, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  })
    .catch(err => err.response);

  t.is(res.status, 200);
  t.is(res.data.user, 'testuser');
  t.is(res.data.subscriptionId, 'sub_00000000000000');
});
