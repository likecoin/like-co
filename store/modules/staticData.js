/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE,
} from '../mutation-types';
import * as getters from './getters/staticData';
import * as actions from './actions/staticData';

const state = {
  likeCoinUsdNumericPrice: 0,
};

const mutations = {
  [STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE](state, payload) {
    state.likeCoinUsdNumericPrice = payload;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
