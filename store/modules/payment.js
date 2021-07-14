/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  PAYMENT_SET_PENDING_HASH,
  PAYMENT_SET_PENDING_TX_INFO,
  PAYMENT_SET_COSMOS_WALLET_SOURCE,
} from '../mutation-types';
import * as getters from './getters/payment';
import * as actions from './actions/payment';

const state = () => ({
  pendingTx: '',
  pendingTxInfo: {},
  cosmosWalletSource: 'keplr',
});

const mutations = {
  [PAYMENT_SET_PENDING_HASH](state, txHash) {
    state.pendingTx = txHash;
  },
  [PAYMENT_SET_PENDING_TX_INFO](state, txInfo) {
    state.pendingTxInfo = txInfo;
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
