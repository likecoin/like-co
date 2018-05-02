const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

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
    title: 'LikeCoin - Reinventing the Like.',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { hid: 'description', name: 'description', content: 'Rewarding Contents by Proof of Creativity' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin - Reinventing the Like.' },
      { hid: 'og_description', property: 'og:description', content: 'Rewarding Contents by Proof of Creativity' },
      { hid: 'og_image', property: 'og:image', content: 'https://like.co/logo.png' },
      { hid: 'og_image_alt', property: 'og:image:alt', content: 'LikeCoin' },
      { hid: 'theme-color', name: 'theme-color', content: '#D2F0F0' },
    ],
    script: [
      { src: 'https://use.typekit.net/ube6iww.js' },
      { src: '/vendor/typekit.js' },
      { src: '/vendor/fb/pixel.js' },
      { src: '/vendor/fb/sdk.js' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Open+Sans:300,400,600|Material+Icons' },
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
      allowedSources: [
        /* gtm inline code */
        '\'sha256-iuXaQeiad/7pk5Ih+zioILgFF9jt93hQCklW9N52YdU=\'',
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com',
        'https://use.typekit.net',
        'https://storage.googleapis.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://www.googleadservices.com',
        'https://googleads.g.doubleclick.net',
        'https://sp.analytics.yahoo.com',
        'https://s.yimg.com',
        'https://js.intercomcdn.com',
        'https://widget.intercom.io',
        'https://checkout.stripe.com',
        'https://connect.facebook.net',
        'https://player.vimeo.com',
      ],
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
    ['@nuxtjs/google-analytics', {
      id: process.env.GA_TRACKING_ID || 'UA-12301-2',
      autoTracking: {
        exception: true,
      },
    }],
    ['@nuxtjs/google-tag-manager', { id: process.env.GTM_ID || 'GTM-XXXXXXX' }],
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
  ],
  /*
  ** Add axios globally
  */
  build: {
    scopeHoisting: true,
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-url': {},
        'postcss-cssnext': {
          browsers: ['defaults'],
        },
      },
    },
    parallel: true,
    vendor: [
      'core-js/fn/object/assign',
      'core-js/fn/object/values',
      'core-js/fn/string/includes',
      'core-js/fn/array/includes',
      'axios',
      'bignumber.js',
      'classlist-polyfill',
      'moment',
      'vue-clipboard2',
      'vue-i18n',
      'vue-material',
      'vue-vimeo-player',
    ],
    babel: {
      presets: ({ isServer }) => [
        [
          'vue-app',
          {
            targets: isServer
              ? { node: '8.11.1', uglify: false }
              : { browsers: ['defaults'], uglify: false },
          },
        ],
      ],
    },
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if (ctx.isClient) {
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
