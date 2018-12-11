import test from 'ava';

const axiosist = require('./axiosist');

test('EXP: Get experiments list', async (t) => {
  const res = await axiosist.get('/api/experiments/list')
    .catch(err => err.response);

  t.is(res.status, 200);
  t.deepEqual(res.data, []);
});
