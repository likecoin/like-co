/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  ETH_START_WEB3_POLLING,
  ETH_STOP_WEB3_POLLING,
} from '../mutation-types';
import * as actions from './actions/eth';
import * as getters from './getters/eth';

const state = {
  isWeb3Polling: false,
};

const mutations = {
  [ETH_START_WEB3_POLLING](state) {
    state.isWeb3Polling = true;
  },
  [ETH_STOP_WEB3_POLLING](state) {
    state.isWeb3Polling = false;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
