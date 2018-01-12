/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import EthHelper from '@/util/EthHelper';
import apiWrapper from './api-wrapper';

export async function sendPayment({ commit }, payload) {
  try {
    const { txHash } = await apiWrapper(commit, api.apiPostPayment(payload));
    if (!txHash) throw new Error('Invalid txHash received');
    const txUrl = `https://rinkeby.etherscan.io/tx/${txHash}`;
    commit(types.UI_ERROR_MSG, `Please wait for transaction to be mined. Check status: <a href="${txUrl}">${txUrl}</a>`);
    commit(types.UI_START_LOADING_TX);
    await EthHelper.waitForTxToBeMined(txHash);
    commit(types.UI_STOP_LOADING);
    commit(types.UI_ERROR_ICON, 'check');
    commit(types.UI_ERROR_MSG, 'Transaction OK.');
  } catch (error) {
    commit(types.UI_STOP_LOADING);
    commit(types.UI_ERROR_MSG, (error.response) ? error.response.data : error);
    console.error(error);
  }
}

    commit(types.UI_ERROR_MSG, (error.response) ? error.response.data : error);
    console.error(error);
  }
}
