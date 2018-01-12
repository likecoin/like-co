import axios from '~/plugins/axios';

export const apiGrantLike = addr =>
  axios.post(`/faucet/${addr}`);

export const apiCheckCoupon = code => axios.get(`api/coupon/coupon/${code}`);

export const apiClaimCoupon = (coupon, to) => {
  const payload = {
    coupon,
    to,
  };
  return axios.post('api/coupon/claim/', payload);
};

export const apiPostPayment = payload => axios.post('/api/payment/', payload);

export const apiGetBlockie = addr => axios.get(`/api/blockie/${addr}`);

export const apiPostRinkeby = (id, data) =>
  axios.post(`https://rinkeby.infura.io/${id}`, data);

export const apiPostNewUser = (form) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    params.append(key, form[key]);
  });
  return axios.put('/api/users/new', params);
};

