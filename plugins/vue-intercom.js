import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import VueIntercom from 'vue-intercom';

const appId = process.env.INTERCOM_APPID;

if (appId) Vue.use(VueIntercom, { appId });
