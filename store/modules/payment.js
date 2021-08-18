/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  PAYMENT_SET_PENDING_HASH,
  PAYMENT_SET_PENDING_TX_INFO,
  PAYMENT_SET_COSMOS_WALLET_SOURCE,
  ISCN_SET_TOTAL_FEE,
} from '../mutation-types';
import * as getters from './getters/payment';
import * as actions from './actions/payment';

const state = () => ({
  pendingTx: '',
  pendingTxInfo: {},
  cosmosWalletSource: '',
});

const mutations = {
  [PAYMENT_SET_PENDING_HASH](state, txHash) {
    state.pendingTx = txHash;
  },
  [PAYMENT_SET_PENDING_TX_INFO](state, txInfo) {
    state.pendingTxInfo = txInfo;
  },
  [ISCN_SET_TOTAL_FEE](state, ISCNTotalFee) {
    state.totalFee = ISCNTotalFee;
  },
  [PAYMENT_SET_COSMOS_WALLET_SOURCE](state, cosmosWalletSource) {
    state.cosmosWalletSource = cosmosWalletSource;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
