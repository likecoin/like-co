/* eslint no-param-reassign: "off" */
import Vuex from 'vuex';
import axios from '~/plugins/axios';
import payment from './modules/payment';
import staticData from './modules/staticData';
import ui from './modules/ui';
import user from './modules/user';
import authCore from './modules/authCore';
import wallet from './modules/wallet';

const createStore = (() => new Vuex.Store({
  actions: {
    async nuxtServerInit({ commit }, { req, route }) {
      /* TODO: actually try to verify jwt first? */
      commit('USER_SET_USER_INFO', {});
      if (route.name !== 'in-register') {
        commit('USER_SET_AFTER_AUTH_ROUTE', null);
      }
      const token = (req.cookies || {}).likecoin_auth;
      if (token) {
        try {
          const { data } = await axios.get(
            '/users/self',
            {
              headers: {
                Cookie: `likecoin_auth=${req.cookies.likecoin_auth}`,
                'x-real-ip': req.headers['x-real-ip'] || req.ip,
                'user-agent': req.headers['x-ucbrowser-ua'] || req.headers['user-agent'],
              },
            },
          );
          commit('USER_SET_USER_INFO', data);
        } catch (err) {
          // no op
        }
      }
    },
  },
  modules: {
    payment,
    staticData,
    ui,
    user,
    authCore,
    wallet,
  },
}));

export default createStore;
