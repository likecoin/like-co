import { Router } from 'express';
import { checkPlatformAlreadyLinked } from './index';
import { fetchTwitterOAuthInfo, fetchTwitterUser } from '../../oauth/twitter';
import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { ValidationError } from '../../../util/ValidationHelper';

const { userCollection: dbRef } = require('../../util/firebase');

const router = Router();

router.get('/social/link/twitter/:user', jwtAuth('read'), async (req, res, next) => {
  try {
    const { user } = req.params;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (await checkPlatformAlreadyLinked(user, 'twitter')) {
      throw new ValidationError('already linked');
    }
    const { url, oAuthToken, oAuthTokenSecret } = await fetchTwitterOAuthInfo(user);
    await dbRef.doc(user).collection('social').doc('twitter').set({
      oAuthToken,
      oAuthTokenSecret,
    }, { merge: true });
    res.json({ url, oAuthToken });
  } catch (err) {
    next(err);
  }
});

router.post('/social/link/twitter', jwtAuth('write'), async (req, res, next) => {
  try {
    const {
      oAuthVerifier,
      oAuthToken,
      user,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (!oAuthVerifier || !oAuthToken || !user) {
      throw new ValidationError('invalid payload');
    }
    const doc = await dbRef.doc(user).collection('social').doc('twitter').get();
    const {
      oAuthToken: token,
      oAuthTokenSecret,
      isLinked,
    } = doc.data();

    if (isLinked) throw new ValidationError('already linked');
    if (token !== oAuthToken) {
      throw new ValidationError('oauth token not match');
    }
    const {
      userId,
      displayName,
      oAuthToken: newOAuthToken,
      oAuthTokenSecret: newOAuthSecret,
    } = await fetchTwitterUser(oAuthToken, oAuthTokenSecret, oAuthVerifier);
    const url = `https://twitter.com/intent/user?user_id=${userId}`;
    await dbRef.doc(user).collection('social').doc('twitter').set({
      displayName,
      userId,
      url,
      oAuthToken: newOAuthToken,
      oAuthTokenSecret: newOAuthSecret,
      isLinked: true,
      ts: Date.now(),
    }, { merge: true });
    res.json({
      platform: 'twitter',
      displayName,
      url,
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
      platform: 'twitter',
      user,
      email: email || undefined,
      displayName: userDisplayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      twiiterUserName: displayName,
      twitterID: userId,
      twitterURL: url,
      registerTime: timestamp,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
