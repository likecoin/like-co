import axios from 'axios';

const options = { withCredentials: true };
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = process.env.LIKE_API_HOST
    ? `http://${process.env.LIKE_API_HOST}`
    : `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}/api`;
} else {
  options.baseURL = '/api';
}

const instance = axios.create(options);
export default instance;
