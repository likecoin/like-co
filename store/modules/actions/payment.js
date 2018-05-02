/* eslint import/prefer-default-export: "off" */
import BigNumber from 'bignumber.js';

import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import EthHelper from '@/util/EthHelper';
import { INITIAL_TOKENSALE_ETH } from '@/constant';
import apiWrapper from './api-wrapper';

export async function sendPayment({ commit, dispatch }, payload) {
  try {
    const { txHash } = await apiWrapper(
      { commit, dispatch },
      api.apiPostPayment(payload),
      { blocking: true },
    );
    commit(types.UI_START_LOADING_TX);
    commit(types.PAYMENT_SET_PENDING_HASH, txHash);
    const { from, to, value } = payload;
    commit(types.PAYMENT_SET_PENDING_TX_INFO, { from, to, value });
    await EthHelper.waitForTxToBeMined(txHash);
    commit(types.UI_STOP_LOADING_TX);
    return txHash;
  } catch (error) {
    commit(types.UI_STOP_ALL_LOADING);
    commit(types.UI_ERROR_MSG, error.message || error);
    throw error;
  }
}

export async function sendEthPayment({ commit, dispatch, rootState }, payload) {
  try {
    const {
      from,
      to,
      value,
      txHash,
    } = payload;
    const apiPayload = {
      locale: rootState.ui.locale,
      ...payload,
    };
    await apiWrapper({ commit, dispatch }, api.apiPostEthPayment(apiPayload), { blocking: true });
    commit(types.UI_START_LOADING_TX);
    commit(types.PAYMENT_SET_PENDING_HASH, txHash);
    commit(types.PAYMENT_SET_PENDING_TX_INFO, { from, to, value });
    await EthHelper.waitForTxToBeMined(txHash);
    commit(types.UI_STOP_LOADING_TX);
    return txHash;
  } catch (error) {
    commit(types.UI_STOP_ALL_LOADING);
    commit(types.UI_ERROR_MSG, error.message || error);
    throw error;
  }
}

export async function checkCoupon({ commit, dispatch }, code) {
  return apiWrapper({ commit, dispatch }, api.apiCheckCoupon(code));
}

export async function claimCoupon({ commit, dispatch }, { coupon, to }) {
  try {
    const { txHash } = await apiWrapper(
      { commit, dispatch },
      api.apiClaimCoupon(coupon, to),
      { blocking: true },
    );
    commit(types.UI_START_LOADING_TX);
    commit(types.PAYMENT_SET_PENDING_HASH, txHash);
    commit(types.PAYMENT_SET_PENDING_TX_INFO, { to });
    await EthHelper.waitForTxToBeMined(txHash);
    commit(types.UI_STOP_LOADING_TX);
    return txHash;
  } catch (error) {
    commit(types.UI_STOP_ALL_LOADING);
    let message = error.message || error;
    if (error.message === 'expired') message = 'Error: Coupon already expire';
    commit(types.UI_ERROR_MSG, message);
    throw new Error(message);
  }
}

export const closeTxToolbar = ({ commit }) => {
  commit(types.PAYMENT_SET_PENDING_HASH, '');
};

export async function queryTxHistoryByAddr({ commit, dispatch }, { addr, ts, count }) {
  return apiWrapper({ commit, dispatch }, api.apiQueryTxHistoryByAddr(addr, ts, count));
}

export async function purchaseIAP({ commit, dispatch }, { id, payload }) {
  return apiWrapper({ commit, dispatch }, api.apiPurchaseIAP(id, payload), { blocking: true });
}

export async function queryIAPProducts({ commit, dispatch }) {
  return apiWrapper({ commit, dispatch }, api.apiQueryIAPProducts());
}

export async function queryEthPrice({ commit, dispatch }) {
  try {
    const [data] = await apiWrapper({ commit, dispatch }, api.apiQueryEthPrice());
    return data.price_usd;
  } catch (err) {
    return 1;
  }
}

export async function queryTokensaleInitial({ commit }) {
  try {
    const data = await apiWrapper(commit, api.apiQueryTokensaleInitial(), { slient: true });
    return new BigNumber(data.initial);
  } catch (err) {
    return INITIAL_TOKENSALE_ETH;
  }
}
