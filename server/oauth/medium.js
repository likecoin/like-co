import { EXTERNAL_HOSTNAME } from '../../constant';
import axios from '../../plugins/axios';
import { ValidationError } from '../../util/ValidationHelper';

const crypto = require('crypto');
const querystring = require('querystring');
const {
  MEDIUM_APP_ID,
  MEDIUM_APP_SECRET,
} = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const CALLBACK_URI = `https://${EXTERNAL_HOSTNAME}/in/oauth/medium`;
const SCOPE = 'basicProfile';

export function fetchMediumOAuthInfo(user) {
  if (!MEDIUM_APP_ID || !MEDIUM_APP_SECRET) throw new ValidationError('medium app not configured');
  const state = `${user}-${crypto.randomBytes(20).toString('hex')}`;
  const url = `https://medium.com/m/oauth/authorize?client_id=${MEDIUM_APP_ID}&scope=${SCOPE}&state=${state}&response_type=code&redirect_uri=${CALLBACK_URI}`;
  return { url, state };
}

export async function fetchMediumUser(code) {
  if (!MEDIUM_APP_ID || !MEDIUM_APP_SECRET) throw new ValidationError('medium app not configured');
  const req = {
    url: 'https://api.medium.com/v1/tokens',
    method: 'POST',
    data: {
      code,
      client_id: MEDIUM_APP_ID,
      client_secret: MEDIUM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URI,
    },
  };
  let { data } = await axios({
    url: req.url,
    method: req.method,
    data: querystring.stringify(req.data),
  });
  const { access_token: accessToken, refresh_token: refreshToken } = data;
  if (!accessToken) throw new ValidationError('fail to get medium access token');
  ({ data } = await axios.get(
    'https://api.medium.com/v1/me',
    { headers: { Authorization: `Bearer ${accessToken}` } },
  ));
  if (!data || !data.data) throw new ValidationError('fail to get medium user data');
  const {
    id: userId,
    username: displayName,
    name: fullName,
    url,
    imageUrl,
  } = data.data;
  return {
    accessToken,
    refreshToken,
    userId,
    displayName,
    fullName,
    url,
    imageUrl,
  };
}
