import test from 'ava';
import {
  testingUser1,
} from './data';

const { jwtSign } = require('./jwt');
const axiosist = require('./axiosist');

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
    name: 'SOCIAL: Edit social link. Case: without http',
    payload: {
      user: testingUser1,
      link: {
        url: 'testing1234.com',
      },
    },
    expectedResult: {
      link0: {
        url: 'testing1234.com',
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
    const token = jwtSign({ user });

    const res = await axiosist.post('/api/social/links/new', payload, {
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
    const token = jwtSign({ user });

    const res = await axiosist.put('/api/social/links/link0', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(err => err.response);
    t.is(res.status, 200);

    const res2 = await axiosist.get(`/api/social/list/${user}`, {
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
  const token = jwtSign({ user });
  const res = await axiosist.post('/api/social/links/new', {
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
  const token = jwtSign({ user });

  const newLink = {
    iconType: 'blog',
    siteDisplayName: 'like.co2',
    url: 'https://oice.com/edit',
  };
  const res = await axiosist.put(`/api/social/links/${newLinkId}`, {
    user,
    link: newLink,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);

  const res2 = await axiosist.get(`/api/social/list/${user}`, {
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
  const token = jwtSign({ user });

  const newOrder = 0;
  const res = await axiosist.put(`/api/social/links/${newLinkId}`, {
    user,
    link: { order: newOrder },
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);

  const res2 = await axiosist.get(`/api/social/list/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);
  t.true(res2.data[newLinkId].order === newOrder);
});

test.serial('SOCIAL: Edit social link displaySocialMediaOption. Case: success', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });

  // default show on all platform
  const res = await axiosist.get(`/api/social/list/${user}?type=medium`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res.status, 200);
  t.true(Object.keys(res.data).length > 0);

  // change only allow wp to display
  const res2 = await axiosist.patch('/api/social/public', {
    user,
    displaySocialMediaOption: 'wp',
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);

  // query for type medium
  const res3 = await axiosist.get(`/api/social/list/${user}?type=medium`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res3.status, 200);
  t.true(Object.keys(res3.data).length === 0);
});

test.serial('SOCIAL: Edit social link is public. Case: success', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });

  const res = await axiosist.patch('/api/social/public', {
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

  const res2 = await axiosist.get(`/api/social/list/${user}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);
  t.true(res2.data[newLinkId] === undefined);
});

test.serial('SOCIAL: Delete user link', async (t) => {
  const user = testingUser1;
  const token = jwtSign({ user });
  const res = await axiosist.post(`/api/social/unlink/${newLinkId}`, {
    user,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);

  t.is(res.status, 200);

  const res2 = await axiosist.get(`/api/social/list/${user}/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(err => err.response);
  t.is(res2.status, 200);
  t.true(res2.data.links[newLinkId] === undefined);
});
