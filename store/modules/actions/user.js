/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import apiWrapper from './api-wrapper';

export async function newUser({ commit }, data) {
  return apiWrapper(commit, api.apiPostNewUser(data));
}

export async function getBlockie({ commit }, data) {
  return apiWrapper(commit, api.apiGetBlockie(data));
}

export async function isUser({ commit }, addr) {
  try {
    const user = await apiWrapper(commit, api.apiCheckIsUser(addr));
    if (user) {
      commit(types.USER_SET_USER_INFO, user);
      commit(types.USER_SET_REGISTERED, true);
    }
  } catch (error) {
    // do nothing
  }
}
