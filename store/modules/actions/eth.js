/* eslint import/prefer-default-export: "off" */
import * as types from '@/store/mutation-types';

import EthHelper from '@/util/EthHelper';

export const startWeb3Polling = async ({ commit }, isReset = false) => {
  if (isReset || !EthHelper.getIsInited()) {
    commit(types.ETH_SET_WEB3_POLLING, true);
    commit(types.UI_START_LOADING);
    EthHelper.pollForWeb3();
    return true;
  }

  if (!EthHelper.getWallet()) {
    commit(types.ETH_SET_WEB3_POLLING, true);
    commit(types.UI_START_LOADING);
    EthHelper.pollForAccounts();
    return true;
  }

  return false;
};

export const stopWeb3Polling = ({ commit }) => {
  EthHelper.clearTimers();
  commit(types.ETH_SET_WEB3_POLLING, false);
  commit(types.UI_STOP_LOADING);
};
