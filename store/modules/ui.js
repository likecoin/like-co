/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import {
  UI_SET_METAMASK_ERROR,
  UI_INFO_MSG,
  UI_ERROR_MSG,
  UI_POPUP_ERR,
  UI_POPUP_INFO,
  UI_START_LOADING,
  UI_STOP_LOADING,
  UI_START_LOADING_TX,
  UI_STOP_LOADING_TX,
  UI_START_BLOCKING_LOADING,
  UI_STOP_BLOCKING_LOADING,
  UI_STOP_ALL_LOADING,
  UI_CLOSE_TX_DIALOG,
  UI_HEADER_UPDATE,
  UI_SET_TX_DIALOG_ACTION,
} from '../mutation-types';
import * as getters from './getters/ui';
import * as actions from './actions/ui';

const state = {
  metamaskError: '',
  infoIsError: false,
  infoMsg: '',
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
  txDialogActionRoute: null,
  txDialogActionText: '',
};

const mutations = {
  [UI_SET_METAMASK_ERROR](state, err) {
    state.metamaskError = err;
  },
  [UI_INFO_MSG](state, msg) {
    state.infoMsg = msg;
    state.infoIsError = false;
  },
  [UI_ERROR_MSG](state, msg) {
    state.infoMsg = msg;
    state.infoIsError = true;
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
  [UI_STOP_ALL_LOADING](state) {
    state.isInTransaction = false;
    state.isLoading = false;
    state.isBlocking = false;
  },
  [UI_START_BLOCKING_LOADING](state) {
    state.isLoading = true;
    state.isBlocking = true;
  },
  [UI_STOP_BLOCKING_LOADING](state) {
    state.isLoading = false;
    state.isBlocking = false;
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
  [UI_SET_TX_DIALOG_ACTION](state, payload) {
    const {
      txDialogActionRoute,
      txDialogActionText,
    } = payload;
    if (txDialogActionRoute !== undefined) state.txDialogActionRoute = txDialogActionRoute;
    if (txDialogActionText !== undefined) state.txDialogActionText = txDialogActionText;
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
