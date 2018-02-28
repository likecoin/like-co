/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import apiWrapper from './api-wrapper';

export async function newUser({ commit }, data) {
  commit(types.UI_START_BLOCKING_LOADING);
  try {
    await apiWrapper(commit, api.apiPostNewUser(data));
    commit(types.UI_STOP_BLOCKING_LOADING);
  } catch (error) {
    commit(types.UI_STOP_BLOCKING_LOADING);
    throw error;
  }
}

export function setLocalWallet({ commit }, wallet) {
  commit(types.USER_SET_LOCAL_WALLET, wallet);
}

export async function isUser({ commit }, addr) {
  try {
    const { data: user } = await api.apiCheckIsUser(addr);
    if (user && user.user) {
      commit(types.USER_SET_USER_INFO, user);
    } else {
      commit(types.USER_SET_USER_INFO, {});
    }
  } catch (error) {
    commit(types.USER_SET_USER_INFO, {});
    // do nothing
  }
}

export async function sendVerifyEmail({ commit, rootState }, id) {
  try {
    commit(types.UI_START_BLOCKING_LOADING);
    await apiWrapper(commit, api.apiSendVerifyEmail(id, rootState.ui.locale));
    commit(types.UI_STOP_BLOCKING_LOADING);
  } catch (error) {
    commit(types.UI_STOP_BLOCKING_LOADING);
    throw error;
  }
}

export async function verifyEmailByUUID({ commit, rootState }, uuid) {
  try {
    commit(types.UI_START_BLOCKING_LOADING);
    const { wallet } = await apiWrapper(
      commit,
      api.apiVerifyEmailByUUID(uuid, rootState.ui.locale),
    );
    commit(types.UI_STOP_BLOCKING_LOADING);
    return wallet;
  } catch (error) {
    commit(types.UI_STOP_BLOCKING_LOADING);
    throw error;
  }
}

export async function refreshUserInfo({ commit }, id) {
  try {
    const { data: user } = await api.apiGetUserById(id);
    if (user) {
      user.user = id;
      commit(types.USER_SET_USER_INFO, user);
    }
  } catch (error) {
    throw error;
  }
}

export async function sendCouponCodeEmail({ commit, rootState }, data) {
  try {
    commit(types.UI_START_BLOCKING_LOADING);
    await apiWrapper(
      commit,
      api.apiSendCouponCodeEmail(data.user, data.coupon, rootState.ui.locale),
    );
    commit(types.UI_STOP_BLOCKING_LOADING);
  } catch (error) {
    commit(types.UI_STOP_BLOCKING_LOADING);
    throw error;
  }
}
