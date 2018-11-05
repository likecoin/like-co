import { Router } from 'express';

const {
  iapCollection: iapRef,
} = require('../util/firebase');

const router = Router();

router.get('/iap/list', async (req, res, next) => {
  try {
    const doc = await iapRef.get();
    res.json(doc.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
