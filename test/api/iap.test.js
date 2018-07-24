import test from 'ava';
import { url } from './data';

const axiosist = require('axiosist');
const app = require('../../server/index.js'); // eslint-disable-line import/no-unresolved

test('IAP: Get iap product list', async (t) => {
  const res = await axiosist(app).get(`${url}/api/iap/list`)
    .catch(err => err.response);

  t.is(res.status, 200);
  t.deepEqual(res.data, []);
});
