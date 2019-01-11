export const CSRF_COOKIE_OPTION = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};
