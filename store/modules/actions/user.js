/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import { REDIRECT_NAME_WHITE_LIST } from '@/constant';

import apiWrapper from './api-wrapper';

export async function newUser({ commit }, data) {
  return apiWrapper(commit, api.apiPostNewUser(data), { blocking: true });
}

export function setLocalWallet({ commit }, wallet) {
  commit(types.USER_SET_LOCAL_WALLET, wallet);
}

export function setUserIsFetching({ commit }, fetching) {
  commit(types.USER_SET_FETCHING, fetching);
}

export async function refreshUser({ commit, state }) {
  try {
    commit(types.USER_SET_FETCHING, true);
    const { data: user } = await api.apiCheckIsUser(state.wallet);
    if (user && user.user) {
      commit(types.USER_SET_USER_INFO, user);
    } else {
      commit(types.USER_SET_USER_INFO, {});
    }
    commit(types.USER_SET_FETCHING, false);
  } catch (error) {
    commit(types.USER_SET_USER_INFO, {});
    commit(types.USER_SET_FETCHING, false);
    // do nothing
  }
}

export async function isUser({ commit, state }, addr) {
  try {
    commit(types.USER_SET_FETCHING, true);
    const { data: user } = await api.apiCheckIsUser(addr);
    const oldUser = state.user.user;
    const currentUser = (user || {}).user;
    if (user && user.user) {
      commit(types.USER_SET_USER_INFO, user);
    } else {
      commit(types.USER_SET_USER_INFO, {});
    }
    if (currentUser !== oldUser) {
      commit(types.UI_INFO_MSG, '');
      commit(types.MISSION_CLEAR_ALL);
    }
    commit(types.USER_SET_FETCHING, false);
  } catch (error) {
    console.error(error);
    commit(types.USER_SET_USER_INFO, {});
    commit(types.USER_SET_FETCHING, false);
    // do nothing
  }
}

export async function getWalletByUser({ commit }, id) {
  const { wallet } = await apiWrapper(commit, api.apiGetUserById(id), { blocking: true });
  return wallet;
}

export async function sendVerifyEmail({ commit, rootState }, { id, ref }) {
  let redirect = '';
  if (REDIRECT_NAME_WHITE_LIST.indexOf(ref) > -1) redirect = ref;
  return apiWrapper(
    commit,
    api.apiSendVerifyEmail(id, redirect, rootState.ui.locale),
    { blocking: true },
  );
}

export async function verifyEmailByUUID({ commit, rootState }, uuid) {
  return apiWrapper(
    commit,
    api.apiVerifyEmailByUUID(uuid, rootState.ui.locale),
    { blocking: true },
  );
}

export async function refreshUserInfo({ commit }, id) {
  try {
    commit(types.USER_SET_FETCHING, true);
    const { data: user } = await api.apiGetUserById(id);
    if (user) {
      user.user = id;
      commit(types.USER_SET_USER_INFO, user);
    }
    commit(types.USER_SET_FETCHING, false);
  } catch (error) {
    commit(types.USER_SET_FETCHING, false);
    throw error;
  }
}

export async function fetchUserReferralStats({ commit }, id) {
  return apiWrapper(commit, api.apiGetReferralById(id));
}

export async function fetchUserTotalBonus({ commit }, id) {
  const { bonus } = await apiWrapper(commit, api.apiGetTotalBonusById(id));
  return bonus;
}

export async function sendCouponCodeEmail({ commit, rootState }, data) {
  return apiWrapper(
    commit,
    api.apiSendCouponCodeEmail(data.user, data.coupon, rootState.ui.locale),
    { blocking: true },
  );
}

export async function sendInvitationEmail({ commit }, data) {
  return apiWrapper(
    commit,
    api.apiSendInvitationEmail(data.user, data.email),
    { blocking: true },
  );
}

export async function sendKYC({ commit }, { payload, isAdv }) {
  return apiWrapper(
    commit,
    isAdv ? api.apiPostAdvancedKYC(payload) : api.apiPostKYC(payload),
    { blocking: true },
  );
}

export async function fetchAdvancedKYC({ commit }, id) {
  return apiWrapper(commit, api.apiGetAdvancedKYC(id));
}

