/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  USER_SET_USER_INFO,
  USER_SET_LOCAL_WALLET,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = {
  user: {},
  isUser: false,
  wallet: '',
};

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_SET_LOCAL_WALLET](state, wallet) {
    state.wallet = wallet;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
