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

if (!process.env.CI) startPoller();
export default router;
