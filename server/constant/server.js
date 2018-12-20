import { TEST_MODE } from '../../constant';

export const AUTH_COOKIE_OPTION = {
  maxAge: 31556926000, // 365d
  domain: TEST_MODE ? undefined : '.like.co',
  secure: !TEST_MODE,
  httpOnly: true,
};

export const CSRF_COOKIE_OPTION = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

// TODO: duplicate with ../../constant.js
export const W3C_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
