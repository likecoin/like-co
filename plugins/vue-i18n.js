import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';

import messages from '../locales';

Vue.use(VueI18n);

// Example: https://nuxtjs.org/examples/i18n

export default ({ app, store, req }) => {
  // Set i18n instance on app to use it in middleware and pages asyncData/fetch
  /* eslint-disable no-param-reassign */
  const fallbackLocale = 'en';
  let locale = fallbackLocale;
  if (!process.server) {
    let navLang = navigator.language
    || (navigator.languages && navigator.languages[0]) || fallbackLocale;
    // TODO: iterate through navigator.languages to find locale
    navLang = navLang.toLowerCase();
    Object.keys(messages).forEach((key) => {
      if (navLang.includes(key)) {
        navLang = key;
      }
    });
    locale = window.localStorage.language || navLang;
  } else if (req) {
    locale = req.acceptsLanguages(Object.keys(messages)) || fallbackLocale;
  }
  app.i18n = new VueI18n({
    locale,
    fallbackLocale,
    messages,
  });
  store.dispatch('setLocale', locale);
};
