module.exports = {
  /*
  ** Headers of the page
  */
  env: {
    INTERCOM_APPID: process.env.INTERCOM_APPID,
    IS_TESTNET: process.env.IS_TESTNET,
  },
  head: {
    title: 'LikeCoin Store',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'send and receive LikeCoin' },
      { hid: 'og_title', property: 'og:title', content: 'LikeCoin Store' },
      { hid: 'og_description', property: 'og:description', content: 'send and receive LikeCoin' },
      { hid: 'og_image', property: 'og:image', content: 'https://likecoin.foundation/static/logo.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,700,400italic|Material+Icons' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Open+Sans:300,400,600,700' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#448aff' },

  render: {
    csp: {
      enabled: true,
      hashAlgorithm: 'sha256',
      allowedSources: [
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com',
        'https://storage.googleapis.com',
        'https://www.google-analytics.com',
        'https://js.intercomcdn.com',
        'https://widget.intercom.io',
      ],
    },
  },

  router: {
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
      routes.unshift({
        name: 'free',
        path: '/free',
        component: resolve(__dirname, 'pages/redeem.vue'),
      });
    },
  },
  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/main.css',
    { src: 'vue-material/dist/vue-material.min.css', lang: 'css' },
    { src: '~/assets/theme.scss', lang: 'scss' }, // include vue-material theme engine
    { src: '~/assets/index.scss', lang: 'scss' },
    'swiper/dist/css/swiper.css',
  ],
  modules: (process.env.GA_TRACKING_ID) ? [
    ['@nuxtjs/google-analytics', {
      id: process.env.GA_TRACKING_ID,
    }],
  ] : [],
  plugins: [
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/vue-i18n' },
    { src: '~/plugins/EthHelper', ssr: false },
    { src: '~/plugins/vue-intercom', ssr: false },
    { src: '~/plugins/vue-swiper', ssr: false },
    // { src: '~/plugins/vue-chart', ssr: false },
  ],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios', 'bignumber.js', 'vue-material', 'vue-i18n'],
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
