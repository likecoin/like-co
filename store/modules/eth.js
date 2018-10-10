/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  ETH_SET_WEB3_POLLING,
} from '../mutation-types';
import * as actions from './actions/eth';
import * as getters from './getters/eth';

const state = {
  isWeb3Polling: false,
};

const mutations = {
  [ETH_SET_WEB3_POLLING](state, payload) {
    state.isWeb3Polling = payload;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
