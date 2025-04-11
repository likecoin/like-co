import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { IS_TESTNET } from '../constant';

// Create express instance
const app = express();

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

// explicit cache control on sdk resources
app.use('/sdk', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=1200, stale-if-error=3600, stale-while-revalidate=3600');
  next();
});

// explicit static serve to avoid middleware effects
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

// Export express app
export default app;
