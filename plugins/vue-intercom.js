import Vue from 'vue';
import VueIntercom from 'vue-intercom';

const appId = process.env.INTERCOM_APPID;

if (appId) Vue.use(VueIntercom, { appId });
