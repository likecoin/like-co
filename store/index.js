/* eslint no-param-reassign: "off" */
import Vuex from 'vuex';
import payment from './modules/payment';
import ui from './modules/ui';
import user from './modules/user';

const createStore = (() => new Vuex.Store({
  modules: {
    payment,
    ui,
    user,
  },
}));

export default createStore;
