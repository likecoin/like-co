import axios from '~/plugins/axios';
import { IS_TESTNET } from '@/constant';

const LIKECOIN_API_BASE = IS_TESTNET ? 'https://api.likecoin.store/test' : 'https://api.likecoin.store';

export const apiCheckIsUser = addr => axios.get(`/api/users/addr/${addr}`);

export const apiGetUserById = id => axios.get(`/api/users/id/${id}`);

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

export const apiPostKYC = payload => axios.post('/api/kyc', payload);

export const apiCheckCanGetFreeLikeCoin = user => axios.get(`/api/coupon/sentto/v2/${user}`);

export const apiSendCouponCodeEmail = (id, coupon, locale) => axios.post(`/api/email/verify/user/${id}`, { coupon, locale });

export const apiSendInvitationEmail = (user, email) => axios.post(
  `${LIKECOIN_API_BASE}/store-invite`,
  {
    referrerId: user,
    email,
  },
);
