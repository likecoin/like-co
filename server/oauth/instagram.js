import { EXTERNAL_HOSTNAME } from '../../constant';
import axios from '../../plugins/axios';
import { ValidationError } from '../../util/ValidationHelper';

const querystring = require('querystring');
const {
  INSTAGRAM_APP_ID,
  INSTAGRAM_APP_SECRET,
} = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const SCOPE = 'basic';

export function fetchInstagramOAuthInfo(user) {
  if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) throw new ValidationError('instagram app not configured');
  const callbackURI = `https://${EXTERNAL_HOSTNAME}/in/oauth/instagram?user=${user}`;
  const url = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&scope=${SCOPE}&response_type=code&redirect_uri=${callbackURI}`;
  return { url };
}

export async function fetchInstagramUser(code, user) {
  if (!INSTAGRAM_APP_ID || !INSTAGRAM_APP_SECRET) throw new ValidationError('instagram app not configured');
  const callbackURI = `https://${EXTERNAL_HOSTNAME}/in/oauth/instagram?user=${user}`;
  const req = {
    url: 'https://api.instagram.com/oauth/access_token',
    method: 'POST',
    data: {
      code,
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: callbackURI,
    },
  };
  const { data } = await axios({
    url: req.url,
    method: req.method,
    data: querystring.stringify(req.data),
  });
  const { access_token: accessToken } = data;
  if (!accessToken) throw new ValidationError('fail to get instagram access token');
  if (!data || !data.user) throw new ValidationError('fail to get instagram user data');
  const {
    id: userId,
    username: displayName,
    full_name: fullName,
  } = data.user;
  const url = `https://www.instagram.com/${displayName}`;
  return {
    accessToken,
    userId,
    displayName,
    fullName,
    url,
  };
}
