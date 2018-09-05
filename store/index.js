/* eslint no-param-reassign: "off" */
import Vuex from 'vuex';
import payment from './modules/payment';
import staticData from './modules/staticData';
import ui from './modules/ui';
import user from './modules/user';
import mission from './modules/mission';

const createStore = (() => new Vuex.Store({
  modules: {
    payment,
    staticData,
    ui,
    user,
    mission,
  },
}));

export default createStore;
