import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

if (process.env.CRISP_WEBSITE_ID) {
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = process.env.CRISP_WEBSITE_ID;
  const crisp = {
    is: (...args) => window.$crisp.is(...args),
    get: (...args) => window.$crisp.get(...args),
    push: (...args) => window.$crisp.push(...args),
    help: (...args) => window.$crisp.help(...args),
  };

  const d = document;
  const s = d.createElement('script');
  s.src = 'https://client.crisp.chat/l.js';
  s.async = 1;
  d.getElementsByTagName('head')[0].appendChild(s);

  Vue.prototype.$crisp = crisp;
}
