import express from 'express';
import i18n from 'i18n';
import compression from 'compression';
import bodyParser from 'body-parser';
import { Nuxt, Builder } from 'nuxt';
import { IS_TESTNET } from '../constant';

import api from './api';

const path = require('path');

i18n.configure({
  locales: ['en', 'zh'],
  directory: path.resolve(__dirname, '../locales'),
  objectNotation: true,
});

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

app.set('port', port);

if (process.env.NODE_ENV === 'production') app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin');
  next();
});

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(i18n.init);
app.use((req, res, next) => {
  if (req.body.locale) i18n.setLocale(res, req.body.locale);
  next();
});

// Import API Routes
app.use('/api', api);

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');

config.dev = !(process.env.NODE_ENV === 'production');

// Init Nuxt.js
const nuxt = new Nuxt(config);

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}

// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server
app.listen(port, host);
console.log(`Deploying on ${IS_TESTNET ? 'rinkeby' : 'mainnet'}`); // eslint-disable-line no-console
console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
