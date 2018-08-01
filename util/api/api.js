import axios from '~/plugins/axios';
import { IS_TESTNET, EXTERNAL_HOSTNAME } from '@/constant';

const LIKECOIN_API_BASE = IS_TESTNET ? 'https://api.rinkeby.like.co' : 'https://api.like.co';
const LIKECOIN_MISC_API_BASE = `https://${EXTERNAL_HOSTNAME}`;

export const apiCheckIsUser = addr => axios.get(`/api/users/addr/${addr}/min`);

export const apiGetUserByAddr = addr => axios.get(`/api/users/addr/${addr}`);

export const apiGetUserById = id => axios.get(`/api/users/id/${id}`);

export const apiGetUserMinById = id => axios.get(`/api/users/id/${id}/min`);

export const apiGetUserMinByMerchantId = id => axios.get(`/api/users/merchant/${id}/min`);

export const apiGetTxById = id => axios.get(`/api/tx/id/${id}`);

export const apiGetTxToByAddr = addr => axios.get(`/api/tx/addr/to/${addr}`);

export const apiGetTxFromByAddr = addr => axios.get(`/api/tx/addr/from/${addr}`);

export const apiGetReferralById = id => axios.get(`/api/users/referral/${id}`);

export const apiGetTotalBonusById = id => axios.get(`/api/users/bonus/${id}`);

export const apiCheckCoupon = code => axios.get(`${LIKECOIN_MISC_API_BASE}/api/coupon/coupon/${code}`);

export const apiClaimCoupon = (coupon, to) => {
  const payload = {
    coupon,
    to,
  };
  return axios.post(`${LIKECOIN_MISC_API_BASE}/api/coupon/claim/`, payload);
};

export const apiSendVerifyEmail = (id, ref, locale) => axios.post(`/api/email/verify/user/${id}`, { ref, locale });

export const apiVerifyEmailByUUID = (uuid, locale) => axios.post(`/api/email/verify/${uuid}`, { locale });

export const apiPostPayment = payload => axios.post('/api/payment', payload);

export const apiPostEthPayment = payload => axios.post('/api/payment/eth', payload);

export const apiPostNewUser = (form) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    params.append(key, form[key]);
  });
  return axios.put('/api/users/new', params);
};

export const apiCheckUserAuth = wallet => axios.post('/api/users/login/check', { wallet });

export const apiLoginUser = payload => axios.post('/api/users/login', payload);

export const apiFetchUserMission = ({ missionId, user, params }) => axios.get(`/api/mission/${missionId}/user/${user}`, {
  params,
});

export const apiFetchMissionList = id => axios.get(`/api/mission/list/${id}`);

export const apiFetchMissionHistoryList = id => axios.get(`/api/mission/list/history/${id}`);

export const apiFetchMissionHistoryBonus = id => axios.get(`/api/mission/list/history/${id}/bonus`);

export const apiPostSeenMission = (id, payload) => axios.post(`/api/mission/seen/${id}`, payload);

export const apiPostStepMission = (id, payload) => axios.post(`/api/mission/step/${id}`, payload);

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

export const apiPostHideMission = (id, payload) => axios.post(`/api/mission/hide/${id}`, payload);

export const apiFetchReferralMissionList = id => axios.get(`/api/referral/list/${id}`);

export const apiFetchReferralBonusList = id => axios.get(`/api/referral/list/bonus/${id}`);

export const apiPostSeenReferral = (id, { referralId }) => axios.post(`/api/referral/seen/${id}`, { referralId });

export const apiPostKYC = payload => axios.post('/api/kyc', payload);

export const apiPostAdvancedKYC = (form) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    if (Array.isArray(form[key])) {
      form[key].forEach(k => params.append(key, k));
    } else {
      params.append(key, form[key]);
    }
  });
  return axios.post('/api/kyc/advanced', params);
};

export const apiGetAdvancedKYC = id => axios.get(`/api/kyc/advanced/${id}`);

export const apiSendCouponCodeEmail = (id, coupon, locale) => axios.post(`/api/email/verify/user/${id}`, { coupon, locale });

export const apiSendInvitationEmail = (user, email, locale) => axios.post(
  `${LIKECOIN_API_BASE}/misc/store-invite`,
  {
    referrerId: user,
    email,
    locale,
  },
);

export const apiQueryTxHistoryByAddr = (addr, ts, count) => {
  let url = `/api/tx/history/addr/${addr}?`;
  if (ts) url += `ts=${ts}&`;
  if (count) url += `count=${count}&`;
  return axios.get(url);
};

export const apiPurchaseIAP = (id, payload) => axios.post(`/api/iap/purchase/${id}`, payload);

export const apiQueryIAPProducts = () => axios.get('/api/iap/list');

export const apiQueryEthPrice = () => axios.get('https://api.coinmarketcap.com/v1/ticker/ethereum/?convert=USD');

export const apiQueryLikeCoinFiatPrice = () => axios.get('https://api.coingecko.com/api/v3/coins/likecoin?localization=false', { withCredentials: false });

export const apiSetNotification = (id, isEmailEnabled) => axios.post(`/api/users/email/${id}`, { isEmailEnabled });

export const apiGetSocialListById = id => axios.get(`/api/social/list/${id}`);

export const apiGetSocialPlatformLink = (platform, id) => axios.get(`/api/social/link/${platform}/${id}`);

export const apiLinkSocialPlatform = (platform, payload) => axios.post(`/api/social/link/${platform}`, payload);

export const apiUnlinkSocialPlatform = (platform, payload) => axios.post(`/api/social/unlink/${platform}`, payload);

export const apiGetLikeButtonMyStatus =
  (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/self`, { params: { referrer } });

export const apiGetLikeButtonTotalCount =
  (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/total`, { params: { referrer } });

export const apiGetLikeButtonLikerList =
  (id, referrer) => axios.get(`${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/list`, { params: { referrer } });

export const apiPostLikeButton =
  (id, referrer, count = 1) => axios.post(
    `${LIKECOIN_MISC_API_BASE}/api/like/likebutton/${id}/${count}`,
    {},
    { params: { referrer } },
  );
