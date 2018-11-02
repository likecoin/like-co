import { Router } from 'express';
import { checkPlatformAlreadyLinked } from './index';
import { fetchInstagramOAuthInfo, fetchInstagramUser } from '../../oauth/instagram';
import { PUBSUB_TOPIC_MISC } from '../../../constant';
import publisher from '../../util/gcloudPub';
import { jwtAuth } from '../../util/jwt';
import { ValidationError } from '../../../util/ValidationHelper';

const {
  userCollection: dbRef,
  FieldValue,
} = require('../../util/firebase');

const router = Router();

router.get('/social/link/instagram/:user', jwtAuth('read'), async (req, res, next) => {
  try {
    const { user } = req.params;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (await checkPlatformAlreadyLinked(user, 'instagram')) {
      throw new ValidationError('already linked');
    }
    const { url } = await fetchInstagramOAuthInfo(user);
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

router.post('/social/link/instagram', jwtAuth('write'), async (req, res, next) => {
  try {
    const {
      code,
      user,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (!code || !user) {
      throw new ValidationError('invalid payload');
    }
    const doc = await dbRef.doc(user).collection('social').doc('instagram').get();

    if (doc.data() && doc.data().isLinked) throw new ValidationError('already linked');
    const {
      userId,
      displayName,
      fullName,
      url,
    } = await fetchInstagramUser(code, user);
    await dbRef.doc(user).collection('social').doc('instagram').set({
      accessToken: FieldValue.delete(),
      userId,
      displayName,
      fullName,
      url,
      isLinked: true,
      ts: Date.now(),
    }, { merge: true });
    res.json({
      platform: 'instagram',
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
      platform: 'instagram',
      user,
      email: email || undefined,
      displayName: userDisplayName,
      wallet,
      referrer: referrer || undefined,
      locale,
      instagramId: userId,
      instagramName: fullName,
      instagramUserName: displayName,
      instagramURL: url,
      registerTime: timestamp,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
