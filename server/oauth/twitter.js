import { EXTERNAL_HOSTNAME } from '../../constant';
import axios from '../../plugins/axios';
import { ValidationError } from '../../util/ValidationHelper';

const crypto = require('crypto');
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const {
  TWITTER_API_KEY,
  TWITTER_API_SECRET,
} = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const oauth = new OAuth({
  consumer: {
    key: TWITTER_API_KEY,
    secret: TWITTER_API_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (text, key) =>
    crypto.createHmac('sha1', key).update(text).digest('base64'),
});

export async function fetchTwitterOAuthInfo(user) {
  if (!TWITTER_API_KEY || !TWITTER_API_SECRET) throw new ValidationError('twitter app not configured');
  const oAuthCallback = `https://${EXTERNAL_HOSTNAME}/in/oauth/twitter?user=${user}`;
  const req = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: { oauth_callback: oAuthCallback },
  };
  const { data } = await axios({
    url: req.url,
    method: req.method,
    data: querystring.stringify(oauth.authorize(req)),
  });
  const payload = querystring.parse(data);
  if (!payload.oauth_callback_confirmed) throw new ValidationError('get twitter token fail');
  const {
    oauth_token: oAuthToken,
    oauth_token_secret: oAuthTokenSecret,
  } = payload;
  const url = `https://api.twitter.com/oauth/authenticate?oauth_token=${oAuthToken}&perms=read`;
  return { url, oAuthToken, oAuthTokenSecret };
}

export async function fetchTwitterUser(oAuthToken, oAuthTokenSecret, oAuthVerifier) {
  if (!TWITTER_API_KEY || !TWITTER_API_SECRET) throw new ValidationError('twitter app not configured');
  const token = {
    key: oAuthToken,
    secret: oAuthTokenSecret,
  };
  const req = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
    data: { oauth_verifier: oAuthVerifier },
  };
  const { data } = await axios({
    url: req.url,
    method: req.method,
    data: querystring.stringify(oauth.authorize(req, token)),
  });
  const payload = querystring.parse(data);
  if (!payload.user_id) throw new ValidationError('twitter oauth verify fail');
  const {
    user_id: userId,
    screen_name: displayName,
    oauth_token: replyOAuthToken,
    oauth_token_secret: replyOAuthTokenSecret,
  } = payload;
  return {
    userId,
    displayName,
    oAuthToken: replyOAuthToken,
    oAuthTokenSecret: replyOAuthTokenSecret,
  };
}
