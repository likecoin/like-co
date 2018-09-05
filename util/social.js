import parse from 'url-parse';

import { EMAIL_REGEX } from '../constant';

/* eslint-disable import/prefer-default-export */
export const isValidSocialLink = (link) => {
  let isValid = new RegExp(EMAIL_REGEX).test(link);
  if (!isValid) {
    try {
      if (process.client) {
        const url = new URL(link); // eslint-disable-line
        isValid = true;
      } else {
        const parsedLink = parse(link);
        if (parsedLink.protocol && parsedLink.host) isValid = true;
      }
    } catch (err) {
      // skip
    }
  }
  return isValid;
};
