import { Router } from 'express';

import { PUBSUB_TOPIC_MISC } from '../../constant';
import publisher from '../util/gcloudPub';
import { jwtAuth } from '../util/jwt';
import { fetchFacebookUser } from '../oauth/facebook';
import { fetchFlickrOAuthToken, fetchFlickrUser } from '../oauth/flickr';
import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';

const { userCollection: dbRef } = require('../util/firebase');

async function checkPlatformAlreadyLinked(user, platform) {
  const doc = await dbRef.doc(user).collection('social').doc(platform).get();
  return doc.data() && doc.data().isLinked;
}

const router = Router();

router.get('/social/list/:id', async (req, res, next) => {
  try {
    const username = req.params.id;
    const col = await dbRef.doc(username).collection('social').get();
    const replyObj = {};
    col.docs.forEach((d) => {
      const { isLinked } = d.data();
      if (isLinked) replyObj[d.id] = Validate.filterSocialPlatform({ ...d.data() });
    });
    res.json(replyObj);
  } catch (err) {
    next(err);
  }
});

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
    } = await fetchFacebookUser(accessToken);
    await dbRef.doc(user).collection('social').doc('facebook').create({
      displayName,
      userId,
      appId,
      accessToken,
      url: link,
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

router.get('/social/link/flickr/:user', jwtAuth, async (req, res, next) => {
  try {
    const { user } = req.params;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (await checkPlatformAlreadyLinked(user, 'flickr')) {
      throw new ValidationError('already linked');
    }
    const { oAuthToken, oAuthTokenSecret } = await fetchFlickrOAuthToken(user);
    await dbRef.doc(user).collection('social').doc('flickr').set({
      oAuthToken,
      oAuthTokenSecret,
    }, { merge: true });
    res.json({ oAuthToken });
  } catch (err) {
    next(err);
  }
});

router.post('/social/link/flickr', jwtAuth, async (req, res, next) => {
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
      oAuthToken: newOAuthToken,
      oAuthTokenSecret: newOAuthSecret,
    } = await fetchFlickrUser(oAuthToken, oAuthTokenSecret, oAuthVerifier);
    const url = `https://www.flickr.com/people/${userId}`;
    await dbRef.doc(user).collection('social').doc('flickr').set({
      userName,
      userId,
      url,
      oAuthToken: newOAuthToken,
      oAuthTokenSecret: newOAuthSecret,
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
