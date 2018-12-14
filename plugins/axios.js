import axios from 'axios';

const options = { withCredentials: true };
// The server-side needs a full url to works
if (process.server) {
  options.baseURL = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
}

const instance = axios.create(options);
export default instance;
