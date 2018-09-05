/* eslint import/prefer-default-export: "off" */

import * as types from '@/store/mutation-types';
import * as api from '@/util/api/api';
import apiWrapper from './api-wrapper';

export async function queryLikeCoinUsdPrice({ commit, dispatch }) {
  try {
    const data = await apiWrapper({ commit, dispatch }, api.apiQueryLikeCoinFiatPrice());
    commit(types.STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE, data.market_data.current_price.usd);
  } catch (err) {
    console.error(err);
  }
}

export async function fetchLikeStatistic({ commit, dispatch }) {
  try {
    const data = await apiWrapper({ commit, dispatch }, api.apiGetLikeStatistic());
    commit(types.STATIC_DATA_SET_LIKE_STAT, data);
  } catch (err) {
    console.error(err);
  }
}