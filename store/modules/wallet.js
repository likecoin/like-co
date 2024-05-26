/* eslint no-shadow: "off" */
/* eslint no-param-reassign: "off" */
import { LIKECOIN_WALLET_CONNECTOR_CONFIG } from '@/constant/network';
import { signLoginMessage } from '@/util/cosmos/sign';

import * as api from '@/util/api/api';
import apiWrapper from './actions/api-wrapper';


import {
  WALLET_SET_ADDRESS,
  WALLET_SET_SIGNER,
  WALLET_SET_CONNECTOR,
  WALLET_SET_METHOD_TYPE,
  USER_SET_USER_INFO,
  WALLET_SET_IS_LOGGING_IN,
  WALLET_SET_IS_CONNECTING_WALLET,
} from '../mutation-types';

let likecoinWalletLib = null;

const state = () => ({
  address: '',
  isConnectingWallet: false,
  signer: null,
  connector: null,
  likerInfo: null,
  isInited: null,
  methodType: null,
  loginAddress: '',
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
  loginAddress: state => state.loginAddress,
  walletHasLoggedIn: state => !!state.address && !!state.loginAddress,
  // eslint-disable-next-line max-len
  walletIsMatchedSession: (state, getters) => getters.walletHasLoggedIn && state.address === state.loginAddress,
  getConnector: state => state.connector,
  getLikerInfo: state => state.likerInfo,
  walletEmail: state => state.email,
  walletEmailUnverified: state => state.emailUnverified,
  walletHasVerifiedEmail: state => !!state.email,
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
    state, commit, dispatch,
  }, { method, accounts, offlineSigner }) {
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
    try {
      // need to handle login api
      const payload = await signLoginMessage(state.signer, address);
      const locale = window?.sessionStorage?.getItem('language') ?? 'en';
      const data = {
        locale,
        platform: 'likeWallet',
        ...payload,
      };
      await api.apiLoginUser(data);
      await dispatch('refreshUser');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return true;
  },

  async initWalletAndLogin({ dispatch, getters }, connection) {
    const isInited = await dispatch('initWallet', connection);
    if (!isInited) return false;

    try {
      if (getters.getAddress) {
        // Re-login if the wallet address is different from session
        await dispatch('signLogin');
      }
    } catch (err) {
      const msg = (err.response && err.response.data) || err;
      // eslint-disable-next-line no-console
      console.error(msg);
    }
    return true;
  },

  async restoreSession({ dispatch }) {
    // HACK: check for localStorage session before init-ing wallet connector lib
    // wallet connector lib is a huge js
    let hasSession = false;
    try {
      if (window.localStorage) {
        hasSession = !!window.localStorage.getItem(
          'likecoin_wallet_connector_session',
        );
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    if (!hasSession) return;
    const connector = await dispatch('getConnector');
    const session = connector.restoreSession();
    if (session) {
      const { accounts, method } = session;
      await dispatch('initWallet', { accounts, method });
    }
  },

  async handleConnectorRedirect(
    { dispatch },
    { method, params },
  ) {
    const connector = await dispatch('getConnector');
    const connection = await connector.handleRedirect(method, params);
    if (connection) {
      await dispatch('initWallet', connection);
    }
    return connection;
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

  async disconnectWallet({ state, commit, dispatch }) {
    if (state.connector) {
      state.connector.disconnect();
    }
    commit(WALLET_SET_ADDRESS, '');
    commit(WALLET_SET_SIGNER, null);
    commit(WALLET_SET_CONNECTOR, null);
    await dispatch('walletLogout');
  },

  async signLogin({ state, commit, dispatch }) {
    // Do not trigger login if the window is not focused
    if (document.hidden) return;
    if (!state.signer) {
      await dispatch('initIfNecessary');
    }
    const { address } = state;
    try {
      commit(WALLET_SET_IS_LOGGING_IN, true);
      const { signer, methodType } = state;
      const data = await signLoginMessage(signer, address);
      // need to handle login api
      await (api.apiLoginUser({
        loginMethod: methodType,
        ...data,
      }));
    } catch (error) {
      commit(USER_SET_USER_INFO, null);
      if (error.message === 'Request rejected') {
        // User rejected login request
      } else {
        // eslint-disable-next-line no-console
        console.error(error);
        throw error;
      }
    } finally {
      await dispatch('refreshUser');
      commit(WALLET_SET_IS_LOGGING_IN, false);
    }
  },


  async initIfNecessary({ dispatch }, { isLogin = false } = {}) {
    const connector = await dispatch('getConnector');
    const connection = await connector.initIfNecessary();
    if (connection) {
      if (isLogin) {
        await dispatch('initWalletAndLogin', connection);
      } else {
        await dispatch('initWallet', connection);
      }
    }
  },

  async walletLogout({ commit, dispatch }) {
    commit(USER_SET_USER_INFO, null);
    // need to handle logout api
    await apiWrapper({ commit, dispatch }, api.apiLogoutUser(), { blocking: true });
  },
};

export default {
  actions,
  getters,
  state,
  mutations,
};
