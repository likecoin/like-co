import test from 'ava';

const axiosist = require('./axiosist');

test('IAP: Get iap product list', async (t) => {
  const res = await axiosist.get('/api/iap/list')
    .catch(err => err.response);

  t.is(res.status, 200);
  t.deepEqual(res.data, []);
});
