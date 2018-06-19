import { Router } from 'express';
import cors from 'cors';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import xml from 'xml';
import { IS_TESTNET } from '../../constant';
import { ValidationError } from '../../util/ValidationHelper';

const hostname = IS_TESTNET ? 'rinkeby.like.co' : 'like.co';
const escapedHostname = hostname.replace(/\./g, '\\.');
const queryUrlRegexp = new RegExp(`^(?:https?:\\/\\/)?(?:www\\.)?${escapedHostname}\\/([-_a-z0-9]+)`);

const {
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

router.get('/oembed', cors(), async (req, res, next) => {
  try {
    const { url } = req.query;
    if (!url) {
      throw new ValidationError('No url query in oEmbed request');
    }
    const match = queryUrlRegexp.exec(url);
    if (!match) {
      throw new ValidationError(`Invalid url query (${url}) in oEmbed request`);
    }
    const username = match[1];
    const format = req.query.format || 'json';
    if (!['json', 'xml'].includes(format)) {
      throw new ValidationError(`Invalid format ${format} in oEmbed request`);
    }

    const maxWidth = Number.parseInt(req.query.maxwidth || 480, 10);
    const maxHeight = Number.parseInt(req.query.maxheight || 170, 10);
    const thumbnailLength = Math.min(100, maxWidth, maxHeight);

    const doc = await dbRef.doc(username).get();
    if (!doc.exists) {
      res.sendStatus(404);
      return;
    }
    const payload = doc.data();
    if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);

    const oEmbedResponse = {
      type: 'rich',
      version: '1.0',
      title: `${payload.displayName} (${username})`,
      url: `https://${hostname}/${username}`,
      thumbnail_url: payload.avatar,
      thumbnail_width: thumbnailLength,
      thumbnail_height: thumbnailLength,
      html: `<iframe width="${maxWidth}" height="${maxHeight}"
        src="https://${hostname}/in/embed/${username}"
        frameborder="0">
        </iframe>`,
      provider_name: 'LikeCoin',
      provider_url: `https://${hostname}`,
      width: maxWidth,
      height: maxHeight,
    };
    switch (format) {
      case 'json':
        res.json(oEmbedResponse);
        break;
      case 'xml': {
        res.set('Content-Type', 'text/xml');
        const xmlArray = Object.keys(oEmbedResponse).map(key => ({ [key]: oEmbedResponse[key] }));
        res.send(xml({ oembed: xmlArray }, { declaration: { encoding: 'utf-8', standalone: 'yes' } }));
        break;
      }
      default:
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
