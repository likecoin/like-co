/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

export const setErrorMsg = ({ commit }, msg) => {
  commit(types.UI_ERROR_MSG, msg);
};
