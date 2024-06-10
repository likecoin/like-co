/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';

import {
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_METHOD_TYPE,
  USER_SET_USER_INFO,
  WALLET_SET_IS_LOGGING_IN,
  WALLET_SET_IS_CONNECTING_WALLET,
  AUTHCORE_SET_ACCESS_TOKEN,
} from '../mutation-types';

let likecoinWalletLib = null;

const state = () => ({
  address: '',
  isConnectingWallet: false,
  signer: null,
  connector: null,
  likerInfo: null,
  isInited: false,
  methodType: null,
  isLoggingIn: false,
});

const mutations = {
  [WALLET_SET_ADDRESS](state, address) {
    state.address = address;
  },
  [WALLET_SET_SIGNER](state, signer) {
    state.signer = signer;
  },
  [WALLET_SET_IS_CONNECTING_WALLET](state, isConnecting) {
    state.isConnectingWallet = isConnecting;
  },
  [WALLET_SET_IS_LOGGING_IN](state, isLoggingIn) {
    state.isLoggingIn = isLoggingIn;
  },
  [USER_SET_USER_INFO](state, userInfo) {
    state.likerInfo = userInfo;
  },
  [WALLET_SET_METHOD_TYPE](state, method) {
    state.methodType = method;
  },
  [WALLET_SET_CONNECTOR](state, connector) {
    state.connector = connector;
  },
};

const getters = {
  getAddress: state => state.address,
  getSigner: state => state.signer,
  walletLoginMethod: state => state.methodType,
  getConnector: state => state.connector,
  getLikerInfo: state => state.likerInfo,
  walletIsLoggingIn: state => state.isConnectingWallet || state.isLoggingIn,
};

const actions = {
  async getLikeCoinWalletLib() {
    if (!likecoinWalletLib) {
      likecoinWalletLib = await import(/* webpackChunkName: "likecoin_wallet" */ '@likecoin/wallet-connector');
    }
    return likecoinWalletLib;
  },

  async getConnector({ state, commit, dispatch }) {
    if (state.connector) {
      return state.connector;
    }
    const lib = await dispatch('getLikeCoinWalletLib');
    const connector = new lib.LikeCoinWalletConnector({
      ...LIKECOIN_WALLET_CONNECTOR_CONFIG,
    });
    commit(WALLET_SET_CONNECTOR, connector);
    return connector;
  },

  async initWallet({
    commit, dispatch,
  }, {
    method, accounts, offlineSigner,
  }) {
    if (!accounts[0]) return false;
    commit(WALLET_SET_IS_CONNECTING_WALLET, true);
    const connector = await dispatch('getConnector');
    // Listen once per account
    connector.once('account_change', async (currentMethod) => {
      const connection = await connector.init(currentMethod);
      dispatch('walletLogout');
      await dispatch('initWallet', connection);
    });
    commit(WALLET_SET_METHOD_TYPE, method);
    const { address, bech32Address } = accounts[0];
    const walletAddress = bech32Address || address;
    commit(WALLET_SET_ADDRESS, walletAddress);
    commit(WALLET_SET_SIGNER, offlineSigner);
    commit(WALLET_SET_IS_CONNECTING_WALLET, false);
    return true;
  },

  async handleConnectorRedirect(
    { dispatch },
    { method, params },
  ) {
    const connector = await dispatch('getConnector');
    const connection = await connector.handleRedirect(method, params);
    if (connection) {
      await dispatch('initWallet', connection);
      dispatch('setAccessToken', connection.params.accessToken);
    }
    return connection;
  },

  async setAccessToken({ commit }, accessToken) {
    commit(AUTHCORE_SET_ACCESS_TOKEN, accessToken);
    if (accessToken) {
      if (window.localStorage) window.localStorage.setItem('authcore.accessToken', accessToken);
    } else if (window.localStorage) window.localStorage.removeItem('authcore.accessToken');
  },

  async openConnectWalletModal(
    { commit, dispatch },
    {
      language,
      connectWalletTitle,
      connectWalletMobileWarning,
      shouldRecommendConnectionMethod = false,
      shouldShowLegacyAuthcoreOptions = false,
      onEvent,
    } = {},
  ) {
    commit(WALLET_SET_IS_CONNECTING_WALLET, true);
    const connector = await dispatch('getConnector');
    if (shouldRecommendConnectionMethod) {
      connector.options.availableMethods = [
        ['liker-id', { tier: 1, isRecommended: true }],
        'keplr',
        'keplr-mobile',
        'cosmostation',
        'cosmostation-mobile',
        'likerland-app',
        'leap',
        'metamask-leap',
        'walletconnect-v2',
      ];
    }
    if (shouldShowLegacyAuthcoreOptions) {
      connector.options.authcoreClientId = 'likecoin-app';
    }
    const connection = await connector.openConnectionMethodSelectionDialog({
      language,
      connectWalletTitle,
      connectWalletMobileWarning,
      onEvent,
    });
    commit(WALLET_SET_IS_CONNECTING_WALLET, false);
    return connection;
  },

  async openAuthcoreModal({ commit, dispatch }) {
    commit(WALLET_SET_IS_CONNECTING_WALLET, true);
    const connector = await dispatch('getConnector');
    const connection = await connector.init('liker-id');
    commit(WALLET_SET_IS_CONNECTING_WALLET, false);
    return connection;
  },

  async disconnectWallet({ dispatch, state, commit }) {
    if (state.connector) {
      state.connector.disconnect();
    }
    dispatch('setAccessToken', '');
    commit(WALLET_SET_ADDRESS, '');
    commit(WALLET_SET_SIGNER, null);
    commit(WALLET_SET_CONNECTOR, null);
  },

  async initIfNecessary({ dispatch }) {
    const connector = await dispatch('getConnector');
    const connection = await connector.initIfNecessary();
    if (connection) {
      await dispatch('initWallet', connection);
    }
  },

};

export default {
  actions,
  getters,
  state,
  mutations,
};
