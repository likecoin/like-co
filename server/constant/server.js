/* eslint-disable import/prefer-default-export */

export const CSRF_COOKIE_OPTION = {
  httpOnly: true,
  secure: process.env.CI || process.env.NODE_ENV === 'production',
};
