/* eslint no-param-reassign: "off" */
import Vuex from 'vuex';
import axios from '~/plugins/axios';
import payment from './modules/payment';
import staticData from './modules/staticData';
import ui from './modules/ui';
import user from './modules/user';
import mission from './modules/mission';
import eth from './modules/eth';

const createStore = (() => new Vuex.Store({
  actions: {
    async nuxtServerInit({ commit }, { req, route }) {
      commit('STATIC_DATA_SET_CSRF_TOKEN', '');
      if (req.cookies && req.csrfToken) {
        commit('STATIC_DATA_SET_CSRF_TOKEN', req.csrfToken());
      }
      /* TODO: actually try to verify jwt first? */
      commit('USER_SET_USER_INFO', {});
      if (route.name !== 'in-register') {
        commit('USER_SET_AFTER_AUTH_ROUTE', null);
      }
      commit('USER_AWAITING_AUTH', true);
      const token = (req.cookies || {}).likecoin_auth;
      if (token) {
        try {
          const { data } = await axios.get(
            '/api/users/self',
            {
              headers: {
                Cookie: `likecoin_auth=${req.cookies.likecoin_auth}`,
                'x-real-ip': req.headers['x-real-ip'] || req.ip,
                'user-agent': req.headers['x-ucbrowser-ua'] || req.headers['user-agent'],
              },
            },
          );
          commit('USER_SET_USER_INFO', data);
          commit('USER_AWAITING_AUTH', false);
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
    mission,
    eth,
  },
}));

export default createStore;
