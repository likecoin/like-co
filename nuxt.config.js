/* istanbul ignore file */
/* eslint import/no-extraneous-dependencies: "off" */

const path = require('path');
const SentryPlugin = require('@sentry/webpack-plugin');
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
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  },
  head: {
    title: 'LikeCoin - Reinventing the Like',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'With our unique LikeRank algorithm and decentralized Like button, we trace content footprint and reward all creators involved. This is called Proof of Creativity.' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin - Reinventing the Like' },
      { hid: 'og_description', property: 'og:description', content: 'With our unique LikeRank algorithm and decentralized Like button, we trace content footprint and reward all creators involved. This is called Proof of Creativity.' },
      { hid: 'og_image', property: 'og:image', content: 'https://like.co/images/og/default.png' },
      { hid: 'og_image_alt', property: 'og:image:alt', content: 'LikeCoin' },
      { hid: 'og_image_width', property: 'og:image:width', content: '1200' },
      { hid: 'og_image_height', property: 'og:image:height', content: '630' },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
    ],
    script: [
      {
        hid: 'schema',
        innerHTML: JSON.stringify({
          '@context': 'http://www.schema.org',
          '@type': 'Organization',
          name: 'LikeCoin Foundation',
          url: 'https://like.co',
          logo: 'https://like.co/logo.png',
          sameAs: LIKE_CO_PLATFORMS.map(s => s.url),
        }),
        type: 'application/ld+json',
      },
      { src: '/vendor/typekit.js' },
      { src: '/vendor/fb/pixel.js' },
      { src: '/vendor/fb/sdk.js' },
    ],
    link: [
      { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Material+Icons', as: 'style' },
      { rel: 'preload', href: '/vendor/typekit.js', as: 'script' },
      { rel: 'preload', href: '/vendor/fb/pixel.js', as: 'script' },
      { rel: 'preload', href: '/vendor/fb/sdk.js', as: 'script' },
      { rel: 'preload', href: 'https://use.typekit.net/ube6iww.js', as: 'script' },
      // {
      //   rel: 'preload',
      //   href: '/api/experiments/list',
      //   as: 'fetch',
      //   crossorigin: 'anonymous',
      // },
      { rel: 'preconnect', href: 'https://connect.facebook.net' },
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
          'www.google-analytics.com',
          'www.googletagmanager.com',
          'www.googleadservices.com',
          '*.google.com',
          'www.gstatic.com',
          'www.gstatic.cn',
          'googleads.g.doubleclick.net',
          'cdn.mouseflow.com',
          'ajax.googleapis.com',
          'js.intercomcdn.com',
          'connect.facebook.net',
          'player.vimeo.com',
          'use.typekit.net',
          '*.intercom.io',
        ],
        'frame-src': [
          'www.google.com',
          'player.vimeo.com',
          '*.facebook.com',
          '*.facebook.net',
          '*.doubleclick.net',
          '*.like.co',
          'like.co',
        ],
        'connect-src': [
          "'self'",
          'data:',
          '*',
          'wss://*.intercom.io',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'fonts.googleapis.com',
        ],
        'report-uri': [
          process.env.SENTRY_REPORT_URI,
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
        name: 'id-eth-amount',
        path: '/:id/eth/:amount?',
        component: resolve(__dirname, 'pages/_id/index.vue'),
      });
      routes.push({
        name: 'id-eth',
        path: '/:id/eth',
        component: resolve(__dirname, 'pages/_id/index.vue'),
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
      routes.push({
        name: 'pay-merchantId-amount',
        path: '/pay/:merchantId/:amount?',
        component: resolve(__dirname, 'pages/pay/_merchantId/index.vue'),
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
    'swiper/dist/css/swiper.min.css',
    '~/assets/css/main.css',
  ],
  modules: [
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GTM_ID || 'GTM-XXXXXXX',
      pageTracking: true,
      respectDoNotTrack: true,
    }],
    '@nuxtjs/sentry',
    // '@likecoin/nuxt-google-optimize',
  ],
  // googleOptimize: {
  //   externalExperimentsSrc: '/api/experiments/list',
  //   cookieDomain: process.env.NODE_ENV === 'production'
  //     ? `${process.env.IS_TESTNET ? '.rinkeby' : ''}.like.co`
  //     : '',
  //   useFetch: true,
  // },
  plugins: [
    { src: '~/plugins/polyfill', ssr: false },
    { src: '~/plugins/EthHelper', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/likecoin-ui-vue' },
    { src: '~/plugins/vue-simple-svg' },
    { src: '~/plugins/vue-intercom', ssr: false },
    { src: '~/plugins/vue-image-lightbox', ssr: false },
    { src: '~/plugins/vue-swiper', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
    { src: '~/plugins/vue-portal', ssr: false },
    { src: '~/plugins/vue-scroll-reveal', ssr: false },
    { src: '~/plugins/vue-scroll', ssr: false },
    { src: '~/plugins/testing' },
  ],
  /*
  ** Add axios globally
  */
  build: {
    cache: process.env.NODE_ENV === 'production',
    hardSource: !!process.env.CI || (process.env.NODE_ENV !== 'production'),
    extractCSS: true,
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxt/babel-preset-app',
          {
            targets: isServer
              ? { node: '10' }
              : 'ie 11, > 0.5%, Firefox ESR',
          },
        ],
      ],
    },
    extend(config, { isClient }) {
      /* eslint-disable no-param-reassign */
      // https://github.com/ethereum/web3.js/issues/1178
      if (process.env.NODE_ENV === 'production') {
        config.resolve.alias['bn.js'] = path.join(__dirname, './node_modules/bn.js');
      }

      if (process.env.RELEASE && process.env.SENTRY_AUTH_TOKEN) {
        config.plugins.push(new SentryPlugin({
          release: process.env.RELEASE,
          include: ['.nuxt/dist'],
          ignore: ['node_modules', '.nuxt/dist/server-bundle.json', '.nuxt/dist/img', '.nuxt/dist'],
          configFile: '.sentryclirc',
        }));
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

if (process.env.INTERCOM_APPID) {
  nuxtConfig.head.link.push(
    { rel: 'preload', href: `https://widget.intercom.io/widget/${process.env.INTERCOM_APPID}`, as: 'script' },
  );
}

module.exports = nuxtConfig;
