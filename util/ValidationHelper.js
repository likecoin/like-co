import {
  MIN_USER_ID_LENGTH,
  MAX_USER_ID_LENGTH,
  REDIRECT_WHITE_LIST,
} from '../constant';

export function checkUserNameValid(user) {
  return user && (/^[a-z0-9-_]+$/.test(user) && user.length >= MIN_USER_ID_LENGTH && user.length <= MAX_USER_ID_LENGTH);
}

export function checkISCNIdValid(id) {
  return /^iscn:\/\/likecoin-chain\/[-_.:=+,a-zA-Z0-9]+(?:\/([0-9]+))?$/.test(id);
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function isValidRedirectUrl(redirect) {
  try {
    const redirectUrl = new URL(redirect);
    return REDIRECT_WHITE_LIST.includes(redirectUrl.hostname);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Invalid redirect URL:', error);
    return false;
  }
}

export default checkUserNameValid;
