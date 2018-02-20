import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueLazyLoad from 'vue-lazyload';
import VueTouch from 'vue-touch';

require('vue-image-lightbox/dist/vue-image-lightbox.min.css');

Vue.use(VueLazyLoad);
Vue.use(VueTouch, { name: 'v-touch' });
