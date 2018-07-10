import { Router } from 'express';
import cors from 'cors';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import xml from 'xml';
import { EXTERNAL_HOSTNAME } from '../../constant';
import { ValidationError } from '../../util/ValidationHelper';

const subdomain = ['www.', 'rinkeby.', 'button.', 'button.rinkeby.'];
const queryUrlRegexp = new RegExp('^(?:https?:\\/\\/)?([a-z0-9.]+)?like\\.co\\/([-_a-z0-9]+)(?:/([0-9]+)?)?');

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
    if (match[1] && !subdomain.includes(match[1])) {
      throw new ValidationError(`Invalid subdomain (${url}) in oEmbed request`);
    }
    const isButton = match[1] && match[1].includes('button');
    const username = match[2];
    const format = req.query.format || 'json';
    if (!['json', 'xml'].includes(format)) {
      throw new ValidationError(`Invalid format ${format} in oEmbed request`);
    }
    const amount = match[3] || '';

    const maxWidth = Number.parseInt(req.query.maxwidth || 500, 10);
    const maxHeight = Number.parseInt(req.query.maxheight || 200, 10);
    const thumbnailLength = Math.min(100, maxWidth, maxHeight);

    const doc = await dbRef.doc(username).get();
    if (!doc.exists) {
      res.sendStatus(404);
      return;
    }
    const payload = doc.data();
    if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);

    const urlHostname = `${match[1] || ''}like.co`;
    let replyUrl = `https://${urlHostname}/${username}`;
    if (amount) replyUrl += `/${amount}`;

    const oEmbedResponse = {
      type: 'rich',
      version: '1.0',
      title: `${payload.displayName} (${username})`,
      url: replyUrl,
      thumbnail_url: payload.avatar,
      thumbnail_width: thumbnailLength,
      thumbnail_height: thumbnailLength,
      html: `<iframe width="${maxWidth}" height="${maxHeight}"
        src="https://${EXTERNAL_HOSTNAME}/in/embed/${username}/${isButton ? 'button' : amount}"
        frameborder="0">
        </iframe>`,
      provider_name: 'LikeCoin',
      provider_url: `https://${EXTERNAL_HOSTNAME}`,
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
