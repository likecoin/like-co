/* eslint import/prefer-default-export: "off" */

import * as types from '@/store/mutation-types';
import * as api from '@/util/api/api';
import apiWrapper from './api-wrapper';

export async function queryLikeCoinUsdPrice({ commit, dispatch }) {
  try {
    const data = await apiWrapper({ commit, dispatch }, api.apiQueryLikeCoinFiatPrice());
    commit(types.STATIC_DATA_SET_LIKECOIN_USD_NUMERIC_PRICE, data.price);
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export async function fetchUserMinInfo({ commit, dispatch }, id) {
  try {
    const {
      avatar,
      displayName,
      isPreRegCivicLiker,
      isSubscribedCivicLiker,
    } = await apiWrapper({ commit, dispatch }, api.apiGetUserMinById(id), { slient: true });
    commit(types.STATIC_DATA_SET_USER_MIN_INFO, {
      id,
      avatar,
      displayName,
      isPreRegCivicLiker,
      isSubscribedCivicLiker,
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
