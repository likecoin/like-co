import express from 'express';
import proxy from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import { Nuxt, Builder } from 'nuxt';
import { IS_TESTNET } from '../constant';
import { CSRF_COOKIE_OPTION } from './constant/server';

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

app.set('port', port);

if (process.env.NODE_ENV === 'production') app.disable('x-powered-by');

// proxy API Routes
app.use('/api', proxy({
  target: `http://${process.env.LIKE_API_HOST || 'localhost:3001'}`,
  pathRewrite: { '^/api': '' },
}));

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');

config.dev = !(process.env.NODE_ENV === 'production');

// Init Nuxt.js
const nuxt = new Nuxt(config);

// Build only in dev mode
/* istanbul ignore if */
if (config.dev) {
  const builder = new Builder(nuxt);
  builder.build();
}

app.use((req, res, next) => {
  if (!/^\/in\/embed\/[-a-z0-9_]+/.test(req.path)) {
    res.setHeader('X-Frame-Options', 'DENY');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-if-error=604800, stale-while-revalidate=604800');
  }
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin');
  next();
});

// needed for csrf parsing in vuex
app.use(cookieParser());
app.use(csrf({ cookie: CSRF_COOKIE_OPTION }));
// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server if not under e2e test
if (!process.env.IS_STANDALONE_TEST) {
  app.listen(port, host);

  console.log(`Deploying on ${IS_TESTNET ? 'rinkeby' : 'mainnet'}`); // eslint-disable-line no-console
  console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
}

export default app;
