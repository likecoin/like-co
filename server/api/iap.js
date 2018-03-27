import { Router } from 'express';

import {
  KYC_STATUS_ENUM,
} from '../../constant';

import stripe from '../util/stripe';

const {
  iapCollection: iapRef,
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

router.post('/iap/purchase/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      user,
      from,
      token,
    } = req.body;
    const productRef = iapRef.doc(productId);
    const userRef = dbRef.doc(user);

    const [productDoc, userDoc] = await Promise.all([productRef.get(), userRef.get()]);
    if (!userDoc.exists) throw new Error('Invalid user');
    if (!productDoc.exists) throw new Error('Invalid product');

    const { amount, description, statementDescriptor } = productDoc.data();
    if (!amount) throw new Error('Product not available for now');

    const userData = userDoc.data();
    if (userData.KYC < KYC_STATUS_ENUM.STANDARD) throw new Error('need KYC');
    const { wallet, email } = userDoc.data();
    if (wallet !== from) throw new Error('User wallet not match');

    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      description,
      statement_descriptor: statementDescriptor || description,
      metadata: {
        user,
        wallet,
        email,
        productId,
      },
      receipt_email: email,
      source: token,
    });

    await userRef.collection('Stripe').doc(charge.id).set({
      chargeId: charge.id,
      amount,
      description,
      statement_descriptor: statementDescriptor || description,
      productId,
      ts: Date.now(),
    }, { merge: true });

    res.json({ product: productDoc.data(), chargeId: charge.id });
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});


router.get('/iap/list', async (req, res) => {
  try {
    const doc = await iapRef.get();
    res.json(doc.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (err) {
    console.error(err);
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;

