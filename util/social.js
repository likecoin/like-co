import parse from 'url-parse';

import { EMAIL_REGEX } from '../constant';

const hasHttp = link => /https?:\/\//.test(link);
export const getUrlWithPrefix = link => (hasHttp(link) ? link : `https://${link}`);

export const isValidSocialLink = (link) => {
  let isValid = new RegExp(EMAIL_REGEX).test(link);
  if (!isValid) {
    try {
      let url = getUrlWithPrefix(link);
      if (process.client) {
        url = new URL(getUrlWithPrefix(link));
        isValid = true;
      } else {
        const parsedLink = parse(url);
        if (parsedLink.protocol && parsedLink.host) isValid = true;
      }
    } catch (err) {
      // skip
    }
  }
  return isValid;
};
