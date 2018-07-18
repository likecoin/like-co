import { Router } from 'express';
import { checkPlatformAlreadyLinked } from './index';
import { fetchFacebookUser } from '../../oauth/facebook';
import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { ValidationError } from '../../../util/ValidationHelper';

const { userCollection: dbRef } = require('../../util/firebase');

const router = Router();

router.get('/social/link/facebook/:user', jwtAuth, async (req, res, next) => {
  try {
    const { user } = req.params;
    if (await checkPlatformAlreadyLinked(user, 'facebook')) {
      throw new ValidationError('already linked');
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/social/link/facebook', jwtAuth, async (req, res, next) => {
  try {
    const {
      access_token: accessToken,
      user,
    } = req.body;
    if (!accessToken || !user) {
      throw new ValidationError('invalid payload');
    }
    if (await checkPlatformAlreadyLinked(user, 'facebook')) {
      throw new ValidationError('already linked');
    }
    const {
      displayName,
      link,
      userId,
      appId,
      pages,
    } = await fetchFacebookUser(accessToken);
    await dbRef.doc(user).collection('social').doc('facebook').create({
      displayName,
      userId,
      appId,
      accessToken,
      url: link,
      pages,
      isLinked: true,
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
      timestamp,
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
      registerTime: timestamp,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
