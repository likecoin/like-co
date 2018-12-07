import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueMaterial from 'vue-material';

Vue.use(VueMaterial);
Vue.component('router-link', Vue.options.components.RouterLink);
Vue.component('router-view', Vue.options.components.RouterView);
