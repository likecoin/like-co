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
    FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID,
    CRISP_WEBSITE_ID: process.env.CRISP_WEBSITE_ID,
  },
  head: {
    title: 'LikeCoin - the content protocol',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'LikeCoin is a public blockchain for content monetization, attribution and distribution.' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin - the content protocol' },
      { hid: 'og_description', property: 'og:description', content: 'LikeCoin is a public blockchain for content monetization, attribution and distribution.' },
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
      { src: '/vendor/typekit.js', async: true },
      { src: '/vendor/fb/sdk.js', async: true, defer: true },
    ],
    link: [
      { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Material+Icons', as: 'style' },
      { rel: 'preload', href: '/vendor/typekit.js', as: 'script' },
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
          'js.intercomcdn.com',
          '*.crisp.chat',
          'connect.facebook.net',
          'player.vimeo.com',
          'use.typekit.net',
          'cdnjs.cloudflare.com',
          'partners.liquid.com',
        ],
        'frame-src': [
          'www.google.com',
          'player.vimeo.com',
          '*.facebook.com',
          '*.facebook.net',
          '*.doubleclick.net',
          '*.like.co',
          'like.co',
          'likecoin-integration-test.authcore.io',
          'likecoin.substack.com',
          'plugin.partners.liquid.com',
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
  //   // externalExperimentsSrc: '/api/experiments/list',
  //   // cookieDomain: process.env.NODE_ENV === 'production'
  //   //   ? `${process.env.IS_TESTNET ? '.rinkeby' : ''}.like.co`
  //   //   : '',
  //   useFetch: false,
  //   maxAge: 60 * 60,
  // },
  plugins: [
    { src: '~/plugins/polyfill', ssr: false },
    { src: '~/plugins/EthHelper', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/likecoin-ui-vue' },
    { src: '~/plugins/vue-simple-svg' },
    { src: '~/plugins/vue-image-lightbox', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
    { src: '~/plugins/vue-portal', ssr: false },
    { src: '~/plugins/vue-scroll-reveal', ssr: false },
    { src: '~/plugins/vue-scroll', ssr: false },
    { src: '~/plugins/gsap.client.js', ssr: false },
    { src: '~/plugins/AuthCore.client.js', ssr: false },
    { src: '~/plugins/fbpixel.client.js', ssr: false },
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
      include: ['.nuxt/dist'],
      ignore: ['node_modules', '.nuxt/dist/server-bundle.json', '.nuxt/dist/img', '.nuxt/dist'],
      configFile: '.sentryclirc',
    },
  },
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
