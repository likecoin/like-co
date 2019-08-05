import axios from '~/plugins/axios';
import { IS_TESTNET, EXTERNAL_HOSTNAME } from '@/constant';

const LIKECOIN_API_BASE = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';
const LIKECOIN_MISC_API_BASE = `https://${EXTERNAL_HOSTNAME}`;
const LIKE_CO_CLOUD_FN_BASE = `https://us-central1-likecoin-${IS_TESTNET ? 'develop' : 'foundation'}.cloudfunctions.net`;


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

export const apiGetReferralById = id => axios.get(`/users/referral/${id}`);

export const apiGetTotalBonusById = id => axios.get(`/users/bonus/${id}`);

export const apiCheckCoupon = code => axios.get(`/coupon/coupon/${code}`);

export const apiClaimCoupon = (coupon, to) => {
  const payload = {
    coupon,
    to,
  };
  return axios.post('/coupon/claim/', payload);
};

export const apiSendVerifyEmail = (id, ref, locale) => axios.post(`/email/verify/user/${id}`, { ref, locale });

export const apiVerifyEmailByUUID = (uuid, locale) => axios.post(`/email/verify/${uuid}`, { locale });

export const apiPostPayment = payload => axios.post('/payment', payload);

export const apiPostEthPayment = payload => axios.post('/payment/eth', payload);

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

export const apiFetchAuthPlatformURL = platform => axios.get(`/users/login/${platform}`);
export const apiPostAuthPlatformToken = (platform, { code, state }) => axios.post(`/users/login/${platform}`, { code, state });
export const apiFetchLinkedAuthPlatforms = () => axios.get('/users/login/platforms');

export const apiLinkAuthPlatform = (platform, payload) => axios.post(`/users/login/${platform}/add`, payload);

export const apiUnlinkAuthPlatform = platform => axios.delete(`/users/login/${platform}`);

export const apiGetUserSelf = () => axios.get('/users/self');

export const apiFetchUserMission = ({ missionId, user, params }) => axios.get(`/mission/${missionId}/user/${user}`, {
  params,
});

export const apiFetchMissionList = id => axios.get(`/mission/list/${id}`);

export const apiFetchMissionHistoryList = id => axios.get(`/mission/list/history/${id}`);

export const apiFetchMissionHistoryBonus = id => axios.get(`/mission/list/history/${id}/bonus`);

export const apiPostSeenMission = (id, payload) => axios.post(`/mission/seen/${id}`, payload);

export const apiPostStepMission = (id, payload) => axios.post(`/mission/step/${id}`, payload);

export const apiClaimMission = (user, missionId) => axios.post(
  `${LIKECOIN_API_BASE}/mission/claim`,
  { user, missionId },
);

export const apiClaimReferralBonus = (user, type) => axios.post(
  `${LIKECOIN_API_BASE}/mission/referral/claim`,
  { user, type },
);

export const apiPostTwitterMission = (user, url) => axios.post(
  `${LIKECOIN_API_BASE}/mission/twitter`,
  { user, url },
);

export const apiPostRetweetMission = (
  user,
  missionId,
  inputTwitterId,
) => axios.post(`${LIKECOIN_API_BASE}/mission/twitterRetweet`, {
  user,
  missionId,
  inputTwitterId,
});

export const apiPostRegisterOiceMission = user => axios.post(
  `${LIKECOIN_API_BASE}/mission/registerOice`,
  { user },
);

export const apiPostHideMission = (id, payload) => axios.post(`/mission/hide/${id}`, payload);

export const apiFetchReferralMissionList = id => axios.get(`/referral/list/${id}`);

export const apiFetchReferralBonusList = id => axios.get(`/referral/list/bonus/${id}`);

export const apiPostSeenReferral = (id, { referralId }) => axios.post(`/referral/seen/${id}`, { referralId });

export const apiSendCouponCodeEmail = (id, coupon, locale) => axios.post(`/email/verify/user/${id}`, { coupon, locale });

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

export const apiQueryIAPProducts = () => axios.get('/iap/list');

export const apiQueryEthPrice = () => axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD');

export const apiQueryLikeCoinFiatPrice = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

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
export const apiGetCivicLikerRegister = () => axios.get('/civic/quota');
export const apiQueueCivicLikerWaitingList = qs => axios.put(`/civic/queue?${qs}`);
export const apiDequeueCivicLikerWaitingList = qs => axios.delete(`/civic/queue?${qs}`);
export const apiGetCivicLikerTrialEventById = id => axios.get(`/civic/trial/events/${id}`);
export const apiJoinCivicLikerTrialEventById = id => axios.post(`/civic/trial/events/${id}/join`);

export const apiGetOAuthAuthorize = (clientId, redirectUri, scope, opt) => {
  const scopeString = encodeURIComponent(scope.join(' '));
  return axios.get(`${LIKECOIN_MISC_API_BASE}/api/oauth/authorize?client_id=${clientId}&scope=${scopeString}&redirect_uri=${encodeURIComponent(redirectUri)}`, opt);
};
export const apiPostOAuthAuthorize = payload => axios.post(`${LIKECOIN_MISC_API_BASE}/api/oauth/authorize`, payload);

export const getImageResizeAPI = (url, { width } = {}) => `${LIKE_CO_CLOUD_FN_BASE}/thumbnail/?url=${encodeURIComponent(url)}${
  width ? `&width=${width}` : ''
}`;
