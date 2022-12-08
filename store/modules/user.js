/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';
import {
  USER_SET_USER_INFO,
  USER_SET_LOCAL_WALLET,
  USER_SET_AFTER_AUTH_ROUTE,
  USER_SET_LIKECOIN_AMOUNT_OBJECT,
  USER_UPDATE_READ_CONTENT_STATUS,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = () => ({
  user: {},
  wallet: '',
  isFetching: false,
  preAuthRoute: null,
  afterAuthRoute: {},
  web3Fetching: false,
  links: {},
  likecoinAmountObject: {},
  likeCoinAmountInBigNumber: null,
  authCoreAccessToken: '',
});

const mutations = {
  [USER_SET_USER_INFO](state, user) {
    state.user = user;
  },
  [USER_SET_LOCAL_WALLET](state, wallet) {
    state.wallet = wallet;
  },
  [USER_SET_AFTER_AUTH_ROUTE](state, route) {
    state.preAuthRoute = route;
  },
  [USER_SET_LIKECOIN_AMOUNT_OBJECT](state, data) {
    const balance = Object.keys(data).reduce((acc, key) => acc.plus(data[key]), new BigNumber(0));
    state.likecoinAmountObject = data;
    state.likeCoinAmountInBigNumber = balance;
  },
  [USER_UPDATE_READ_CONTENT_STATUS](state, payload) {
    Vue.set(state.user, 'read', {
      ...state.user.read,
      ...payload,
    });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
