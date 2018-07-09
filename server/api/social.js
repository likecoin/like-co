import { Router } from 'express';

import axios from '../../plugins/axios';
import { PUBSUB_TOPIC_MISC } from '../../constant';
import publisher from '../util/gcloudPub';
import { jwtAuth } from '../util/jwt';
import { ValidationHelper as Validate, ValidationError } from '../../util/ValidationHelper';

const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
} = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

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

router.post('/social/link/facebook', jwtAuth, async (req, res, next) => {
  try {
    const {
      access_token: accessToken,
      user,
    } = req.body;
    if (!accessToken || !user) {
      throw new ValidationError('invalid payload');
    }
    if (!FACEBOOK_APP_ID || !FACEBOOK_APP_SECRET) throw new Error('facebook app not configured');
    let { data } = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=client_credentials`);
    const { access_token: appToken } = data;
    ({ data } = await axios.get(`https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appToken}`));
    if (!data || !data.data || !data.data.is_valid) throw new Error('invalid fb token');
    const { user_id: userId, app_id: appId } = data.data;
    ({ data } = await axios.get(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,link`));
    const { name: displayName, link } = data;
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
