import { Router } from 'express';

const {
  configCollection: configRef,
} = require('../util/firebase');

const router = Router();

router.get('/experiments/list', async (req, res, next) => {
  try {
    const doc = await configRef.doc('experiments').get();
    if (!doc.exists) {
      res.json([]);
      return;
    }
    const data = doc.data();
    const list = Object.keys(data).map(exp => ({ name: exp, ...data[exp] }));
    res.set('Cache-Control', 'public, max-age=600');
    res.json(list);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
