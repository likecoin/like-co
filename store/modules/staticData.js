/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE,
  STATIC_DATA_SET_LIKE_STAT,
} from '../mutation-types';
import * as getters from './getters/staticData';
import * as actions from './actions/staticData';

const state = {
  likeCoinUsdNumericPrice: 0,
  LIKEStat: {},
};

const mutations = {
  [STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE](state, payload) {
    state.likeCoinUsdNumericPrice = payload;
  },
  [STATIC_DATA_SET_LIKE_STAT](state, payload) {
    state.LIKEStat = payload;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
