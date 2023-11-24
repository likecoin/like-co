/* eslint-disable no-param-reassign */

/* patch md4 hash to md5 in node 17+ */
const crypto = require('crypto');

const c = crypto.createHash;
crypto.createHash = (algorithm, options) => c(algorithm === 'md4' ? 'md5' : algorithm, options);
/* patch end */

module.exports = {
  webpack: (config, options, webpack) => { // eslint-disable-line no-unused-vars
    config.entry.main = './server/index.js';
    config.externals = [config.externals];
    config.externals.push((ctx, request, callback) => {
      if (/^(\.\.\/)+config/.test(request)) {
        const res = request.replace(/^(\.\.\/)+config/, '../server/config');
        return callback(null, res);
      }
      return callback();
    });
    const babelRule = config.module.rules.find(r => r.options.cacheDirectory);
    if (babelRule) babelRule.options.cacheDirectory = false;
    return config;
  },
};
