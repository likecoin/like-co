import {
  MIN_USER_ID_LENGTH,
  MAX_USER_ID_LENGTH,
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

export default checkUserNameValid;
