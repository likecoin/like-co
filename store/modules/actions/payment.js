/* eslint import/prefer-default-export: "off" */
import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import EthHelper from '@/util/EthHelper';
import apiWrapper from './api-wrapper';

export async function sendPayment({ commit }, payload) {
  try {
    const { txHash } = await apiWrapper(commit, api.apiPostPayment(payload));
    const txUrl = `https://rinkeby.etherscan.io/tx/${txHash}`;
    commit(types.UI_ERROR_MSG, `Please wait for transaction to be mined. Check status: <a href="${txUrl} target="_blank">${txUrl}</a>`);
    commit(types.UI_START_LOADING_TX);
    await EthHelper.waitForTxToBeMined(txHash);
    commit(types.UI_STOP_LOADING);
    commit(types.UI_ERROR_ICON, 'check');
    commit(types.UI_ERROR_MSG, 'Transaction OK.');
  } catch (error) {
    commit(types.UI_STOP_LOADING);
    commit(types.UI_ERROR_MSG, error.message || error);
    throw error;
  }
}

export async function checkCoupon({ commit }, code) {
  return apiWrapper(commit, api.apiCheckCoupon(code));
}

export async function claimCoupon({ commit }, { coupon, to }) {
  try {
    const { txHash } = await apiWrapper(commit, api.apiClaimCoupon(coupon, to));
    const txUrl = `https://rinkeby.etherscan.io/tx/${txHash}`;
    commit(types.UI_ERROR_MSG, `Please wait for transaction to be mined. Check status: <a href="${txUrl}">${txUrl}</a>`);
    commit(types.UI_START_LOADING_TX);
    await EthHelper.waitForTxToBeMined(txHash);
    commit(types.UI_STOP_LOADING);
    commit(types.UI_ERROR_ICON, 'check');
    commit(types.UI_ERROR_MSG, 'Coupon Claimed.');
  } catch (error) {
    commit(types.UI_STOP_LOADING);
    let message = error.message || error;
    if (error.message === 'expired') message = 'Error: Coupon already expire';
    commit(types.UI_ERROR_MSG, message);
    throw new Error(message);
  }
}
