/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

export const setErrorMsg = ({ commit }, msg) => {
  commit(types.UI_ERROR_MSG, msg);
};

export const setHeaderMsg = ({ commit }, msg) => {
  commit(types.UI_HEADER_MSG, msg);
};

export const setHeaderIcon = ({ commit }, icon) => {
  commit(types.UI_HEADER_ICON, icon);
};
