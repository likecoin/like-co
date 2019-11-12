import axios from '~/plugins/axios';
import { IS_TESTNET, EXTERNAL_HOSTNAME } from '@/constant';

const LIKECOIN_API_BASE = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';
const LIKECOIN_MISC_API_BASE = `https://${EXTERNAL_HOSTNAME}`;
const LIKE_CO_CLOUD_FN_BASE = `https://us-central1-likecoin-${IS_TESTNET ? 'develop' : 'foundation'}.cloudfunctions.net`;
const LIKECOIN_MIGRATION = IS_TESTNET ? 'https://migration.taipei.like.co' : 'https://migration.like.co';

export const COSMOS_API_BASE = '/api/cosmos/lcd';

export const getMigrationSiteURL = likerId => (likerId ? `${LIKECOIN_MIGRATION}?likerid=${likerId}` : LIKECOIN_MIGRATION);
export const getLikerLandAppURL = () => 'https://branch.io';

export const apiCheckIsUser = addr => axios.get(`/users/addr/${addr}/min`);

export const apiGetUserById = id => axios.get(`/users/id/${id}`);

export const apiGetUserMinById = id => axios.get(`/users/id/${id}/min`);

export const apiGetUserMinByMerchantId = id => axios.get(`/users/merchant/${id}/min`);

export const apiGetTxById = (id, filterId) => {
  let url = `/tx/id/${id}?`;
  if (filterId) url += `address=${filterId}`;
  return axios.get(url);
};

export const apiGetTxToByAddr = addr => axios.get(`/tx/addr/to/${addr}`);

export const apiGetTxFromByAddr = addr => axios.get(`/tx/addr/from/${addr}`);

export const apiSendVerifyEmail = (id, ref, locale) => axios.post(`/email/verify/user/${id}`, { ref, locale });

export const apiVerifyEmailByUUID = (uuid, locale) => axios.post(`/email/verify/${uuid}`, { locale });

export const apiPostNewUser = (form, opt) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    if (typeof form[key] !== 'undefined') {
      params.append(key, form[key]);
    }
  });
  return axios.post('/users/new', params, opt);
};

export const apiPostUpdateUser = (form, opt) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    if (typeof form[key] !== 'undefined') {
      params.append(key, form[key]);
    }
  });
  return axios.post('/users/update', params, opt);
};

export const apiLoginUser = payload => axios.post('/users/login', payload);

export const apiLogoutUser = () => axios.post('/users/logout');

export const apiSyncAuthCoreUser = payload => axios.post('/users/sync/authcore', payload);

export const apiFetchAuthPlatformURL = (platform, type) => axios.get(`/users/login/${platform}?type=${type}`);
export const apiPostAuthPlatformToken = (platform, { code, state }) => axios.post(`/users/login/${platform}`, { code, state });
export const apiFetchLinkedAuthPlatforms = () => axios.get('/users/login/platforms');

export const apiLinkAuthPlatform = (platform, payload) => axios.post(`/users/login/${platform}/add`, payload);

export const apiUnlinkAuthPlatform = platform => axios.delete(`/users/login/${platform}`);

export const apiGetUserSelf = () => axios.get('/users/self');

export const apiSendInvitationEmail = (user, email, locale) => axios.post(
  `${LIKECOIN_API_BASE}/misc/store-invite`,
  {
    referrerId: user,
    email,
    locale,
  },
);

export const apiQueryTxHistoryByAddr = (addr, ts, count) => {
  let url = `/tx/history/addr/${addr}?`;
  if (ts) url += `ts=${ts}&`;
  if (count) url += `count=${count}&`;
  return axios.get(url);
};

export const apiQueryTxHistoryByUserId = (id, ts, count) => {
  let url = `/tx/history/user/${id}?`;
  if (ts) url += `ts=${ts}&`;
  if (count) url += `count=${count}&`;
  return axios.get(url);
};

export const apiQueryLikeCoinFiatPrice = () => axios.get('/misc/price?currency=usd', { withCredentials: false });

export const apiSetNotification = (id, isEmailEnabled) => axios.post(`/users/email/${id}`, { isEmailEnabled });

export const apiGetSocialListById = (id, type = '') => axios.get(`/social/list/${id}?type=${type}`);

export const apiGetSocialListDetialsById = id => axios.get(`/social/list/${id}/details`);

export const apiGetSocialPlatformLink = (platform, id) => axios.get(`/social/link/${platform}/${id}`);

export const apiLinkSocialPlatform = (platform, payload) => axios.post(`/social/link/${platform}`, payload);

export const apiUnlinkSocialPlatform = (platform, payload) => axios.post(`/social/unlink/${platform}`, payload);

export const apiGetLikeButtonMyStatus = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self`, { params: { referrer } });
export const apiGetLikeButtonTotalCount = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/total`, { params: { referrer } });
export const apiGetLikeButtonLikerList = (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/list`, { params: { referrer } });
export const apiPostLikeButton = (id, referrer, count = 1) => axios.post(
  `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/${count}`,
  {},
  { params: { referrer } },
);

export const apiSelectFacebookPageLink = (pageId, payload) => axios.post(`/social/link/facebook/${pageId}`, payload);
export const apiPostSocialPlatformsIsPublic = payload => axios.patch('/social/public', payload);
export const apiPostAddUserSocialLink = payload => axios.post('/social/links/new', payload);
export const apiPostUpdateUserSocialLink = (linkId, payload) => axios.put(`/social/links/${linkId}`, payload);

export const apiGetLikeStatistic = () => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/like/stat`);

export const apiGetUserLikeAmount = () => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/info/like/amount`);
export const apiGetLikeArticleInfo = url => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/like/suggest/info/?url=${encodeURIComponent(url)}`);
export const apiGetLikeURLSuggestion = () => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/like/suggest/all`, { withCredentials: false });
export const apiGetLikeURLPersonalSuggestion = () => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/like/suggest/personal`);
export const apiGetUserPendingLikeHistory = () => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/info/like/pending`);

export const apiPostUserReadContent = (id, payload) => axios.put(`/users/read/${id}`, payload);

export const apiGetCivicCSOnline = () => axios.get('/civic/csonline');
export const apiQueueCivicLikerWaitingList = qs => axios.put(`/civic/queue?${qs}`);
export const apiDequeueCivicLikerWaitingList = qs => axios.delete(`/civic/queue?${qs}`);
export const apiGetCivicLikerTrialEventById = id => axios.get(`/civic/trial/events/${id}`);
export const apiJoinCivicLikerTrialEventById = id => axios.post(`/civic/trial/events/${id}/join`);

export const apiGetOAuthAuthorize = (clientId, redirectUri = '', scope = [], opt) => {
  const scopeString = encodeURIComponent(scope.join(' '));
  return axios.get(`${LIKECOIN_MISC_API_BASE}/api/oauth/authorize?client_id=${clientId}&scope=${scopeString}&redirect_uri=${encodeURIComponent(redirectUri)}`, opt);
};
export const apiPostOAuthAuthorize = payload => axios.post(`${LIKECOIN_MISC_API_BASE}/api/oauth/authorize`, payload);

export const getImageResizeAPI = (url, { width } = {}) => `${LIKE_CO_CLOUD_FN_BASE}/thumbnail/?url=${encodeURIComponent(url)}${
  width ? `&width=${width}` : ''
}`;
