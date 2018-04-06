import { Router } from 'express';

import {
  PUBSUB_TOPIC_MISC,
} from '../../constant';
import publisher from '../util/gcloudPub';

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
    const productDoc = await productRef.get();
    if (!productDoc.exists) throw new Error('Invalid product');

    let userRef = null;
    let wallet = '';
    let email = '';

    if (user) {
      userRef = dbRef.doc(user);
      const userDoc = await userRef.get();
      if (!userDoc.exists) throw new Error('Invalid user');
      ({ wallet, email } = userDoc.data());
      if (wallet !== from) throw new Error('User wallet not match');
    }

    const {
      name,
      amount,
      description,
      statementDescriptor,
    } = productDoc.data();
    if (!amount) throw new Error('Product not available for now');


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
    });

    res.json({
      product: productDoc.data(),
      chargeId: charge.id,
      receiptNumber: charge.receipt_number,
    });
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

