/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  UI_ERROR_ICON,
  UI_ERROR_MSG,
  UI_POPUP_ERR,
  UI_START_LOADING,
  UI_START_LOADING_TX,
  UI_STOP_LOADING,
  UI_HEADER_UPDATE,
} from '../mutation-types';
import * as getters from './getters/ui';
import * as actions from './actions/ui';

const state = {
  errorIcon: 'warning',
  errorMsg: '',
  popupError: '',
  headerIcon: '',
  headerTitle: '',
  headerSubtitle: '',
  description: '',
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
  [UI_POPUP_ERR](state, msg) {
    state.popupError = msg;
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
  [UI_HEADER_UPDATE](state, payload) {
    const {
      icon,
      title,
      subtitle,
      description,
    } = payload;
    if (icon !== undefined) state.headerIcon = icon;
    if (title !== undefined) state.headerTitle = title;
    if (subtitle !== undefined) state.headerSubtitle = subtitle;
    if (description !== undefined) state.description = description;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
