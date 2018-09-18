/* eslint import/prefer-default-export: "off" */

import * as types from '@/store/mutation-types';
import * as api from '@/util/api/api';
import apiWrapper from './api-wrapper';

export async function queryLikeCoinUsdPrice({ commit, dispatch }) {
  try {
    const data = await apiWrapper({ commit, dispatch }, api.apiQueryLikeCoinFiatPrice());
    commit(types.STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE, data.market_data.current_price.usd);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export async function fetchLikeStatistic({ commit, dispatch }) {
  try {
    const data = await apiWrapper({ commit, dispatch }, api.apiGetLikeStatistic());
    commit(types.STATIC_DATA_SET_LIKE_STAT, data);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export async function fetchLikeSuggestionList({ commit, dispatch }) {
  try {
    const [
      suggestionObj = {},
      { personal = [] } = {},
    ] = await Promise.all([
      apiWrapper({ commit, dispatch }, api.apiGetLikeURLSuggestion()),
      apiWrapper({ commit, dispatch }, api.apiGetLikeURLPersonalSuggestion()),
    ]);
    const {
      editorial = [],
      mostLike = [],
    } = suggestionObj;
    commit(types.STATIC_DATA_SET_LIKE_SUGGEST_LIST, { editorial, personal, mostLike });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export async function fetchLikeSuggestionDetails({ commit, dispatch }, url) {
  try {
    const info = await apiWrapper(
      { commit, dispatch },
      api.apiGetLikeArticleInfo(url),
      { slient: true },
    );
    commit(types.STATIC_DATA_SET_LIKE_SUGGEST_DETAIL, { url, info });
    return { info };
  } catch (err) {
    commit(types.STATIC_DATA_SET_LIKE_SUGGEST_DETAIL, { url, info: null });
    return {};
  }
}

export async function fetchUserMinInfo({ commit, dispatch }, id) {
  try {
    const {
      avatar,
      displayName,
    } = await apiWrapper({ commit, dispatch }, api.apiGetUserMinById(id), { slient: true });
    commit(types.STATIC_DATA_SET_USER_MIN_INFO, {
      id,
      avatar,
      displayName,
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export async function fetchLikeButtonStatistics({ commit, dispatch, state }, { id, referrer }) {
  try {
    const promises = [
      apiWrapper({ commit, dispatch }, api.apiGetLikeButtonLikerList(id, referrer)),
      apiWrapper({ commit, dispatch }, api.apiGetLikeButtonTotalCount(id, referrer)),
    ];

    const [
      likers,
      { total: numOfLikes },
    ] = await Promise.all(promises);
    commit(types.STATIC_DATA_SET_LIKER_LIST_DETAIL, {
      id: referrer,
      likers,
      numOfLikes,
    });

    likers.forEach((likerId) => {
      if (!state.userInfos[likerId]) {
        dispatch('fetchUserMinInfo', likerId);
      }
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}
