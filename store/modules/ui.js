/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import uuidv1 from 'uuid/v1';

import {
  UI_SET_LOCALE,
  UI_SET_METAMASK_ERROR,
  UI_SET_WEB3_TYPE,
  UI_INFO_MSG,
  UI_ERROR_MSG,
  UI_POPUP_ERR,
  UI_POPUP_INFO,
  UI_POPUP_OPEN,
  UI_POPUP_CLOSE,
  UI_START_LOADING,
  UI_STOP_LOADING,
  UI_START_LOADING_TX,
  UI_STOP_LOADING_TX,
  UI_START_BLOCKING_LOADING,
  UI_STOP_BLOCKING_LOADING,
  UI_STOP_ALL_LOADING,
  UI_CLOSE_TX_DIALOG,
  UI_LOGIN_OVERRIDE,
  UI_DISABLE_ERROR,
  UI_HEADER_UPDATE,
  UI_SET_TX_DIALOG_ACTION,
  UI_SET_MISSION_DIALOG,
  UI_OPEN_SLIDING_MENU,
  UI_CLOSE_SLIDING_MENU,
  UI_SET_PROMPT_NOTIFICATION_DIALOG,
  UI_SET_SIGN_PAYLOAD_OBJECT,
  UI_SET_AUTH_DIALOG,
  UI_SET_WALLET_NOTICE_DIALOG,
} from '../mutation-types';
import * as getters from './getters/ui';
import * as actions from './actions/ui';

const state = {
  locale: 'en',
  metamaskError: '',
  signPayloadObject: {},
  web3Type: 'window',
  infoIsError: false,
  infoMsg: '',
  popupError: '',
  popupInfo: '',
  popupMission: '',
  headerIcon: '',
  headerTitle: '',
  headerSubtitle: '',
  description: '',
  isInTransaction: false,
  isLoading: false,
  isBlocking: false,
  isShowingTxPopup: false,
  isSlidingMenuOpen: false,
  isLoginOverride: false,
  isErrorDisabled: false,
  txDialogActionRoute: null,
  txDialogActionText: '',
  isShowingPromptNotificationDialog: false,
  isShowAuthDialog: false,
  isShowWalletNoticeDialog: false,
  walletNoticeDialogCancelTitle: '',
  walletNoticeDialogCancelCallback: null,
  walletNoticeDialogConfirmCallback: null,
  popupDialogs: [],
};

const mutations = {
  [UI_SET_LOCALE](state, locale) {
    state.locale = locale;
    if (!process.server && window.localStorage) {
      window.localStorage.language = locale;
    }
  },
  [UI_SET_METAMASK_ERROR](state, err) {
    state.metamaskError = err;
  },
  [UI_SET_SIGN_PAYLOAD_OBJECT](state, payload) {
    state.signPayloadObject = payload;
  },
  [UI_SET_WEB3_TYPE](state, type) {
    state.web3Type = type;
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
  [UI_POPUP_OPEN](state, payload) {
    payload.uuid = uuidv1();
    payload.isShow = true;
    Vue.set(state, 'popupDialogs', [...state.popupDialogs, payload]);
  },
  [UI_POPUP_CLOSE](state, uuid) {
    const newPopupDialogs = [...state.popupDialogs];
    for (let i = state.popupDialogs.length - 1; i >= 0; i -= 1) {
      if (state.popupDialogs[i].uuid === uuid) {
        newPopupDialogs.splice(i, 1);
        break;
      }
    }
    Vue.set(state, 'popupDialogs', newPopupDialogs);
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
  [UI_SET_MISSION_DIALOG](state, payload) {
    state.popupMission = payload;
  },
  [UI_LOGIN_OVERRIDE](state, bool) {
    state.isLoginOverride = bool;
  },
  [UI_DISABLE_ERROR](state, bool) {
    state.isErrorDisabled = bool;
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
  [UI_OPEN_SLIDING_MENU](state) {
    state.isSlidingMenuOpen = true;
  },
  [UI_CLOSE_SLIDING_MENU](state) {
    state.isSlidingMenuOpen = false;
  },
  [UI_SET_PROMPT_NOTIFICATION_DIALOG](state, payload) {
    state.isShowingPromptNotificationDialog = payload;
  },
  [UI_SET_AUTH_DIALOG](state, payload) {
    state.isShowAuthDialog = !!payload.isShow;
  },
  [UI_SET_WALLET_NOTICE_DIALOG](state, payload) {
    state.isShowWalletNoticeDialog = !!payload.isShow;
    state.walletNoticeDialogCancelTitle = payload.cancelTitle || '';
    state.walletNoticeDialogCancelCallback = payload.onCancel || (() => {});
    state.walletNoticeDialogConfirmCallback = payload.onConfirm || (() => {});
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
