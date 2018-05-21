import * as axios from 'axios';

const { window } = global;

const options = { withCredentials: true };
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
}

const instance = axios.create(options);

if (!process.server && window && window.localStorage && window.localStorage.auth) {
  instance.defaults.headers.common.Authorization = `Bearer ${window.localStorage.auth}`;
}

export function setJWTToken(token) {
  if (!process.server) {
    if (window && window.localStorage) window.localStorage.auth = token;
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
}

export default instance;
