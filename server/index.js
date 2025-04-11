import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Nuxt, Builder } from 'nuxt';
import { IS_TESTNET } from '../constant';

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

app.set('port', port);
app.use(helmet({
  frameguard: false,
  referrerPolicy: { policy: 'strict-origin' },
}));
app.get('/api/healthz', (req, res) => {
  res.sendStatus(200);
});

// proxy API Routes
app.use('/api', createProxyMiddleware({
  changeOrigin: true,
  target: process.env.LIKE_API_HOST ? `http://${process.env.LIKE_API_HOST}` : `https://${IS_TESTNET ? 'rinkeby.' : ''}like.co/api`,
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

// explicit cache control on sdk resources
app.use('/sdk', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=1200, stale-if-error=3600, stale-while-revalidate=3600');
  next();
});
// explicit staic serve to avoid middleware effects
app.use(express.static(path.resolve(__dirname, '../static')));

app.use((req, res, next) => {
  if (!/^\/in\/embed\/[-a-z0-9_]+/.test(req.path)) {
    res.setHeader('X-Frame-Options', 'DENY');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-if-error=604800, stale-while-revalidate=604800');
  }
  next();
});

app.use(cookieParser());
// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server if not under e2e test
if (!process.env.IS_STANDALONE_TEST) {
  app.listen(port, host);

  console.log(`Deploying on ${IS_TESTNET ? 'rinkeby' : 'mainnet'}`); // eslint-disable-line no-console
  console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
}

export default app;
