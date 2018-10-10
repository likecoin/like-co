/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

import EthHelper from '@/util/EthHelper';

export const startWeb3Polling = async ({ commit }) => {
  if (!EthHelper.getIsInited()) {
    commit(types.ETH_SET_WEB3_POLLING, true);
    commit(types.UI_START_LOADING);
    EthHelper.pollForWeb3('window');
    return true;
  }
  return false;
};

export const stopWeb3Polling = ({ commit }) => {
  commit(types.ETH_SET_WEB3_POLLING, false);
  commit(types.UI_STOP_LOADING);
};
