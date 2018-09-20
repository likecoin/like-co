import { TEST_MODE, EXTERNAL_HOSTNAME } from '../../constant';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const config = require('../config/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const audience = EXTERNAL_HOSTNAME;
const issuer = EXTERNAL_HOSTNAME;

let secret = config.JWT_SECRET;
if (!secret) {
  secret = TEST_MODE ? 'likecoin' : crypto.randomBytes(64).toString('hex').slice(0, 64);
}

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies.likecoin_auth) {
    return req.cookies.likecoin_auth;
  }
  return '';
}

function setNoCacheHeader(res) {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate',
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

export const jwtSign = (payload) => {
  const opt = { audience, issuer };
  if (!payload.exp) opt.expiresIn = '30d';
  return jwt.sign(payload, secret, opt);
};

export const jwtVerify = (
  token,
  { ignoreExpiration } = {},
) => {
  const opt = { audience, issuer };
  return jwt.verify(token, secret, { ...opt, ignoreExpiration });
};

export const jwtAuth = (req, res, next) => {
  setNoCacheHeader(res);
  expressjwt({
    secret,
    getToken,
    audience,
    issuer,
  })(req, res, (e) => {
    if (e && e.name === 'UnauthorizedError') {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    next(e);
  });
};

export const jwtOptionalAuth = (req, res, next) => {
  setNoCacheHeader(res);
  expressjwt({
    credentialsRequired: false,
    secret,
    getToken,
    audience,
    issuer,
  })(req, res, (e) => {
    next(e);
  });
};

export default jwtAuth;
