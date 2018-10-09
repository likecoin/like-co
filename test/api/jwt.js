const jwt = require('jsonwebtoken');

function jwtSign({
  user,
  wallet,
  permissions = ['read', 'write', 'like'],
}) {
  return jwt.sign({
    user,
    wallet,
    permissions,
  }, 'likecoin', {
    audience: 'rinkeby.like.co',
    issuer: 'rinkeby.like.co',
    expiresIn: '7d',
  });
}

module.exports = { jwtSign };
