/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  PAYMENT_SET_PENDING_HASH,
} from '../mutation-types';
import * as getters from './getters/payment';
import * as actions from './actions/payment';

const state = {
  pendingTx: '',
};

const mutations = {
  [PAYMENT_SET_PENDING_HASH](state, txHash) {
    state.pendingTx = txHash;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
