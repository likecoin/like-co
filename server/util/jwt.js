const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const config = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies

let secret = config.JWT_SECRET;
if (!secret) {
  secret = process.env.NODE_ENV !== 'production' ? 'likecoin' : crypto.randomBytes(64).toString('hex').slice(0, 64);
}

export const jwtSign = payload => jwt.sign(payload, secret, { expiresIn: '7d' });

export const jwtVerify = token => jwt.verify(token, secret);

export const jwtAuth = function (req, res, next) {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  expressjwt({ secret })(req, res, (e) => {
    if (e && e.name === 'UnauthorizedError') {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    next(e);
  });
};

export default jwtAuth;
