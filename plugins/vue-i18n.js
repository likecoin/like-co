import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';

import messages from '../locales';

Vue.use(VueI18n);

// Example: https://nuxtjs.org/examples/i18n

export default ({ app, store }) => {
  // Set i18n instance on app to use it in middleware and pages asyncData/fetch
  /* eslint-disable no-param-reassign */
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  });
  store.dispatch('setLocale', 'en');
};
