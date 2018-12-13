import { Router } from 'express';
import { jwtAuth } from '../../util/jwt';
import { ValidationError } from '../../../util/ValidationHelper';

import { LINK_ICON_TYPES } from '../../../constant/index';
import { isValidSocialLink } from '../../../util/social';

const { userCollection: dbRef } = require('../../util/firebase');

const router = Router();

router.post('/social/links/new', jwtAuth('write'), async (req, res, next) => {
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
      iconType,
      siteDisplayName,
      url,
    } = link;
    if (
      !LINK_ICON_TYPES.includes(iconType)
      || !isValidSocialLink(url)
      || !siteDisplayName
      || typeof siteDisplayName !== 'string'
    ) {
      throw new ValidationError('incorrect link info');
    }
    const isExternalLink = true;
    const isPublic = true; // default

    // determine id of new link
    const col = await dbRef.doc(user).collection('social').get();
    const linkIds = [];
    col.docs.forEach(({ id }) => {
      const result = /link(\d+)/.exec(id);
      if (result) linkIds.push(parseInt(result[1], 10));
    });
    const currentMaxId = Math.max(...linkIds);
    const newId = `link${currentMaxId < 0 ? 0 : currentMaxId + 1}`;

    await dbRef.doc(user).collection('social').doc(newId).create({
      iconType,
      isExternalLink,
      isPublic,
      siteDisplayName,
      url,
    });

    const socialMeta = await dbRef.doc(user).collection('social').doc('meta').get();
    const updateSocialMetaObj = {
      externalLinkOrder: [newId],
    };
    let order = 0;
    if (socialMeta.exists && socialMeta.data().externalLinkOrder) {
      updateSocialMetaObj.externalLinkOrder = [
        ...socialMeta.data().externalLinkOrder,
        newId,
      ];
      order = socialMeta.data().externalLinkOrder.length;
    }
    await dbRef.doc(user).collection('social').doc('meta').set(updateSocialMetaObj, {
      merge: true,
    });

    res.json({
      iconType,
      id: newId,
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

router.put('/social/links/:linkId', jwtAuth('write'), async (req, res, next) => {
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
      iconType,
      siteDisplayName,
      url,
      order,
    } = link;

    const linkDoc = await dbRef.doc(user).collection('social').doc(linkId).get();
    if (!linkDoc.exists) throw new ValidationError('link unknown');

    const updateObj = {};
    if (iconType && LINK_ICON_TYPES.includes(iconType)) updateObj.iconType = iconType;
    if (siteDisplayName) updateObj.siteDisplayName = siteDisplayName;
    if (url && isValidSocialLink(url)) updateObj.url = url;
    if (order !== undefined) {
      const query = await dbRef.doc(user).collection('social').doc('meta').get();
      const { externalLinkOrder } = query.data();
      const oldOrder = externalLinkOrder.findIndex(id => id === linkId);
      externalLinkOrder.splice(oldOrder, 1);
      externalLinkOrder.splice(order, 0, linkId);
      await dbRef.doc(user).collection('social').doc('meta').set({
        externalLinkOrder,
      }, { merge: true });
    } else {
      await dbRef.doc(user).collection('social').doc(linkId).set(updateObj, { merge: true });
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});


export default router;
