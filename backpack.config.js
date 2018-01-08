module.exports = {
  webpack: (config, options, webpack) => { // eslint-disable-line no-unused-vars
    config.entry.main = './server/index.js'; // eslint-disable-line no-param-reassign
    return config;
  },
};
