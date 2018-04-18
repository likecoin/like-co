import axios from '~/plugins/axios';
import { IS_TESTNET } from '@/constant';

const LIKECOIN_API_BASE = IS_TESTNET ? 'https://api.likecoin.store/test' : 'https://api.likecoin.store';

export const apiCheckIsUser = addr => axios.get(`/api/users/addr/${addr}`);

export const apiGetUserById = id => axios.get(`/api/users/id/${id}`);

export const apiGetUserMinById = id => axios.get(`/api/users/id/${id}/min`);

export const apiGetTxById = id => axios.get(`/api/tx/id/${id}`);

export const apiGetTxToByAddr = addr => axios.get(`/api/tx/addr/to/${addr}`);

export const apiGetTxFromByAddr = addr => axios.get(`/api/tx/addr/from/${addr}`);

export const apiGetReferralById = id => axios.get(`/api/users/referral/${id}`);

export const apiCheckCoupon = code => axios.get(`/api/coupon/coupon/${code}`);

export const apiClaimCoupon = (coupon, to) => {
  const payload = {
    coupon,
    to,
  };
  return axios.post('/api/coupon/claim/', payload);
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

export const apiFetchMissionList = id => axios.get(`/api/mission/list/${id}`);

export const apiFetchMissionHistoryList = id => axios.get(`/api/mission/list/history/${id}`);

export const apiPostSeenMission = (id, payload) => axios.post(`/api/mission/seen/${id}`, payload);

export const apiPostStepMission = (id, payload) => axios.post(`/api/mission/step/${id}`, payload);

export const apiClaimMission = (user, missionId) => axios.post(
  `${LIKECOIN_API_BASE}/mission/claim`,
  { user, missionId },
);

export const apiClaimReferralBonus = (user, type) => axios.post(
  `${LIKECOIN_API_BASE}/referral/claim`,
  { user, type },
);

export const apiFetchReferralMissionList = id => axios.get(`/api/referral/list/${id}`);

export const apiFetchReferralBonusList = id => axios.get(`/api/referral/list/bonus/${id}`);

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

export const apiSendInvitationEmail = (user, email) => axios.post(
  `${LIKECOIN_API_BASE}/store-invite`,
  {
    referrerId: user,
    email,
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
