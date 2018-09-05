import test from 'ava';
import {
  url,
  testingUser1,
} from './data';

const jwt = require('jsonwebtoken');
const axiosist = require('axiosist');

const app = require('../../server/index.js'); // eslint-disable-line import/no-unresolved

const addSocialLinkFailCases = [
  {
    name: 'SOCIAL: Add social link. Case: wrong iconType',
    payload: {
      user: testingUser1,
      link: {
        linkType: 'brog',
        siteDisplayName: 'test site 1',
        url: 'https://like.co',
      },
    },
  },
  {
    name: 'SOCIAL: Add social link. Case: wrong url',
    payload: {
      user: testingUser1,
      link: {
        linkType: 'blog',
        siteDisplayName: '',
        url: 'https://like.co',
      },
    },
  },
  {
    name: 'SOCIAL: Add social link. Case: wrong siteDisplayName',
    payload: {
      user: testingUser1,
      link: {
        linkType: 'brog',
        siteDisplayName: 'test site 1',
        url: 'hello-world',
      },
    },
  },
];

const editSocialLinkCases = [
  {
    name: 'SOCIAL: Edit social link. Case: wrong iconType',
    payload: {
      user: testingUser1,
      link: {
        iconType: 'brog',
      },
    },
    expectedResult: {
      link0: {
        iconType: 'profile',
      },
    },
  },
  {
    name: 'SOCIAL: Edit social link. Case: wrong url',
    payload: {
      user: testingUser1,
      link: {
        url: 'testing1234',
      },
    },
    expectedResult: {
      link0: {
        url: 'https://like.co',
      },
    },
  },
  {
    name: 'SOCIAL: Edit social link. Case: wrong siteDisplayName',
    payload: {
      user: testingUser1,
      link: {
        siteDisplayName: '',
      },
    },
    expectedResult: {
      link0: {
        siteDisplayName: 'like.co',
      },
    },
  },
];

addSocialLinkFailCases.forEach(({ name, payload }) => {
  test(name, async (t) => {
    const { user } = payload;
    const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });

    const res = await axiosist(app).post(`${url}/api/social/links/new`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(err => err.response);
    t.is(res.status, 400);
  });
});

editSocialLinkCases.forEach(({ name, payload, expectedResult }) => {
  test(name, async (t) => {
    const { user } = payload;
    const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });

    const res = await axiosist(app).put(`${url}/api/social/links/link0`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(err => err.response);
    t.is(res.status, 200);

    const res2 = await axiosist(app).get(`${url}/api/social/list/${user}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(err => err.response);
    t.is(res2.status, 200);
    Object.keys(expectedResult).forEach((id) => {
      Object.keys(expectedResult[id]).forEach((field) => {
        t.true(expectedResult[id][field] === res2.data[id][field]);
      });
    });
  });
});

let newLinkId;
test.serial('SOCIAL: Add social link', async (t) => {
  const user = testingUser1;
  const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });
  const res = await axiosist(app).post(`${url}/api/social/links/new`, {
    user,
    link: {
      iconType: 'blog',
      siteDisplayName: 'oice',
      url: 'https://oice.com',
    },
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);
  t.true(!!/link(\d+)/.exec(res.data.id));
  newLinkId = res.data.id;
});

test.serial('SOCIAL: Edit social link. Case: update info success', async (t) => {
  const user = testingUser1;
  const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });

  const newLink = {
    iconType: 'blog',
    siteDisplayName: 'like.co2',
    url: 'https://oice.com/edit',
  };
  const res = await axiosist(app).put(`${url}/api/social/links/${newLinkId}`, {
    user,
    link: newLink,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);

  const res2 = await axiosist(app).get(`${url}/api/social/list/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);

  Object.keys(newLink).forEach((field) => {
    t.true(newLink[field] === res2.data[newLinkId][field]);
  });
});

test.serial('SOCIAL: Edit social link. Case: update order success', async (t) => {
  const user = testingUser1;
  const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });

  const newOrder = 0;
  const res = await axiosist(app).put(`${url}/api/social/links/${newLinkId}`, {
    user,
    link: { order: newOrder },
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);

  const res2 = await axiosist(app).get(`${url}/api/social/list/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);
  t.true(res2.data[newLinkId].order === newOrder);
});

test.serial('SOCIAL: Edit social link is public. Case: success', async (t) => {
  const user = testingUser1;
  const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });

  const res = await axiosist(app).patch(`${url}/api/social/public`, {
    user,
    platforms: {
      [newLinkId]: false,
    },
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);

  const res2 = await axiosist(app).get(`${url}/api/social/list/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);
  t.true(res2.data[newLinkId] === undefined);
});

test.serial('SOCIAL: Delete user link', async (t) => {
  const user = testingUser1;
  const token = jwt.sign({ user }, 'likecoin', { expiresIn: '7d' });
  const res = await axiosist(app).post(`${url}/api/social/unlink/${newLinkId}`, {
    user,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);

  const res2 = await axiosist(app).get(`${url}/api/social/list/${user}/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);
  t.true(res2.data.links[newLinkId] === undefined);
});
