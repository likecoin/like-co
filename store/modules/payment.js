/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  PAYMENT_SET_PENDING_HASH,
  PAYMENT_SET_PENDING_TX_INFO,
} from '../mutation-types';
import * as getters from './getters/payment';
import * as actions from './actions/payment';

const state = () => ({
  pendingTx: '',
  pendingTxInfo: {},
});

const mutations = {
  [PAYMENT_SET_PENDING_HASH](state, txHash) {
    state.pendingTx = txHash;
  },
  [PAYMENT_SET_PENDING_TX_INFO](state, txInfo) {
    state.pendingTxInfo = txInfo;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
