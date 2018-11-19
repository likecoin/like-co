import { Router } from 'express';
import { checkPlatformAlreadyLinked } from '../../util/api/social';
import { fetchFlickrOAuthInfo, fetchFlickrUser } from '../../oauth/flickr';
import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { ValidationError } from '../../../util/ValidationHelper';

const {
  userCollection: dbRef,
  FieldValue,
} = require('../../util/firebase');

const router = Router();

router.get('/social/link/flickr/:user', jwtAuth('read'), async (req, res, next) => {
  try {
    const { user } = req.params;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (await checkPlatformAlreadyLinked(user, 'flickr')) {
      throw new ValidationError('already linked');
    }
    const { url, oAuthToken, oAuthTokenSecret } = await fetchFlickrOAuthInfo(user);
    await dbRef.doc(user).collection('social').doc('flickr').set({
      oAuthToken,
      oAuthTokenSecret,
    }, { merge: true });
    res.json({ url, oAuthToken });
  } catch (err) {
    next(err);
  }
});

router.post('/social/link/flickr', jwtAuth('write'), async (req, res, next) => {
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
    const doc = await dbRef.doc(user).collection('social').doc('flickr').get();
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
      fullName,
      userId,
      userName,
    } = await fetchFlickrUser(oAuthToken, oAuthTokenSecret, oAuthVerifier);
    const url = `https://www.flickr.com/people/${userId}`;
    await dbRef.doc(user).collection('social').doc('flickr').set({
      displayName: userName,
      userId,
      url,
      oAuthToken: FieldValue.delete(),
      oAuthTokenSecret: FieldValue.delete(),
      isLinked: true,
      ts: Date.now(),
    }, { merge: true });
    res.json({
      platform: 'flickr',
      displayName: userName,
      url,
    });
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
      logType: 'eventSocialLink',
      platform: 'flickr',
      user,
      email: email || undefined,
      displayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      flickrName: fullName,
      flickrUserName: userName,
      flickrID: userId,
      flickrURL: url,
      registerTime: timestamp,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
