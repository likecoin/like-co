import { Router } from 'express';
import cors from 'cors';

import users from './users';
import payment from './payment';
import iap from './iap';
import mission from './mission';
import oembed from './oembed';
import social from './social';
import experiments from './experiments';
import { startPoller } from '../util/poller';
import { ValidationError } from '../../util/ValidationHelper';
import { IS_TESTNET, TEST_MODE } from '../../constant';

const corsWhiteList = [/\.like\.co$/];
if (IS_TESTNET || TEST_MODE) corsWhiteList.push(/^http(s)?:\/\/localhost(:\d+)?$/);

const router = Router();

// HACK: allow users to be called from other services before api refactor
router.use('/users', cors({ origin: corsWhiteList, credentials: true }));
router.use('/experiments', cors({ origin: corsWhiteList }));
router.use(users);
router.use(payment);
router.use(iap);
router.use(mission);
router.use(oembed);
router.use(social);
router.use(experiments);

router.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

function errorHandler(err, req, res, next) {
  const msg = (err.response && err.response.data) || err.message || err;
  console.error(msg);
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof ValidationError) {
    res.set('Content-Type', 'text/plain');
    return res.status(400).send(msg);
  }
  // Handle multer error
  if (err.code) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.set('Content-Type', 'text/plain');
      return res.status(400).send('FILE_TOO_LARGE');
    }
    if (err.code === 'EBADCSRFTOKEN') {
      res.set('Content-Type', 'text/plain');
      return res.status(400).send('BAD_CSRF_TOKEN');
    }
  }
  return res.sendStatus(500);
}

router.use(errorHandler);

if (!process.env.CI) startPoller();
export default router;
