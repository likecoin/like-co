/* eslint import/prefer-default-export: "off" */

import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import { transfer as transferCosmos } from '@/util/CosmosHelper';
import apiWrapper from './api-wrapper';

export async function sendCosmosPayment(
  { commit },
  { signer, isWait = true, ...payload },
) {
  try {
    const { from, to, value } = payload;
    const { txHash, included } = await transferCosmos({ from, to, value }, signer);
    commit(types.UI_START_LOADING_TX);
    commit(types.PAYMENT_SET_PENDING_HASH, txHash);
    commit(types.PAYMENT_SET_PENDING_TX_INFO, { from, to, value });
    if (isWait) await included();
    commit(types.UI_STOP_LOADING_TX);
    return txHash;
  } catch (error) {
    commit(types.UI_STOP_ALL_LOADING);
    commit(types.UI_ERROR_MSG, error.message || error);
    throw error;
  }
}

export const closeTxToolbar = ({ commit }) => {
  commit(types.PAYMENT_SET_PENDING_HASH, '');
};

export async function queryTxHistoryByAddr({ commit, dispatch }, { addr, ts, count }) {
  return apiWrapper({ commit, dispatch }, api.apiQueryTxHistoryByAddr(addr, ts, count));
}

export async function queryTxHistoryByUserId({ commit, dispatch }, { id, ts, count }) {
  return apiWrapper({ commit, dispatch }, api.apiQueryTxHistoryByUserId(id, ts, count));
}
