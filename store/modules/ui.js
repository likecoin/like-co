/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  UI_ERROR_ICON,
  UI_ERROR_MSG,
  UI_POPUP_ERR,
  UI_POPUP_INFO,
  UI_START_LOADING,
  UI_STOP_LOADING,
  UI_START_LOADING_TX,
  UI_STOP_LOADING_TX,
  UI_START_BLOCKING_LOADING,
  UI_STOP_BLOCKING_LOADING,
  UI_CLOSE_TX_DIALOG,
  UI_HEADER_UPDATE,
} from '../mutation-types';
import * as getters from './getters/ui';
import * as actions from './actions/ui';

const state = {
  errorIcon: 'warning',
  errorMsg: '',
  popupError: '',
  popupInfo: '',
  headerIcon: '',
  headerTitle: '',
  headerSubtitle: '',
  description: '',
  isInTransaction: false,
  isLoading: false,
  isBlocking: false,
  isShowingTxPopup: false,
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
  [UI_POPUP_INFO](state, msg) {
    state.popupInfo = msg;
  },
  [UI_START_LOADING](state) {
    state.isLoading = true;
  },
  [UI_STOP_LOADING](state) {
    state.isLoading = false;
  },
  [UI_START_LOADING_TX](state) {
    state.isInTransaction = true;
    state.isShowingTxPopup = true;
    state.isLoading = true;
  },
  [UI_STOP_LOADING_TX](state) {
    state.isInTransaction = false;
    state.isLoading = false;
  },
  [UI_START_BLOCKING_LOADING](state) {
    state.isLoading = true;
    state.isBlocking = true;
  },
  [UI_STOP_BLOCKING_LOADING](state) {
    state.isLoading = false;
    state.isBlocking = false;
  },
  [UI_STOP_LOADING](state) {
    state.isLoading = false;
  },
  [UI_CLOSE_TX_DIALOG](state) {
    state.isShowingTxPopup = false;
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
