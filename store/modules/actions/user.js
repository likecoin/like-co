/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import apiWrapper from './api-wrapper';

export async function newUser({ commit }, data) {
  return apiWrapper(commit, api.apiPostNewUser(data));
}

export async function getBlockie({ commit }, data) {
  return apiWrapper(commit, api.apiGetBlockie(data));
}
