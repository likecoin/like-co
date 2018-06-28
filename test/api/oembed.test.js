import test from 'ava';
import {
  url,
  testingUser1,
  testingDisplayName1,
  testingUser2,
} from './data';

const axiosist = require('axiosist');
const app = require('../../build/main.js'); // eslint-disable-line import/no-unresolved

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

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/${testingUser2}&maxwidth=50`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingUser2} (${testingUser2})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://rinkeby.like.co/${testingUser2}`);
  t.is(res.data.thumbnail_width, 50);
  t.is(res.data.thumbnail_height, 50);

  res = await axiosist(app).get(`${url}/api/oembed?url=https://button.rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.is(res.data.type, 'rich');
  t.is(res.data.title, `${testingUser1} (${testingUser1})`);
  t.is(res.data.version, '1.0');
  t.is(res.data.url, `https://button.rinkeby.like.co/${testingUser1}`);
  t.is(res.data.thumbnail_width, 100);
  t.is(res.data.thumbnail_height, 100);

  /* xml format test */
  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/${testingUser1}&format=xml`)
    .catch(err => err.response);
  t.is(res.status, 200);
  t.true(res.data.includes('<?xml version="1.0" encoding="utf-8" standalone="yes"?><oembed><type>rich</type><version>1.0</version><title>testing (testing)</title><url>https://rinkeby.like.co/testing</url>'));
});

test('OEMBED: failure cases', async (t) => {
  let res;

  res = await axiosist(app).get(`${url}/api/oembed?url=www.rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 400);

  res = await axiosist(app).get(`${url}/api/oembed?url=https://www.rinkeby.like.co/${testingUser1}`)
    .catch(err => err.response);
  t.is(res.status, 400);

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/nosuchuser`)
    .catch(err => err.response);
  t.is(res.status, 404);

  res = await axiosist(app).get(`${url}/api/oembed`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'No url query in oEmbed request');

  res = await axiosist(app).get(`${url}/api/oembed?url=www.invalidurl.co/testing`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'Invalid url query (www.invalidurl.co/testing) in oEmbed request');

  res = await axiosist(app).get(`${url}/api/oembed?url=www.invalidurl.like.co/testing`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'Invalid subdomain (www.invalidurl.like.co/testing) in oEmbed request');

  res = await axiosist(app).get(`${url}/api/oembed?url=https://rinkeby.like.co/${testingUser1}&format=nosuchformat`)
    .catch(err => err.response);
  t.is(res.status, 400);
  t.is(res.data, 'Invalid format nosuchformat in oEmbed request');
});
