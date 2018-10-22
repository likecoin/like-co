/* eslint import/no-extraneous-dependencies: "off" */
const webpack = require('webpack');
const SentryPlugin = require('@sentry/webpack-plugin');

const shouldCache = !!process.env.CI;

/* istanbul ignore next */
module.exports = {
  /*
  ** Headers of the page
  */
  env: {
    IS_TESTNET: process.env.IS_TESTNET,
    INTERCOM_APPID: process.env.INTERCOM_APPID,
    STRIPE_TOKEN: process.env.STRIPE_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
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
      { src: 'https://use.typekit.net/ube6iww.js' },
      { src: '/vendor/typekit.js' },
      { src: '/vendor/fb/pixel.js' },
      { src: '/vendor/fb/sdk.js' },
      { src: 'https://www.recaptcha.net/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,600|Material+Icons' },
    ],
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
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          /* gtm inline code */
          "'sha256-X3ZM8SMe34uV9LglkNh69UN/Vkuo+blzT0E7mN1rUnQ='",
          "'sha256-2xBjy9xHKMthpdhRq5DplVZ7EkoWxMla4wyUmB1jyFY='",
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'https://www.googleadservices.com',
          'https://*.google.com',
          'https://recaptcha.net',
          'https://www.recaptcha.net',
          'https://www.gstatic.com/',
          'https://www.gstatic.cn/',
          'https://googleads.g.doubleclick.net',
          'https://cdn.mouseflow.com',
          'https://ajax.googleapis.com',
          'https://js.intercomcdn.com',
          'https://widget.intercom.io',
          'https://checkout.stripe.com',
          'https://connect.facebook.net',
          'https://player.vimeo.com',
          'https://use.typekit.net',
          'https://*.intercom.io',
        ],
        'font-src': [
          "'self'",
          'data:',
          'https://fonts.gstatic.com',
          'https://fonts.googleapis.com',
          'https://use.typekit.net',
          'https://js.intercomcdn.com',
        ],
        'frame-src': [
          'https://www.google.com/',
          'https://recaptcha.net',
          'https://www.recaptcha.net',
          'https://player.vimeo.com/',
          'https://*.facebook.com',
          'https://*.facebook.net',
          'https://checkout.stripe.com/',
          'https://*.doubleclick.net',
          'https://rinkeby.like.co',
          'https://like.co',
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          '*',
        ],
        'media-src': [
          'https://*.intercomcdn.com',
          'https://*.gstatic.com',
          'https://*.gstatic.cn',
          'https://video.appledaily.com.hk',
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
          'https://fonts.googleapis.com',
        ],
        'worker-src': [
          "'self'",
          'blob:',
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
      routes.unshift({
        name: 'in-free',
        path: '/in/free',
        component: resolve(__dirname, 'pages/in/redeem.vue'),
      });
    },
  },
  /*
  ** Global CSS
  */
  css: [
    { src: 'vue-material/dist/vue-material.min.css', lang: 'css' },
    { src: '~/assets/theme.scss', lang: 'scss' }, // include vue-material theme engine
    { src: '~/assets/index.scss', lang: 'scss' },
    'swiper/dist/css/swiper.min.css',
    '~/assets/css/main.css',
  ],
  modules: [
    ['@nuxtjs/google-tag-manager', {
      id: process.env.GTM_ID || 'GTM-XXXXXXX',
      pageTracking: true,
    }],
    '@nuxtjs/sentry',
  ],
  plugins: [
    { src: '~/plugins/EthHelper', ssr: false },
    { src: '~/plugins/vue-cookie', ssr: false },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/vue-simple-svg' },
    { src: '~/plugins/vue-intercom', ssr: false },
    { src: '~/plugins/vue-vimeo-player', ssr: false },
    { src: '~/plugins/vue-image-lightbox', ssr: false },
    { src: '~/plugins/vue-stripe', ssr: false },
    { src: '~/plugins/vue-swiper', ssr: false },
    { src: '~/plugins/vue-clipboard2', ssr: false },
    { src: '~/plugins/vue-portal', ssr: false },
    { src: '~/plugins/vue-scroll-reveal', ssr: false },
  ],
  /*
  ** Add axios globally
  */
  build: {
    cache: shouldCache,
    extractCSS: true,
    uglify: { cache: shouldCache },
    babel: {
      presets: ({ isServer }) => [
        [
          '@nuxtjs/babel-preset-app',
          {
            targets: isServer
              ? { node: '10' }
              : { browsers: ['defaults'] },
          },
        ],
      ],
    },
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],

    extend(config, { isClient }) {
      config.devtool = '#source-map'; // eslint-disable-line no-param-reassign
      if (process.env.RELEASE && process.env.SENTRY_AUTH_TOKEN) {
        config.plugins.push(new SentryPlugin({
          release: process.env.RELEASE,
          include: ['.nuxt/dist'],
          ignore: ['node_modules', '.nuxt/dist/server-bundle.json', '.nuxt/dist/img', '.nuxt/dist'],
          configFile: '.sentryclirc',
        }));
      }
      if (isClient) {
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
    },
  },
};
