import axios from '~/plugins/axios';
import { IS_TESTNET, EXTERNAL_HOSTNAME } from '@/constant';

const LIKECOIN_API_BASE = IS_TESTNET ? `https://api.${EXTERNAL_HOSTNAME}` : `https://api.${EXTERNAL_HOSTNAME}`;
const LIKECOIN_MIGRATION = IS_TESTNET ? 'https://migration.testnet.like.co' : 'https://migration.like.co';
const LIKECOIN_MISC_API_BASE = `https://${EXTERNAL_HOSTNAME}`;
const LIKER_LAND_URL = `https://${IS_TESTNET ? 'rinkeby.' : ''}liker.land`;
const LIKE_CO_ABOUT_URL = 'https://about.like.co';
const LIKE_CO_CLOUD_FN_BASE = `https://us-central1-likecoin-${IS_TESTNET ? 'develop' : 'foundation'}.cloudfunctions.net`;

export const COSMOS_API_BASE = '/api/cosmos/lcd';

export const apiArweaveEstimate = (files) => {
  /* eslint-disable no-new */
  const form = new FormData();
  Object.keys(files).forEach((key) => {
    if (typeof files[key] !== 'undefined') {
      form.append(key, files[key], key);
    }
  });
  return axios.post(`${LIKECOIN_API_BASE}/arweave/estimate`, form);
};

export const apiArweaveUpload = (files, txHash) => {
  /* eslint-disable no-new */
  const form = new FormData();
  Object.keys(files).forEach((key) => {
    if (typeof files[key] !== 'undefined') {
      form.append(key, files[key], key);
    }
  });
  return axios.post(`${LIKECOIN_API_BASE}/arweave/upload?txHash=${txHash}`, form);
};

export const getMigrationSiteURL = likerId => (likerId ? `${LIKECOIN_MIGRATION}?likerid=${likerId}` : LIKECOIN_MIGRATION);
export const getLikerLandAppURL = () => 'https://likecoin.page.link/likeco';
export const getLikerLandURL = () => LIKER_LAND_URL;
export const getLikeCoAboutURL = () => LIKE_CO_ABOUT_URL;
export const getLikerLandCreatorsURL = () => `${LIKER_LAND_URL}/creators`;

export const apiCheckIsUser = addr => axios.get(`/users/addr/${addr}/min`);

export const apiGetUserById = id => axios.get(`/users/id/${id}`);

export const apiGetUserMinById = (id, { types = [], type } = {}) => {
  let path = `/users/id/${id}/min`;
  if (type) types.push(type);
  if (types.length) {
    path += `?type=${encodeURIComponent(types.join(','))}`;
  }
  return axios.get(path);
};

export const apiGetTxById = (id, filterId) => {
  let url = `/tx/id/${id}?`;
  if (filterId) url += `address=${filterId}`;
  return axios.get(url);
};
export const apiPostTxMetadata = (id, metadata) => {
  const url = `/tx/id/${id}/metadata`;
  return axios.post(url, { metadata });
};
export const apiGetTxToByAddr = addr => axios.get(`/tx/addr/to/${addr}`);
export const apiGetTxFromByAddr = addr => axios.get(`/tx/addr/from/${addr}`);

export const apiSendVerifyEmail = (id, ref, locale) => axios.post(`/email/verify/user/${id}`, { ref, locale });

export const apiVerifyEmailByUUID = (uuid, locale) => axios.post(`/email/verify/${uuid}`, { locale });

export const apiPostNewUser = payload => axios.post('/users/new', payload);

export const apiCheckLikerId = likerId => axios.post('/users/new/check', { user: likerId });

export const apiPostUpdateUser = payload => axios.post('/users/update', payload);

export const apiPostUpdateUserAvatar = (payload) => {
  /* eslint-disable no-new */
  const form = new FormData();
  Object.keys(payload).forEach((key) => {
    if (typeof payload[key] !== 'undefined') {
      form.append(key, payload[key]);
    }
  });
  return axios.post('/users/update/avatar', form);
};

export const apiLoginUser = payload => axios.post('/users/login', payload);

export const apiLogoutUser = () => axios.post('/users/logout');

export const apiDeleteUser = (user, payload) => axios.post(`/users/delete/${user}`, payload);

export const apiSyncAuthCoreUser = payload => axios.post('/users/sync/authcore', payload);

export const apiGetUserSelf = () => axios.get('/users/self');
export const apiFetchPreferences = () => axios.get('/users/preferences');
export const apiUpdatePreferences = payload => axios.post('/users/preferences', payload);

export const apiSendInvitationEmail = (user, email, locale) => axios.post(
  `${LIKECOIN_API_BASE}/misc/store-invite`,
  {
    referrerId: user,
    email,
    locale,
  },
);

export const apiQueryLikeCoinFiatPrice = () => axios.get('/misc/price?currency=usd', { withCredentials: false });

export const apiSetNotification = (id, isEmailEnabled) => axios.post(`/users/email/${id}`, { isEmailEnabled });

export const apiGetLikeButtonMyStatus = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self`, { params: { referrer } });
export const apiGetLikeButtonTotalCount = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/total`, { params: { referrer } });
export const apiGetLikeButtonLikerList = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/list`, { params: { referrer } });
export const apiPostLikeButton = (id, referrer, count = 1) => axios.post(
  `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/${count}`,
  {},
  { params: { referrer } },
);

export const apiGetUserLikeAmount = () => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/info/like/amount`);

export const apiGetOAuthAuthorize = (clientId, redirectUri = '', scope = [], opt) => {
  const scopeString = encodeURIComponent(scope.join(' '));
  return axios.get(`${LIKECOIN_MISC_API_BASE}/api/oauth/authorize?client_id=${clientId}&scope=${scopeString}&redirect_uri=${encodeURIComponent(redirectUri)}`, opt);
};
export const apiPostOAuthAuthorize = payload => axios.post(`${LIKECOIN_MISC_API_BASE}/api/oauth/authorize`, payload);

export const getImageResizeAPI = (url, { width } = {}) => `${LIKE_CO_CLOUD_FN_BASE}/thumbnail/?url=${encodeURIComponent(url)}${
  width ? `&width=${width}` : ''
}`;
