/* eslint no-param-reassign: "off" */
import Vuex from 'vuex';
import payment from './modules/payment';
import ui from './modules/ui';
import user from './modules/user';
import mission from './modules/mission';

const createStore = (() => new Vuex.Store({
  modules: {
    payment,
    ui,
    user,
    mission,
  },
}));

export default createStore;
