import { Router } from 'express';
import { fetchTwitterOAuthInfo } from '../../oauth/twitter';
import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { checkPlatformAlreadyLinked, socialLinkTwitter } from '../../util/api/social';
import { ValidationError } from '../../../util/ValidationHelper';

const {
  userCollection: dbRef,
} = require('../../util/firebase');

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
    const platform = 'twitter';
    const doc = await dbRef.doc(user).collection('social').doc(platform).get();
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
      url,
      oAuthToken: newOAuthToken,
      oAuthTokenSecret: newOAuthTokenSecret,
    } = await socialLinkTwitter(
      user,
      { token: oAuthToken, secret: oAuthTokenSecret, oAuthVerifier },
      false,
    );

    res.json({
      platform,
      displayName,
      url,
      oAuthToken: newOAuthToken,
      oAuthTokenSecret: newOAuthTokenSecret,
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
      platform,
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
