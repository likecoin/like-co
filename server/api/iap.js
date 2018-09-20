import { Router } from 'express';

import { PUBSUB_TOPIC_MISC } from '../../constant';
import publisher from '../util/gcloudPub';

import stripe from '../util/stripe';
import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';
import { jwtAuth, jwtOptionalAuth } from '../util/jwt';
import { sendPendingSubscriptionEmail, sendSubscriptionThankYouEmail } from '../util/ses';

const {
  db,
  iapCollection: iapRef,
  userCollection: dbRef,
  iapSubscriptionCollection: subRef,
} = require('../util/firebase');

const {
  STRIPE_SUBSCRIPTION_PLAN_ID,
  STRIPE_WEBHOOK_SECRET,
} = require('../config/config.js'); // eslint-disable-line import/no-extraneous-dependencies


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

router.post('/iap/subscription/donation', jwtOptionalAuth, async (req, res, next) => {
  try {
    const {
      token,
      user,
    } = req.body;

    if (user && req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    if (!token) res.status(400).send('MISSING TOKEN');

    if (!STRIPE_SUBSCRIPTION_PLAN_ID) throw new ValidationError('Subscription not configured');

    const planId = STRIPE_SUBSCRIPTION_PLAN_ID;
    let customerId;
    let userData;

    if (user) {
      const userRef = dbRef.doc(user);
      const [userDoc, stripeDoc] = await Promise.all([
        userRef.get(),
        userRef.collection('subscription').doc('stripe').get(),
      ]);
      if (!userDoc.exists) throw new ValidationError('Invalid user');
      if (stripeDoc.exists && stripeDoc.data().customerId) {
        ({ customerId } = stripeDoc.data());
      }
      userData = Validate.filterUserData(userDoc.data());
    }

    if (customerId) {
      const subscriptionList = await stripe.subscriptions.list({
        customer: customerId,
        plan: planId,
        status: 'active',
      });
      if (subscriptionList && subscriptionList.length > 0) {
        throw new ValidationError('Already subscripted');
      }

      await stripe.customers.update(customerId, {
        email: token.email,
        source: token.id,
      });
    } else {
      const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
      });
      customerId = customer.id;
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      metadata: {
        user: user || 'guest',
      },
    });

    const currentTime = Date.now();
    const subscriptionId = subscription.id;
    const stripePayload = {
      customerId,
      subscriptionId,
      planId,
      email: token.email,
      ts: currentTime,
    };

    const subIdRef = subRef.doc(subscriptionId);
    if (user) {
      const userRef = dbRef.doc(user);
      const currentPeriodEnd = subscription.current_period_end * 1000;
      const currentPeriodStart = subscription.current_period_start * 1000;
      const isCanceled = subscription.cancel_at_period_end;
      const isSubscribed = (currentTime > currentPeriodStart && currentTime < currentPeriodEnd);
      const likecoinPayload = {
        currentPeriodEnd,
        currentPeriodStart,
        isCanceled,
        isSubscribed,
      };
      const batch = db.batch();
      batch.set(userRef.collection('subscription').doc('likecoin'), likecoinPayload, { merge: true });
      batch.set(userRef.collection('subscription').doc('stripe'), stripePayload, { merge: true });
      batch.update(userRef, { isSubscribed });
      batch.set(subIdRef, {
        stripe: stripePayload,
        isClaimed: true,
        user,
      }, { merge: true });
      await batch.commit();
      await sendSubscriptionThankYouEmail(res, userData.email, userData);
    } else {
      await subIdRef.set({
        stripe: stripePayload,
        isClaimed: false,
      }, { merge: true });
      await sendPendingSubscriptionEmail(res, token.email, subscriptionId);
    }

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventStripeNewSubscription',
      user,
      stripeEmail: token.email,
      customerId,
      subscriptionId,
      planId,
    });

    res.json({ subscriptionId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/iap/subscription/donation/:user', jwtAuth, async (req, res, next) => {
  try {
    const { user } = req.params;
    const userRef = dbRef.doc(user);
    const subDoc = await userRef.collection('subscription').doc('likecoin').get();
    if (!subDoc.exists) {
      res.status(404).send('SUBSCRIPTION_NOT_FOUND_C');
      return;
    }
    res.json(Validate.filterUserSubscriptionInfo(subDoc.data()));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/iap/subscription/donation/:user', jwtAuth, async (req, res, next) => {
  try {
    const { user } = req.params;
    if (!STRIPE_SUBSCRIPTION_PLAN_ID) throw new ValidationError('Subscription not configured');

    const planId = STRIPE_SUBSCRIPTION_PLAN_ID;

    const userRef = dbRef.doc(user);
    const stripeDoc = await userRef.collection('subscription').doc('stripe').get();
    if (!stripeDoc.exists || !stripeDoc.data().customerId) {
      res.status(404).send('SUBSCRIPTION_NOT_FOUND_C');
      return;
    }

    const { customerId } = stripeDoc.data();

    const [subscription] = await stripe.subscriptions.list({
      customer: customerId,
      plan: planId,
      status: 'active',
    });

    if (!subscription) {
      res.status(404).send('SUBSCRIPTION_NOT_FOUND_S');
      return;
    }
    const subscriptionId = subscription.id;

    await stripe.subscriptions.update({
      customer: customerId,
      subscription_exposed_id: subscriptionId,
    });

    await userRef.collection('subscription').doc('likecoin').update({
      isCanceled: true,
    });

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventStripeCancelSubscription',
      user,
      customerId,
      subscriptionId,
      planId,
    });

    res.json({ subscriptionId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/iap/subscription/claim', jwtAuth, async (req, res, next) => {
  try {
    const {
      subscriptionId,
      user,
    } = req.body;

    if (user && req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const subIdRef = await subRef.doc(subscriptionId);
    const userRef = dbRef.doc(user);
    const userSubRef = userRef.collection('subscription').doc('likecoin');

    const [subDoc, userDoc, userSubDoc] = await Promise.all([
      subIdRef.get(),
      userRef.get(),
      userSubRef.get(),
    ]);
    if (!subDoc.exists) {
      res.status(404).send('SUBSCRIPTION_NOT_FOUND');
      return;
    }
    if (subDoc.data().isClaimed) {
      res.status(400).send('SUBSCRIPTION_ALREADY_CLAIMED');
      return;
    }
    if (!userDoc.exists) {
      res.status(404).send('USER_NOT_FOUND');
      return;
    }
    if (userSubDoc.exists && userSubDoc.data().isSubscribed && !userSubDoc.isCanceled) {
      res.status(400).send('USER_ALREADY_HAS_ACTIVE_SUB');
      return;
    }

    await db.runTransaction(t => t.get(subIdRef).then((d) => {
      if (d.data().isClaimed) return Promise.reject(new Error('SUBSCRIPTION_ALREADY_CLAIMED'));
      return t.update(subIdRef, {
        isClaimed: true,
        user,
      });
    }));

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const currentTime = Date.now();
    const currentPeriodEnd = subscription.current_period_end * 1000;
    const currentPeriodStart = subscription.current_period_start * 1000;
    const isSubscribed = (currentTime > currentPeriodStart && currentTime < currentPeriodEnd);
    const likecoinPayload = {
      currentPeriodEnd,
      currentPeriodStart,
      isCanceled: false,
      isSubscribed,
    };

    const {
      customerId,
      planId,
    } = subDoc.data().stripe;

    const batch = db.batch();
    batch.set(userRef.collection('subscription').doc('stripe'), subDoc.data().stripe, { merge: true });
    batch.set(userRef.collection('subscription').doc('likecoin'), likecoinPayload, { merge: true });
    await batch.commit();
    const userData = Validate.filterUserData(userDoc.data());
    await sendSubscriptionThankYouEmail(res, userData.email, userData);

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventStripeClaimSubscription',
      user,
      customerId,
      subscriptionId,
      planId,
    });
    res.json({ user, subscriptionId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/iap/subscription/hook', async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error(err);
      res.sendStatus(400);
      return;
    }
    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscriptionItem = invoice.lines.data.find(i => i.type === 'subscription');
        const subscriptionId = subscriptionItem.subscription;
        const subDoc = await subRef.doc(subscriptionId).get();
        if (!subDoc.exists) {
          console.error(`Subscription ${subscriptionId} not found`);
          break;
        }
        const { user } = subDoc.data();
        if (user) {
          const currentTime = Date.now();
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userRef = dbRef.doc(user);
          const currentPeriodEnd = subscription.current_period_end * 1000;
          const currentPeriodStart = subscription.current_period_start * 1000;
          const isCanceled = subscription.cancel_at_period_end;
          const isSubscribed = (currentTime > currentPeriodStart && currentTime < currentPeriodEnd);
          const likecoinPayload = {
            currentPeriodEnd,
            currentPeriodStart,
            isCanceled,
            isSubscribed,
          };
          const batch = db.batch();
          batch.set(userRef.collection('subscription').doc('likecoin'), likecoinPayload, { merge: true });
          batch.update(userRef, { isSubscribed });
          await batch.commit();
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;
        const subDoc = await subRef.doc(subscriptionId).get();
        if (!subDoc.exists) {
          console.error(`Subscription ${subscriptionId} not found`);
          break;
        }
        const batch = db.batch();
        batch.update(subRef.doc(subscriptionId), {
          isDeleted: true,
          deleteTs: Date.now(),
        });

        const { user } = subDoc.data();
        if (user) {
          const userRef = dbRef.doc(user);
          const userStripeInfo = await userRef.collection('subscription').doc('stripe').get();
          if ((userStripeInfo.data() || {}).subscriptionId === subscriptionId) {
            batch.update(userRef.collection('subscription').doc('likecoin'), { isSubscribed: false });
            batch.update(userRef, { isSubscribed: false });
          }
        }
        await batch.commit();
        break;
      }
      default:
        // no op
    }
    res.sendStatus(200);
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
