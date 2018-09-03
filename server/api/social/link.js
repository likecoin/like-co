import { Router } from 'express';
import { jwtAuth } from '../../util/jwt';
import { ValidationError } from '../../../util/ValidationHelper';

const { userCollection: dbRef } = require('../../util/firebase');

const router = Router();

router.post('/social/links/new', jwtAuth, async (req, res, next) => {
  try {
    const {
      user,
      link,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const {
      id,
      siteDisplayName,
      order,
      url,
    } = link;
    const isExternalLink = true;
    const isPublic = true; // default

    const linkDoc = await dbRef.doc(user).collection('social').doc(id).get();
    if (linkDoc.exists) throw new ValidationError('link already exists');

    await dbRef.doc(user).collection('social').doc(id).create({
      isExternalLink,
      isPublic,
      order,
      siteDisplayName,
      url,
    });

    res.json({
      id,
      isExternalLink,
      isPublic,
      order,
      siteDisplayName,
      url,
    });
  } catch (err) {
    next(err);
  }
});

router.put('/social/links/:linkId', jwtAuth, async (req, res, next) => {
  try {
    const {
      user,
      link,
    } = req.body;
    if (req.user.user !== user) {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }

    const { linkId } = req.params;
    const {
      siteDisplayName,
      url,
      order,
    } = link;

    const linkDoc = await dbRef.doc(user).collection('social').doc(linkId).get();
    if (!linkDoc.exists) throw new ValidationError('link unknown');

    const promises = [];

    const updateObj = {};
    if (siteDisplayName) updateObj.siteDisplayName = siteDisplayName;
    if (url) updateObj.url = url;
    if (order) {
      updateObj.order = order;

      const oldOrder = linkDoc.data().order;
      let query;
      let orderOffset;
      if (oldOrder > order) {
        query = await dbRef.doc(user).collection('social')
          .where('order', '>=', order)
          .where('order', '<', oldOrder)
          .get();
        orderOffset = 1;
      } else if (oldOrder < order) {
        query = await dbRef.doc(user).collection('social')
          .where('order', '>', oldOrder)
          .where('order', '<=', order)
          .get();
        orderOffset = -1;
      }
      query.docs.forEach((l) => {
        promises.push(dbRef.doc(user).collection('social').doc(l.id).update({
          order: l.data().order + orderOffset,
        }));
      });
    }
    promises.push(dbRef.doc(user).collection('social').doc(linkId).set(updateObj, { merge: true }));
    await Promise.all(promises);

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});


export default router;
