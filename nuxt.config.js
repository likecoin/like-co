const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'LikeStore - payment by likecoin',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Easy paymeny by Likecoin, the settlement currency for Creative Contents' },
      { hid: 'og_image', property: 'og:image', content: 'https://likecoin.foundation/static/logo.png' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,700,400italic|Material+Icons' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Open+Sans:300,600,700' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#448aff' },
  router: {
    extendRoutes(routes, resolve) {
      routes.unshift({
        name: 'idWithAmount',
        path: '/pay/:id/:amount?',
        component: resolve(__dirname, 'pages/pay/_id.vue'),
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
  ],
  plugins: [
    { src: '~/plugins/vue-material' },
    { src: '~/plugins/EthHelper', ssr: false },
  ],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios', 'bignumber.js', 'vue-material'],
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
        // eslint-disable-next-line no-param-reassign
        config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin');
        config.plugins.push(new UglifyJSWebpackPlugin());
      }
    },
  },
};
