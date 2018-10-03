import { TEST_MODE, EXTERNAL_HOSTNAME } from '../../constant';

const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const expressjwt = require('express-jwt');
const uuidv4 = require('uuid/v4');
const config = require('../config/config.js'); // eslint-disable-line import/no-extraneous-dependencies

const audience = EXTERNAL_HOSTNAME;
const issuer = EXTERNAL_HOSTNAME;

let algorithm = 'HS256';
let signSecret;
let verifySecret;
const publicCertPath = config.JWT_PUBLIC_CERT_PATH;
const secretCertPath = config.JWT_PRIVATE_KEY_PATH;
if (publicCertPath && secretCertPath) {
  try {
    verifySecret = fs.readFileSync(publicCertPath);
    signSecret = fs.readFileSync(secretCertPath);
    algorithm = 'RS256';
  } catch (err) {
    console.error(err);
    console.log('RSA key not exist for jwt');
  }
}
if (!signSecret || !verifySecret) {
  const secret = TEST_MODE ? 'likecoin' : crypto.randomBytes(64).toString('hex').slice(0, 64);
  signSecret = secret;
  verifySecret = secret;
}

export function getToken(req) {
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
  const opt = { audience, issuer, algorithm };
  if (!payload.exp) opt.expiresIn = '30d';
  const jwtid = uuidv4();
  opt.jwtid = jwtid;
  return { token: jwt.sign(payload, signSecret, opt), jwtid };
};

export const jwtVerify = (
  token,
  { ignoreExpiration } = {},
) => {
  const opt = { audience, issuer };
  return jwt.verify(token, verifySecret, { ...opt, ignoreExpiration });
};

export const jwtAuth = (permission = 'read') => (req, res, next) => {
  setNoCacheHeader(res);
  expressjwt({
    secret: verifySecret,
    getToken,
    audience,
    issuer,
  })(req, res, (e) => {
    if (e && e.name === 'UnauthorizedError') {
      res.status(401).send('LOGIN_NEEDED');
      return;
    }
    if (!req.user
      || !req.user.permissions
      || (permission && !req.user.permissions.includes(permission))) {
      res.status(401).send('MORE_AUTH_NEEDED');
      return;
    }
    next(e);
  });
};

export const jwtOptionalAuth = (permission = 'read') => (req, res, next) => {
  setNoCacheHeader(res);
  expressjwt({
    credentialsRequired: false,
    secret: verifySecret,
    getToken,
    audience,
    issuer,
  })(req, res, (e) => {
    if (req.user
      && req.user.permissions
      && (permission && !req.user.permissions.includes(permission))) {
      req.user = undefined;
    }
    next(e);
  });
};

export default jwtAuth;
