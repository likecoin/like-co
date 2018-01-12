import axios from '~/plugins/axios';

export const apiPostUploadImage = (form) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    params.append(key, form[key]);
  });
  return axios.post('/upload', params);
};

export const apiPostMeme = (uid, topText, text, metadata) =>
  axios.post(`/meme/${uid}`, { topText, text, metadata });

export const apiGrantLike = addr =>
  axios.post(`/faucet/${addr}`);

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

