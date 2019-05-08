export const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.CI;

export const CSRF_COOKIE_OPTION = {
  httpOnly: true,
  secure: !TEST_MODE,
  sameSite: true,
};
