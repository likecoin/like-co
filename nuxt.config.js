/* istanbul ignore file */
/* eslint import/no-extraneous-dependencies: "off" */

const path = require('path');
const { LIKE_CO_PLATFORMS } = require('./constant');

const nuxtConfig = {
  /*
  ** Headers of the page
  */
  env: {
    IS_TESTNET: process.env.IS_TESTNET,
    CI: process.env.CI,
    INTERCOM_APPID: process.env.INTERCOM_APPID,
    SENTRY_DSN: process.env.SENTRY_DSN,
    EXTERNAL_HOSTNAME: process.env.EXTERNAL_HOSTNAME,
    CRISP_WEBSITE_ID: process.env.CRISP_WEBSITE_ID,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
  },
  head: {
    titleTemplate: (titleChunk) => {
      const title = 'LikeCoin - Decentralize Publishing';
      return (titleChunk
        ? `${titleChunk} - ${title}` : title);
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { 'http-equiv': 'cache-control', content: 'no-cache' },
      { hid: 'description', name: 'description', content: 'Decentralize Publishing. Own your content forever.' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin - Decentralize Publishing' },
      { hid: 'og_description', property: 'og:description', content: 'Decentralize Publishing. Own your content forever.' },
      { hid: 'og_image', property: 'og:image', content: 'https://like.co/images/og/default.png' },
      { hid: 'og_image_alt', property: 'og:image:alt', content: 'LikeCoin' },
      { hid: 'og_image_width', property: 'og:image:width', content: '1200' },
      { hid: 'og_image_height', property: 'og:image:height', content: '630' },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
    ],
    script: [
      {
        hid: 'schema',
        innerHTML: JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'LikeCoin',
            url: 'https://like.co/',
          }, {
            '@context': 'http://www.schema.org',
            '@type': 'Project',
            name: 'LikeCoin',
            url: 'https://like.co',
            logo: 'https://like.co/logo.png',
            sameAs: LIKE_CO_PLATFORMS.map(s => s.url),
          }]),
        type: 'application/ld+json',
      },
    ],
    link: [
      { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Material+Icons', as: 'style' },
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Material+Icons' },
    ],
    __dangerouslyDisableSanitizersByTagID: { schema: ['innerHTML'] },
  },
  /*
   ** Custom loading component
   */
  loading: '~/components/BlockProgress.vue',

  render: {
    csp: {
      enabled: true,
      unsafeInlineCompatibility: true,
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'script-src': [
          "'self'",
          /* gtm inline code */
          "'sha256-X3ZM8SMe34uV9LglkNh69UN/Vkuo+blzT0E7mN1rUnQ='",
          "'sha256-2xBjy9xHKMthpdhRq5DplVZ7EkoWxMla4wyUmB1jyFY='",
          "'unsafe-inline'", // ignored by browser with sha support
          "'unsafe-eval'",
          'www.google-analytics.com',
          'www.googletagmanager.com',
          'www.googleadservices.com',
          '*.google.com',
          'www.gstatic.com',
          'www.gstatic.cn',
          'googleads.g.doubleclick.net',
          'ajax.googleapis.com',
          '*.crisp.chat',
          'cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
        ],
        'frame-src': [
          'www.google.com',
          '*.doubleclick.net',
          '*.like.co',
          'like.co',
          'likecoin-integration-test.authcore.io',
          'likecoin.substack.com',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',
          'wss://client.relay.crisp.chat',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'fonts.googleapis.com',
          'client.crisp.chat',
          'use.fontawesome.com',
        ],
      },
    },
  },

  router: {
    middleware: 'sliding-menu',
    extendRoutes(routes, resolve) {
      routes.push({
        path: '/verify/:uuid/:coupon',
        name: 'verify-uuid-coupon',
        component: resolve(__dirname, 'pages/verify/_uuid/index.vue'),
      });
      routes.push({
        name: 'id-amount',
        path: '/:id/:amount?',
        component: resolve(__dirname, 'pages/_id/index.vue'),
      });
      routes.push({
        name: 'in-embed-id-amount',
        path: '/in/embed/:id/:amount?',
        component: resolve(__dirname, 'pages/in/embed/_id/index.vue'),
      });
      routes.push({
        name: 'in-embed-id-button-amount',
        path: '/in/embed/:id/button/:amount?',
        component: resolve(__dirname, 'pages/in/embed/_id/button.vue'),
      });
    },
  },
  /*
  ** Global CSS
  */
  css: [
    { src: 'vue-material/dist/vue-material.min.css', lang: 'css' },
    { src: '@likecoin/ui-vue/dist/ui-vue.css', lang: 'css' },
    { src: '~/assets/theme.scss', lang: 'scss' }, // include vue-material theme engine
    { src: '~/assets/index.scss', lang: 'scss' },
    '~/assets/css/main.css',
    '@likecoin/wallet-connector/dist/style.css',
  ],
  modules: [
    '@nuxtjs/sentry',
    '@nuxtjs/sitemap',
  ],
  plugins: [
    { src: '~/plugins/polyfill', ssr: false },
    { src: '~/plugins/cosmosWallet.client.js', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/gtag.client.js', ssr: false },
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/likecoin-ui-vue' },
    { src: '~/plugins/vue-simple-svg' },
    { src: '~/plugins/vue-image-lightbox', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
    { src: '~/plugins/vue-portal', ssr: false },
    { src: '~/plugins/vue-scroll-reveal', ssr: false },
    { src: '~/plugins/vue-scroll', ssr: false },
    { src: '~/plugins/vue-js-modal' },
    { src: '~/plugins/gsap.client.js', ssr: false },
    { src: '~/plugins/AuthCore.client.js', ssr: false },
    { src: '~/plugins/crisp.client.js', ssr: false },
    { src: '~/plugins/testing' },
  ],
  sentry: {
    clientIntegrations: {
      /* default integrations will still be added due to deep-merge */
      ReportingObserver: false, // reporting is very noisy on CSP violation.
    },
    config: {
      release: process.env.RELEASE,
    },
  },
  /*
  ** Add axios globally
  */
  build: {
    transpile: [
      '@likecoin/wallet-connector',
      '@walletconnect',
      'unstorage',
      ({ isLegacy }) => (isLegacy ? 'axios' : undefined),
    ],
    extractCSS: true,
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '18' }
              : { browsers: 'ie 11, > 0.5%, Firefox ESR' },
          },
        ],
      ],
    },
    extend(config, { isClient }) {
      /* eslint-disable no-param-reassign */
      // https://github.com/ethereum/web3.js/issues/1178
      if (process.env.NODE_ENV === 'production') {
        config.resolve.alias['bn.js'] = path.join(__dirname, './node_modules/bn.js');
        config.resolve.alias['bignumber.js'] = path.join(__dirname, './node_modules/bignumber.js');
      }

      if (isClient) {
        if (process.env.NODE_ENV === 'production') {
          config.devtool = 'source-map';
        }
        /*
        ** Run ESLINT on save
        */
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
      /* eslint-enable no-param-reassign */
    },
  },
};

module.exports = nuxtConfig;
