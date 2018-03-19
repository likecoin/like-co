/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  USER_SET_USER_INFO,
  USER_SET_LOCAL_WALLET,
  USER_SET_FETCHING,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = {
  user: {},
  wallet: '',
  isFetching: true,
};

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_SET_LOCAL_WALLET](state, wallet) {
    state.wallet = wallet;
  },
  [USER_SET_FETCHING](state, isFetching) {
    state.isFetching = isFetching;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
