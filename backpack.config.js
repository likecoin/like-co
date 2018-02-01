/* eslint-disable no-param-reassign */

module.exports = {
  webpack: (config, options, webpack) => { // eslint-disable-line no-unused-vars
    config.entry.main = './server/index.js';
    config.externals = [config.externals];
    config.externals.push((ctx, request, callback) => {
      if (/^@ServerConfig\//.test(request)) {
        const res = request.replace('@ServerConfig', '../server/config');
        return callback(null, res);
      }
      return callback();
    });
    return config;
  },
};
