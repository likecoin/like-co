import axios from 'axios';

import HOST from './host';

export const apiPostUploadImage = (form) => {
  /* eslint-disable no-new */
  const params = new FormData();
  Object.keys(form).forEach((key) => {
    params.append(key, form[key]);
  });
  return axios.post(`${HOST}/upload`, params);
};

export const apiPostMeme = (uid, topText, text, metadata) =>
  axios.post(`${HOST}/meme/${uid}`, { topText, text, metadata });

export const apiGrantLike = addr =>
  axios.post(`${HOST}/faucet/${addr}`);

export const apiPostPayment = payload => axios.post(`${HOST}/payment`, payload);

export const apiGetMetadata = uid => axios.get(`${HOST}/query/${uid}`);

export const apiPostRinkeby = (id, data) =>
  axios.post(`https://rinkeby.infura.io/${id}`, data);
