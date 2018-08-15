import { Router } from 'express';

import { PUBSUB_TOPIC_MISC } from '../../constant';
import publisher from '../util/gcloudPub';

import stripe from '../util/stripe';
import { ValidationError } from '../../util/ValidationHelper';

const {
  iapCollection: iapRef,
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

router.post('/iap/purchase/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      user,
      from,
      token,
    } = req.body;
    const productRef = iapRef.doc(productId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) throw new ValidationError('Invalid product');

    let userRef = null;
    let wallet = '';
    let email = '';
    let referrer;
    let timestamp;

    if (user) {
      userRef = dbRef.doc(user);
      const userDoc = await userRef.get();
      if (!userDoc.exists) throw new ValidationError('Invalid user');
      ({
        wallet,
        email,
        referrer,
        timestamp,
      } = userDoc.data());
      if (wallet !== from) throw new ValidationError('User wallet not match');
    }

    const {
      name,
      amount,
      description,
      statementDescriptor,
    } = productDoc.data();
    if (!amount) throw new ValidationError('Product not available for now');


    const DEFAULT_LOCALE = 'en';

    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      description: description[DEFAULT_LOCALE],
      statement_descriptor: statementDescriptor || description[DEFAULT_LOCALE],
      metadata: {
        user: user || '',
        email,
        name: name[DEFAULT_LOCALE],
        description: description[DEFAULT_LOCALE],
        productId,
      },
      receipt_email: token.email,
      source: token.id,
    });

    if (user) {
      await userRef.collection('Stripe').doc(charge.id).set({
        chargeId: charge.id,
        amount,
        name: name[DEFAULT_LOCALE],
        description: description[DEFAULT_LOCALE],
        statement_descriptor: statementDescriptor || description[DEFAULT_LOCALE],
        productId,
        ts: Date.now(),
      }, { merge: true });
    }

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventStripePurchase',
      user,
      email,
      wallet,
      chargeId: charge.id,
      currency: 'usd',
      amount,
      productName: name[DEFAULT_LOCALE],
      description: description[DEFAULT_LOCALE],
      productId,
      referrer,
      registerTime: timestamp,
    });

    res.json({
      product: productDoc.data(),
      chargeId: charge.id,
      receiptNumber: charge.receipt_number,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});


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
