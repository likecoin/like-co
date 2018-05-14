import { Router } from 'express';

import users from './users';
import payment from './payment';
import kyc from './kyc';
import iap from './iap';
import mission from './mission';
import oembed from './oembed';
import { startPoller } from '../util/poller';

const router = Router();

// Add USERS Routes
router.use(users);
router.use(payment);
router.use(kyc);
router.use(iap);
router.use(mission);
router.use(oembed);

router.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  // Handle multer error
  if (err.code && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).send('FILE_TOO_LARGE');
  }
  return res.status(500);
}

router.use(errorHandler);

if (!process.env.CI) startPoller();
export default router;
