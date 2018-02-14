import { Router } from 'express';

import users from './users';
import payment from './payment';

const router = Router();

// Add USERS Routes
router.use(users);
router.use(payment);

router.get('/healthz', (req, res) => {
  res.sendStatus(200);
});

export default router;
