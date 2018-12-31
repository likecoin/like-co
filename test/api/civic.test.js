import test from 'ava';
import {
  testingUser1,
} from './data';

const { jwtSign } = require('./jwt');
const axiosist = require('./axiosist');

test.serial('USER: Pre register civic liker campaign', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  const res = await axiosist.put(`/api/users/${user}/civic/trial`, { }, {
    headers: {
      Cookie: `likecoin_auth=${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 401); // expired
});

test.serial('USER: Queue for Civic Liker', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  let res = await axiosist.put(`/api/civic/queue/user/${user}`, { }, {
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
  t.is(res.data.civicLikerStatus, 'waiting');
});

test.serial('USER: Dequeue for Civic Liker', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  let res = await axiosist.delete(`/api/civic/queue/user/${user}`, {
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
  t.is(res.data.civicLikerStatus, 'intercom');
});
