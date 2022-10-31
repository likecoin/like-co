/* eslint import/prefer-default-export: "off" */

import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import {
  transfer as transferCosmos,
  transferMultiple as transferCosmosMultiple,
  broadcast as broadcastCosmos,
} from '@/util/CosmosHelper';
import {
  signISCNTx,
  calculateISCNTotalFee,
  preformatISCNPayload,
} from '@/util/cosmos/iscn/sign';
import apiWrapper from './api-wrapper';
import Keplr from '../../../util/Keplr';

export async function sendCosmosPayment(
  { commit },
  {
    signer,
    isWait = true,
    showDialogAction = true,
    ...payload
  },
) {
  const {
    from,
    to,
    tos,
    value,
    values,
    memo,
    metadata,
    shouldShowTxDialog = true,
  } = payload;
  try {
    commit(types.UI_SET_SIGN_FINISH, false);
    commit(types.UI_SET_TX_FAILED, false);
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
      const txRaw = await transferCosmos(
        {
          from,
          to,
          value,
          memo,
          signOnly: true,
        },
        signer,
      );
      if (!txRaw) { throw new Error('TX_SIGN_FAILED_UNKNOWN'); }
      commit(types.UI_SET_SIGN_FINISH, true);
      ({ txHash, included } = await broadcastCosmos(txRaw));
      commit(types.UI_SET_SIGN_FINISH, false);
    }
    if (metadata) await api.apiPostTxMetadata(txHash, metadata);
    if (shouldShowTxDialog) {
      commit(types.UI_START_LOADING_TX, { isWait });
      commit(types.UI_SET_HIDE_TX_DIALOG_ACTION, !showDialogAction);
      commit(types.PAYMENT_SET_PENDING_HASH, txHash);
      commit(types.PAYMENT_SET_PENDING_TX_INFO, { from, to, value });
      if (isWait) await included();
      commit(types.UI_STOP_LOADING_TX);
    }
    commit(types.UI_SET_TX_FAILED, false);
    return txHash;
  } catch (error) {
    if (shouldShowTxDialog) {
      commit(types.UI_STOP_ALL_LOADING);
      commit(types.UI_ERROR_MSG, error.message || error);
    }
    commit(types.UI_SET_TX_FAILED, true);
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
    authorDescription,
    description,
    url,
    recordNotes,
    memo,
  } = payload;
  const tx = preformatISCNPayload({
    userId,
    displayName,
    cosmosWallet,
    fingerprints,
    name,
    tags,
    type,
    license,
    publisher,
    authorDescription,
    description,
    url,
    recordNotes,
  });
  const { ISCNTotalFee } = await calculateISCNTotalFee(tx, { memo });
  commit(types.ISCN_SET_TOTAL_FEE, ISCNTotalFee);
  return ISCNTotalFee;
}

export async function sendISCNSignature(
  { commit },
  {
    iscnId = '',
    isWait = true,
    showDialogAction = true,
    signer,
    ...payload
  },
) {
  const {
    userId,
    displayName,
    fingerprints,
    name,
    tags,
    type,
    license,
    publisher,
    author,
    authorDescription,
    description,
    cosmosWallet,
    recordNotes,
    url,
    memo,
    shouldShowTxDialog = true,
  } = payload;
  try {
    const tx = preformatISCNPayload({
      userId,
      displayName,
      fingerprints,
      name,
      tags,
      type,
      license,
      publisher,
      author,
      authorDescription,
      description,
      url,
      cosmosWallet,
      recordNotes,
    });
    const txRaw = await signISCNTx(tx, signer, cosmosWallet, { iscnId, memo, broadcast: false });
    if (!txRaw) { throw new Error('TX_SIGN_FAILED_UNKNOWN'); }
    commit(types.UI_SET_SIGN_FINISH, true);
    const { txHash, included } = await broadcastCosmos(txRaw);
    commit(types.UI_SET_SIGN_FINISH, false);
    if (shouldShowTxDialog) {
      commit(types.UI_START_LOADING_TX);
      commit(types.UI_SET_HIDE_TX_DIALOG_ACTION, !showDialogAction);
      commit(types.PAYMENT_SET_PENDING_HASH, txHash);
      if (isWait) await included();
      commit(types.UI_STOP_LOADING_TX);
    }
    if (!txHash) {
      commit(types.UI_SET_TX_FAILED, true);
    }
    return txHash;
  } catch (error) {
    if (shouldShowTxDialog) {
      commit(types.UI_STOP_ALL_LOADING);
      commit(types.UI_ERROR_MSG, error.message || error);
    }
    commit(types.UI_SET_TX_FAILED, true);
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

export function setDefaultCosmosWalletSource({ commit }, { source, persistent = true }) {
  commit(types.PAYMENT_SET_COSMOS_WALLET_SOURCE, source);
  if (persistent && window.localStorage) {
    if (source) {
      window.localStorage.setItem('defaultCosmosWalletSource', source);
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
  const { cosmosWalletSource } = state;
  switch (cosmosWalletSource) {
    case 'keplr':
      return Keplr.getWalletAddress();
    case 'authcore':
    default: {
      const isAuthCore = getters.getUserIsAuthCore;
      if (isAuthCore) {
        return dispatch('fetchAuthCoreLikeWallet');
      }
      return '';
    }
  }
}

export async function prepareCosmosTxSigner({ dispatch, state, getters }) {
  const { cosmosWalletSource } = state;
  switch (cosmosWalletSource) {
    case 'keplr':
      return Keplr.prepareCosmosTxSigner();
    case 'authcore':
    default: {
      const isAuthCore = getters.getUserIsAuthCore;
      if (isAuthCore) {
        return dispatch('prepareAuthCoreCosmosTxSigner');
      }
      throw new Error('CANNOT_GET_TX_SIGNER');
    }
  }
}

export async function prepareCosmosMessageSigner({ dispatch, state, getters }) {
  const { cosmosWalletSource } = state;
  switch (cosmosWalletSource) {
    case 'keplr':
      return s => Keplr.signLogin(s);
    case 'authcore': {
      const isAuthCore = getters.getUserIsAuthCore;
      if (isAuthCore) {
        return s => dispatch('signLoginMessage', s);
      }
      throw new Error('CANNOT_GET_TX_SIGNER');
    }
    default: throw new Error('CANNOT_GET_TX_SIGNER');
  }
}
