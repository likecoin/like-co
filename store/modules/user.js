/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  USER_SET_WALLET,
  USER_SET_REGISTERED,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = {
  wallet: '',
  isUser: false,
};

const mutations = {
  [USER_SET_WALLET](state, wallet) {
    state.wallet = wallet;
  },
  [USER_SET_REGISTERED](state, isUser) {
    state.isUser = isUser;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
