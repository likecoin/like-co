import { Router } from 'express';
import { toDataUrl } from '@likecoin/ethereum-blockies';
import xml from 'xml';
import { IS_TESTNET } from '../../constant';

const hostname = IS_TESTNET ? 'rinkeby.like.co' : 'like.co';
const escapedHostname = hostname.replace(/\./g, '\\.');
const queryUrlRegexp = new RegExp(`^(?:https?:\\/\\/)?(?:www\\.)?${escapedHostname}\\/([-_a-z0-9]+)`);

const {
  userCollection: dbRef,
} = require('../util/firebase');

const router = Router();

router.get('/oembed', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      throw new Error('No url query in oEmbed request');
    }
    const match = queryUrlRegexp.exec(url);
    if (!match) {
      throw new Error(`Invalid url query (${url}) in oEmbed request`);
    }
    const username = match[1];
    const format = req.query.format || 'json';
    if (!['json', 'xml'].includes(format)) {
      throw new Error(`Invalid format ${format} in oEmbed request`);
    }

    const maxWidth = Number.parseInt(req.query.maxwidth || 100, 10);
    const maxHeight = Number.parseInt(req.query.maxheight || 100, 10);
    const thumbnailLength = Math.min(100, maxWidth, maxHeight);

    const doc = await dbRef.doc(username).get();
    if (!doc.exists) {
      res.sendStatus(404);
      return;
    }
    const payload = doc.data();
    if (!payload.avatar) payload.avatar = toDataUrl(payload.wallet);

    const oEmbedResponse = {
      type: 'link',
      version: '1.0',
      title: `${payload.displayName} (${username})`,
      url: `https://${hostname}/${username}`,
      thumbnail_url: payload.avatar,
      thumbnail_width: thumbnailLength,
      thumbnail_height: thumbnailLength,
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
    const msg = err.message || err;
    console.error(msg);
    res.status(400).send(msg);
  }
});

export default router;
