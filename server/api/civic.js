import { Router } from 'express';

const {
  configCollection: configRef,
} = require('../util/firebase');

const router = Router();

router.get('/civic/csonline', async (req, res, next) => {
  try {
    const doc = await configRef.doc('civicLiker').get();
    const { isCSOnline = false } = (doc.exists && doc.data()) || {};
    res.json({ isCSOnline });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
