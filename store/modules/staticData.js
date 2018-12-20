/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import {
  STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE,
  STATIC_DATA_SET_LIKE_STAT,
  STATIC_DATA_SET_LIKE_SUGGEST_LIST,
  STATIC_DATA_SET_LIKE_SUGGEST_DETAIL,
  STATIC_DATA_SET_USER_MIN_INFO,
  STATIC_DATA_SET_LIKER_LIST_DETAIL,
  STATIC_DATA_SET_CSRF_TOKEN,
} from '../mutation-types';
import * as getters from './getters/staticData';
import * as actions from './actions/staticData';

const state = {
  likeCoinUsdNumericPrice: 0,
  LIKEStat: {},
  suggestedArticleInfo: {},
  suggestedArticleList: [],
  userInfos: {},
  likerListDetails: {},
  csrfToken: '',
};

const mutations = {
  [STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE](state, payload) {
    state.likeCoinUsdNumericPrice = payload;
  },
  [STATIC_DATA_SET_LIKE_STAT](state, payload) {
    state.LIKEStat = payload;
  },
  [STATIC_DATA_SET_LIKE_SUGGEST_LIST](state, {
    editorial = [], personal = [], pick = [],
  }) {
    let list = editorial.concat(personal).concat(pick);
    const dedup = new Set();
    list = list.filter(i => (dedup.has(i) ? false : dedup.add(i)));
    state.suggestedArticleList = list;
  },
  [STATIC_DATA_SET_LIKE_SUGGEST_DETAIL](state, { url, info }) {
    if (info) {
      Vue.set(state.suggestedArticleInfo, url, { url, ...info });
    }
  },
  [STATIC_DATA_SET_USER_MIN_INFO](state, { id, displayName, avatar }) {
    Vue.set(state.userInfos, id, { displayName, avatar });
  },
  [STATIC_DATA_SET_LIKER_LIST_DETAIL](state, { id, ...payload }) {
    Vue.set(state.likerListDetails, id, { ...payload });
  },
  [STATIC_DATA_SET_CSRF_TOKEN](state, csrfToken) {
    state.csrfToken = csrfToken;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
