import { Router } from 'express';

import { PUBSUB_TOPIC_MISC } from '../../constant';
import publisher from '../util/gcloudPub';
import { jwtAuth } from '../util/jwt';
import { fetchFacebookUser } from '../oauth/facebook';
import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';

const { userCollection: dbRef } = require('../util/firebase');

const router = Router();

router.get('/social/list/:id', async (req, res, next) => {
  try {
    const username = req.params.id;
    const col = await dbRef.doc(username).collection('social').get();
    const replyObj = {};
    col.docs.forEach((d) => {
      replyObj[d.id] = Validate.filterSocialPlatform({ ...d.data() });
    });
    res.json(replyObj);
  } catch (err) {
    next(err);
  }
});

router.get('/social/link/facebook', jwtAuth, async (req, res) => res.sendStatus(200));

router.post('/social/link/facebook', jwtAuth, async (req, res, next) => {
  try {
    const {
      access_token: accessToken,
      user,
    } = req.body;
    if (!accessToken || !user) {
      throw new ValidationError('invalid payload');
    }
    const {
      displayName,
      link,
      userId,
      appId,
    } = await fetchFacebookUser(accessToken);
    await dbRef.doc(user).collection('social').doc('facebook').create({
      displayName,
      userId,
      appId,
      accessToken,
      url: link,
      ts: Date.now(),
    });
    res.json({
      platform: 'facebook',
      displayName,
      url: link,
    });
    const userDoc = await dbRef.doc(user).get();
    const {
      email,
      displayName: userDisplayName,
      wallet,
      referrer,
      locale,
    } = userDoc.data();
    publisher.publish(PUBSUB_TOPIC_MISC, req, {
      logType: 'eventSocialLink',
      platform: 'facebook',
      user,
      email: email || undefined,
      displayName: userDisplayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      facebookName: displayName,
      facebookID: userId,
      facebookAppId: appId,
      facebookURL: link,
    });
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
    });
  } catch (err) {
    next(err);
  }
});

export default router;
