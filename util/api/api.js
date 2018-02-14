import axios from '~/plugins/axios';

export const apiCheckIsUser = addr => axios.get(`/api/users/addr/${addr}`);

export const apiGetUserById = id => axios.get(`/api/users/id/${id}`);

export const apiGetTxById = id => axios.get(`/api/tx/id/${id}`);

export const apiGetTxToByAddr = addr => axios.get(`/api/tx/addr/to/${addr}`);

export const apiGetTxFromByAddr = addr => axios.get(`/api/tx/addr/from/${addr}`);

export const apiCheckCoupon = code => axios.get(`/api/coupon/coupon/${code}`);

export const apiClaimCoupon = (coupon, to) => {
  const payload = {
    coupon,
    to,
  };
  return axios.post('/api/coupon/claim/', payload);
};

export const apiSendVerifyEmail = id => axios.post(`/api/email/verify/user/${id}`, {});

export const apiVerifyEmailByUUID = uuid => axios.post(`/api/email/verify/${uuid}`, {});

export const apiPostPayment = payload => axios.post('/api/payment/', payload);

export const apiPostNewUser = (form) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    params.append(key, form[key]);
  });
  return axios.put('/api/users/new', params);
};

