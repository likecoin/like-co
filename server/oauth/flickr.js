import { EXTERNAL_HOSTNAME } from '../../constant';
import axios from '../../plugins/axios';
import { ValidationError } from '../../util/ValidationHelper';

const crypto = require('crypto');
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const {
  FLICKR_APP_KEY,
  FLICKR_APP_SECRET,
} = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const oauth = new OAuth({
  consumer: {
    key: FLICKR_APP_KEY,
    secret: FLICKR_APP_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (text, key) =>
    crypto.createHmac('sha1', key).update(text).digest('base64'),
});

export async function fetchFlickrOAuthInfo(user) {
  if (!FLICKR_APP_KEY || !FLICKR_APP_SECRET) throw new ValidationError('flickr app not configured');
  const oAuthCallback = `https://${EXTERNAL_HOSTNAME}/in/oauth/flickr/${user}`;
  const req = {
    url: 'https://www.flickr.com/services/oauth/request_token',
    method: 'POST',
    data: { oauth_callback: oAuthCallback },
  };
  const { data } = await axios({
    url: req.url,
    method: req.method,
    data: querystring.stringify(oauth.authorize(req)),
  });
  const payload = querystring.parse(data);
  if (!payload.oauth_callback_confirmed) throw new ValidationError('get flickr token fail');
  const {
    oauth_token: oAuthToken,
    oauth_token_secret: oAuthTokenSecret,
  } = payload;
  const url = `https://www.flickr.com/services/oauth/authorize?oauth_token=${oAuthToken}&perms=read`;
  return { url, oAuthToken, oAuthTokenSecret };
}

export async function fetchFlickrUser(oAuthToken, oAuthTokenSecret, oAuthVerifier) {
  if (!FLICKR_APP_KEY || !FLICKR_APP_SECRET) throw new ValidationError('flickr app not configured');
  const token = {
    key: oAuthToken,
    secret: oAuthTokenSecret,
  };
  const req = {
    url: 'https://www.flickr.com/services/oauth/access_token',
    method: 'POST',
    data: { oauth_verifier: oAuthVerifier },
  };
  const { data } = await axios({
    url: req.url,
    method: req.method,
    data: querystring.stringify(oauth.authorize(req, token)),
  });
  const payload = querystring.parse(data);
  if (!payload.user_nsid) throw new ValidationError('flickr oauth verify fail');
  const {
    fullname: fullName,
    user_nsid: userId,
    username: userName,
    oauth_token: replyOAuthToken,
    oauth_token_secret: replyOAuthTokenSecret,
  } = payload;
  return {
    fullName,
    userId,
    userName,
    oAuthToken: replyOAuthToken,
    oAuthTokenSecret: replyOAuthTokenSecret,
  };
}
