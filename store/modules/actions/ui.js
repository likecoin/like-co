/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

export const setErrorMsg = ({ commit }, msg) => {
  commit(types.UI_ERROR_MSG, msg);
};

export const setPopupError = ({ commit }, msg) => {
  commit(types.UI_POPUP_ERR, msg);
};

export const setPopupInfo = ({ commit }, msg) => {
  commit(types.UI_POPUP_INFO, msg);
};

export const setPageHeader = ({ commit }, payload) => {
  commit(types.UI_HEADER_UPDATE, payload);
};
