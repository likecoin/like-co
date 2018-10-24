import { Router } from 'express';
import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { checkPlatformAlreadyLinked, socialLinkFacebook } from '../../util/api/social';
import { ValidationError } from '../../../util/ValidationHelper';
import { tryToLinkOAuthLogin } from '../../util/api/users';

const { userCollection: dbRef } = require('../../util/firebase');

const router = Router();

router.get('/social/link/facebook/:user', jwtAuth('read'), async (req, res, next) => {
  try {
    const { user } = req.params;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (await checkPlatformAlreadyLinked(user, 'facebook')) {
      throw new ValidationError('already linked');
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.post('/social/link/facebook', jwtAuth('write'), async (req, res, next) => {
  try {
    const {
      access_token: accessToken,
      user,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (!accessToken || !user) {
      throw new ValidationError('invalid payload');
    }

    const platform = 'facebook';
    if (await checkPlatformAlreadyLinked(user, platform)) {
      throw new ValidationError('already linked');
    }

    const {
      displayName,
      link,
      userId,
      appId,
      pages,
    } = await socialLinkFacebook(user, accessToken);

    await tryToLinkOAuthLogin({
      likeCoinId: user,
      platform,
      platformUserId: userId,
    });

    res.json({
      platform,
      displayName,
      id: userId,
      pages,
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
      platform,
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


router.post('/social/link/facebook/:pageId', jwtAuth('write'), async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const { user } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (!user) {
      throw new ValidationError('invalid payload');
    }
    if (!await checkPlatformAlreadyLinked(user, 'facebook')) {
      throw new ValidationError('facebook not linked');
    }

    const query = await dbRef.doc(user).collection('social').doc('facebook').get();
    const fbData = query.data();

    const payload = {};
    if (!fbData.userLink) {
      // move user profile link to userLink if not exists (for migration)
      payload.userLink = fbData.url;
    }

    let url;
    const selectedPage = (fbData.pages || []).find(page => page.id === pageId);
    if (selectedPage) {
      url = selectedPage.link;
    } else if (fbData.userId === pageId && fbData.userLink) {
      url = fbData.userLink;
    }
    if (url) {
      payload.url = url;
    }

    await dbRef.doc(user).collection('social').doc('facebook').set(payload, { merge: true });
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

export default router;
