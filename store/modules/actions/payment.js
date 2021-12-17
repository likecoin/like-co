/* eslint import/prefer-default-export: "off" */

import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import {
  transfer as transferCosmos,
  transferMultiple as transferCosmosMultiple,
} from '@/util/CosmosHelper';
import {
  signISCNTx,
  calculateISCNTotalFee,
} from '@/util/cosmos/iscn/sign';
import apiWrapper from './api-wrapper';
import Keplr from '../../../util/Keplr';

export async function sendCosmosPayment(
  { commit },
  {
    signer,
    isWait = true,
    showDialogAction = true,
    isNonLikerKeplrConnected,
    ...payload
  },
) {
  try {
    const {
      from,
      to,
      tos,
      value,
      values,
      memo,
      metadata,
    } = payload;
    let txHash;
    let included;
    if (tos && values) {
      ({ txHash, included } = await transferCosmosMultiple({
        from,
        tos,
        values,
        memo,
      }, signer));
    } else {
      ({ txHash, included } = await transferCosmos({
        from,
        to,
        value,
        memo,
      }, signer));
    }
    if (metadata && !isNonLikerKeplrConnected) await api.apiPostTxMetadata(txHash, metadata);
    commit(types.UI_START_LOADING_TX, { isWait });
    commit(types.UI_SET_HIDE_TX_DIALOG_ACTION, !showDialogAction);
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

export async function calculateISCNTxTotalFee({ commit },
  { ...payload }) {
  const {
    userId,
    displayName,
    cosmosWallet,
    fingerprints,
    name,
    tags,
    type,
    license,
    publisher,
    description,
    url,
  } = payload;
  const { ISCNTotalFee } = await calculateISCNTotalFee({
    userId,
    displayName,
    cosmosWallet,
    fingerprints,
    name,
    tags,
    type,
    license,
    publisher,
    description,
    url,
  });
  commit(types.ISCN_SET_TOTAL_FEE, ISCNTotalFee);
  return ISCNTotalFee;
}

export async function sendISCNSignature(
  { commit },
  {
    // isWait = true,
    showDialogAction = true,
    signer,
    ...payload
  },
) {
  try {
    const {
      userId,
      displayName,
      fingerprints,
      name,
      tags,
      type,
      license,
      publisher,
      memo,
      description,
      cosmosWallet,
    } = payload;
    const { transactionHash } = await signISCNTx({
      userId,
      displayName,
      fingerprints,
      name,
      tags,
      type,
      license,
      publisher,
      description,
      cosmosWallet,
    }, signer, cosmosWallet, memo);
    commit(types.UI_START_LOADING_TX);
    commit(types.UI_SET_HIDE_TX_DIALOG_ACTION, !showDialogAction);
    commit(types.PAYMENT_SET_PENDING_HASH, transactionHash);
    // if (isWait) await included();
    commit(types.UI_STOP_LOADING_TX);
    return transactionHash;
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

export function setDefaultCosmosWalletSource({ commit }, defaultCosmosWalletSource) {
  commit(types.PAYMENT_SET_COSMOS_WALLET_SOURCE, defaultCosmosWalletSource);
  if (window.localStorage) {
    if (defaultCosmosWalletSource) {
      window.localStorage.setItem('defaultCosmosWalletSource', defaultCosmosWalletSource);
    } else {
      window.localStorage.removeItem('defaultCosmosWalletSource');
    }
  }
}

export function clearDefaultCosmosWalletSource({ commit }) {
  commit(types.PAYMENT_SET_COSMOS_WALLET_SOURCE, '');
  if (window.localStorage) window.localStorage.removeItem('defaultCosmosWalletSource');
}

export async function fetchCurrentCosmosWallet({ dispatch, state, getters }) {
  const isAuthCore = getters.getUserIsAuthCore;
  if (isAuthCore) {
    return dispatch('fetchAuthCoreCosmosWallet');
  }
  const { cosmosWalletSource } = state;
  switch (cosmosWalletSource) {
    case 'keplr':
      return Keplr.getWalletAddress();
    default:
  }
  return '';
}

export async function prepareCosmosTxSigner({ dispatch, state, getters }) {
  const isAuthCore = getters.getUserIsAuthCore;
  if (isAuthCore) {
    return dispatch('prepareAuthCoreCosmosTxSigner');
  }
  const { cosmosWalletSource } = state;
  switch (cosmosWalletSource) {
    case 'keplr':
    default:
      return Keplr.prepareCosmosTxSigner();
  }
}
