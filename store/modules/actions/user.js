/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import apiWrapper from './api-wrapper';

export async function newUser({ commit }, data) {
  await apiWrapper(commit, api.apiPostNewUser(data));
}
