/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  UI_ERROR_ICON,
  UI_ERROR_MSG,
  UI_START_LOADING,
  UI_START_LOADING_TX,
  UI_STOP_LOADING,
  UI_HEADER_ICON,
  UI_HEADER_MSG,
} from '../mutation-types';
import * as getters from './getters/ui';
import * as actions from './actions/ui';

const state = {
  errorIcon: 'warning',
  errorMsg: '',
  headerIcon: '',
  headerMsg: '',
  isInTransaction: false,
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
    state.isInTransaction = false;
    state.isLoading = true;
  },
  [UI_START_LOADING_TX](state) {
    state.isInTransaction = true;
    state.isLoading = true;
  },
  [UI_STOP_LOADING](state) {
    state.isLoading = false;
  },
  [UI_HEADER_ICON](state, icon) {
    state.headerIcon = icon;
  },
  [UI_HEADER_MSG](state, msg) {
    state.headerMsg = msg;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
