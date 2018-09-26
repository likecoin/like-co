import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import axiosist from 'axiosist';
import api from '../../server/api';

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api', api);

const axios = axiosist(app);

module.exports = axios;
