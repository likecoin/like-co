import { Router } from 'express';

import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { ValidationHelper as Validate, ValidationError } from '../../../util/ValidationHelper';

import facebook from './facebook';
import flickr from './flickr';
import medium from './medium';
import twitter from './twitter';
import instagram from './instagram';

const { userCollection: dbRef } = require('../../util/firebase');

const router = Router();

router.use(facebook);
router.use(flickr);
router.use(medium);
router.use(twitter);
router.use(instagram);

router.get('/social/list/:id', async (req, res, next) => {
  try {
    const username = req.params.id;
    const col = await dbRef.doc(username).collection('social').get();
    const replyObj = {};
    col.docs.forEach((d) => {
      const { isLinked, isPublic } = d.data();
      if (isLinked && isPublic !== false) {
        replyObj[d.id] = Validate.filterSocialPlatformPublic({ ...d.data() });
      }
    });
    res.json(replyObj);
  } catch (err) {
    next(err);
  }
});

router.get('/social/list/:id/details', jwtAuth, async (req, res, next) => {
  try {
    const username = req.params.id;
    if (req.user.user !== username) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const col = await dbRef.doc(username).collection('social').get();
    const replyObj = {};

    col.docs.forEach((d) => {
      const { isLinked } = d.data();
      if (isLinked) {
        replyObj[d.id] = Validate.filterSocialPlatformPersonal({ ...d.data() });
      }
    });

    res.json(replyObj);
  } catch (err) {
    next(err);
  }
});

router.post('/social/unlink/:platform', jwtAuth, async (req, res, next) => {
  try {
    const { platform } = req.params;
    const {
      user,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    const socialDoc = await dbRef.doc(user).collection('social').doc(platform).get();
    if (!socialDoc.exists) throw new ValidationError('platform unknown');
    await socialDoc.ref.delete();
    res.sendStatus(200);
    const userDoc = await dbRef.doc(user).get();
    const {
      email,
      displayName,
      wallet,
      referrer,
      locale,
      timestamp,
    } = userDoc.data();
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventSocialUnlink',
      platform,
      user,
      email: email || undefined,
      displayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      registerTime: timestamp,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/social/public', jwtAuth, async (req, res, next) => {
  try {
    const {
      user,
      platforms,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    console.log(platforms, dbRef.batch);
    const promises = Object.keys(platforms).map((id) => {
      const userReferralRef = dbRef.doc(user).collection('social').doc(id);
      return userReferralRef.update({ isPublic: platforms[id] });
    });

    await Promise.all(promises);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

export async function checkPlatformAlreadyLinked(user, platform) {
  const doc = await dbRef.doc(user).collection('social').doc(platform).get();
  return doc.data() && doc.data().isLinked;
}
export default router;
