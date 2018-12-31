import { Router } from 'express';
import {
  PUBSUB_TOPIC_MISC,
  CIVIC_LIKER_START_DATE,
} from '../../constant';
import { jwtAuth } from '../util/jwt';
import {
  getUserWithCivicLikerProperties,
} from '../util/api/users';
import publisher from '../util/gcloudPub';

const {
  userCollection: dbRef,
  configCollection: configRef,
} = require('../util/firebase');

const router = Router();

router.put('/civic/queue/user/:id', jwtAuth('write'), async (req, res, next) => {
  try {
    if (!process.env.CI && Date.now() < CIVIC_LIKER_START_DATE) {
      res.status(401).send('CIVIC_LIKER_NOT_AVAILALE');
      return;
    }
    const { id } = req.params;
    const {
      from: civicReferrer,
      referrer: civicSourceURL,
    } = req.query;
    if (req.user.user !== id) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const payload = await getUserWithCivicLikerProperties(id);
    if (!payload) throw new Error('USER_NOT_EXIST');

    const {
      email,
      displayName,
      wallet,
      referrer,
      locale,
      timestamp: registerTime,
      currentPeriodEnd,
      currentPeriodStart,
    } = payload;

    const now = Date.now();
    if (now >= currentPeriodStart && currentPeriodEnd <= now) {
      res.status(401).send('ALREADY_CIVIC_LIKER');
    }

    await dbRef.doc(id).update({ civicLikerStatus: 'waiting' });

    res.send(200);

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventCivicLikerQueue',
      type: 'queue',
      user: id,
      email,
      displayName,
      wallet,
      referrer,
      locale,
      registerTime,
      civicReferrer,
      civicSourceURL,
    });
  } catch (err) {
    next(err);
  }
});


router.delete('/civic/queue/user/:id', jwtAuth('write'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      from: civicReferrer,
      referrer: civicSourceURL,
    } = req.query;
    if (req.user.user !== id) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const payload = await getUserWithCivicLikerProperties(id);
    if (!payload) throw new Error('USER_NOT_EXIST');

    const {
      email,
      displayName,
      wallet,
      referrer,
      locale,
      timestamp: registerTime,
      currentPeriodEnd,
      currentPeriodStart,
    } = payload;

    const now = Date.now();
    if (now >= currentPeriodStart && currentPeriodEnd <= now) {
      res.status(401).send('ALREADY_CIVIC_LIKER');
    }

    await dbRef.doc(id).update({ civicLikerStatus: 'intercom' });

    res.send(200);

    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventCivicLikerQueue',
      type: 'intercom',
      user: id,
      email,
      displayName,
      wallet,
      referrer,
      locale,
      registerTime,
      civicReferrer,
      civicSourceURL,
    });
  } catch (err) {
    next(err);
  }
});


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
