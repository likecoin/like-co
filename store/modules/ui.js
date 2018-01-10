/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  UI_ERROR_ICON,
  UI_ERROR_MSG,
  UI_START_LOADING,
  UI_STOP_LOADING,
} from '../mutation-types';
import * as getters from './getters/ui';
import * as actions from './actions/user';

const state = {
  errorIcon: 'warning',
  errorMsg: '',
  isLoading: false,
};

const mutations = {
  [UI_ERROR_ICON](state, icon) {
    state.errorIcon = icon;
  },
  [UI_ERROR_MSG](state, msg) {
    state.errorMsg = msg;
  },
  [UI_START_LOADING](state) {
    state.isLoading = true;
  },
  [UI_STOP_LOADING](state) {
    state.isLoading = false;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
