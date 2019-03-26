/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueI18n from 'vue-i18n';
import axios from './axios';

import { defaultLocale, defaultMessage, supportedLocales } from '../locales';

Vue.use(VueI18n);

const setI18nLanguage = (i18n, lang) => {
  i18n.locale = lang;
  axios.defaults.headers.common['Accept-Language'] = lang;
  return lang;
};

async function loadLanguageAsync(i18n, lang) {
  if (!i18n.loadedLanguages) {
    i18n.loadedLanguages = [defaultLocale];
  }
  if (!i18n.loadedLanguages.includes(lang)) {
    const msgs = await import(/* webpackChunkName: "lang-[request]" */ `@/locales/client/${lang}`);
    i18n.setLocaleMessage(lang, msgs);
    i18n.loadedLanguages.push(lang);
  }
  return setI18nLanguage(i18n, lang);
}

export default async ({
  app,
  store,
  req,
  res,
  query,
}) => {
  // Set i18n instance on app to use it in middleware and pages asyncData/fetch
  /* eslint-disable no-param-reassign */
  let locale = defaultLocale;
  if (!process.server) {
    let userLocale;
    if (store.state.user.user) {
      ({ locale: userLocale } = store.state.user.user);
    }
    let navLang = (
      navigator.language
      || (navigator.languages && navigator.languages[0])
      || defaultLocale
    );
    // TODO: iterate through navigator.languages to find locale
    navLang = navLang.toLowerCase();
    supportedLocales.forEach((key) => {
      if (navLang.includes(key)) {
        navLang = key;
      }
    });
    locale = (
      userLocale
      || query.language
      || (window.localStorage && window.localStorage.language)
      || navLang
      || defaultLocale
    );
    if (!supportedLocales.includes(locale)) locale = defaultLocale;
  } else if (req) {
    locale = (
      query.language
      || req.cookies.language
      || req.acceptsLanguages(supportedLocales)
      || defaultLocale
    );
    if (!supportedLocales.includes(locale)) locale = defaultLocale;
    /* 77760000000 = 30d */
    if (req.cookies && req.cookies.language !== locale) {
      res.cookie('language', locale, { maxAge: 77760000000, secure: true });
    }
  }
  app.i18n = new VueI18n({
    locale,
    fallbackLocale: defaultLocale,
    messages: defaultMessage,
  });
  app.i18n.loadLanguageAsync = lang => loadLanguageAsync(app.i18n, lang);
  await app.i18n.loadLanguageAsync(locale);

  store.dispatch('setLocale', locale);
};
