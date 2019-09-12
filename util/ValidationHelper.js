import {
  MIN_USER_ID_LENGTH,
  MAX_USER_ID_LENGTH,
} from '../constant';

export function checkUserNameValid(user) {
  return user && (/^[a-z0-9-_]+$/.test(user) && user.length >= MIN_USER_ID_LENGTH && user.length <= MAX_USER_ID_LENGTH);
}

export default checkUserNameValid;
