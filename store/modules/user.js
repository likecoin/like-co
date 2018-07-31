/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import {
  USER_SET_USER_INFO,
  USER_SET_LOCAL_WALLET,
  USER_SET_FETCHING,
  USER_SET_WEB3_FETCHING,
  USER_AWAITING_AUTH,
  USER_SET_SOCIAL,
  USER_LINK_SOCIAL,
  USER_UNLINK_SOCIAL,
  USER_SET_LIKECOIN_BIG_NUMBER_AMOUNT,
  USER_SELECT_FACEBOOK_PAGE_LINK,
} from '../mutation-types';
import * as actions from './actions/user';
import * as getters from './getters/user';

const state = {
  user: {},
  wallet: '',
  isFetching: false,
  isAwaitingAuth: false,
  web3Fetching: true,
  platforms: {},
  likeCoinAmountInBigNumber: null,
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
  [USER_SET_SOCIAL](state, platforms) {
    state.platforms = platforms;
  },
  [USER_LINK_SOCIAL](state, payload) {
    const { id, displayName, url } = payload;
    Vue.set(state.platforms, id, { displayName, url });
  },
  [USER_UNLINK_SOCIAL](state, payload) {
    Vue.set(state.platforms, payload, undefined);
  },
  [USER_SELECT_FACEBOOK_PAGE_LINK](state, payload) {
    if (payload) {
      Vue.set(state.platforms, 'facebook', {
        ...state.platforms.facebook,
        url: payload,
      });
    }
  },
  [USER_SET_LIKECOIN_BIG_NUMBER_AMOUNT](state, payload) {
    state.likeCoinAmountInBigNumber = payload;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
