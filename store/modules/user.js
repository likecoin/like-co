/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  USER_SET_USER_INFO,
  USER_SET_LOCAL_WALLET,
  USER_SET_FETCHING,
  USER_SET_WEB3_FETCHING,
  USER_AWAITING_AUTH,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = {
  user: {},
  wallet: '',
  isFetching: false,
  isAwaitingAuth: false,
  web3Fetching: true,
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
  [USER_SET_WEB3_FETCHING](state, web3Fetching) {
    state.web3Fetching = web3Fetching;
  },
  [USER_AWAITING_AUTH](state, isAwaitingAuth) {
    state.isAwaitingAuth = isAwaitingAuth;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
