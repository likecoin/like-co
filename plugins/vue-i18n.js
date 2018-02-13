import Vue from 'vue';
import VueI18n from 'vue-i18n';

import messages from '../locales';

Vue.use(VueI18n);

// Example: https://nuxtjs.org/examples/i18n

export default ({ app }) => {
  // Set i18n instance on app to use it in middleware and pages asyncData/fetch
  /* eslint-disable no-param-reassign */
  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
  });
};
