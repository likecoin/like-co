import { Router } from 'express';

import users from './users';
import payment from './payment';
import kyc from './kyc';
import iap from './iap';

const router = Router();

// Add USERS Routes
router.use(users);
router.use(payment);
router.use(kyc);
router.use(iap);

router.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

export default router;
