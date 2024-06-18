import {
  LOGIN_MESSAGE,
  REDIRECT_NAME_WHITE_LIST,
} from '@/constant';

import * as types from '@/store/mutation-types';

import * as api from '@/util/api/api';
import { getFrontendMode } from '@/util/client';
import {
  setLoggerUser,
  setUserProperties,
} from '@/util/EventLogger';
import Keplr from '@/util/Keplr';
import User from '@/util/User';
import WalletConnect from '@/util/WalletConnect';

import apiWrapper from './api-wrapper';

export function doUserAuth({ dispatch }, { router, route }) {
  dispatch('savePostAuthRoute', { route });
  router.push({ name: 'in-register', query: route.query });
}

export function savePostAuthRoute({ commit }, { route }) {
  if (route) {
    const {
      params,
      name,
      query,
      hash,
    } = route;
    commit(types.USER_SET_AFTER_AUTH_ROUTE, {
      params,
      name,
      query,
      hash,
    });
    if (window.sessionStorage) {
      window.sessionStorage.setItem(
        'USER_POST_AUTH_ROUTE',
        JSON.stringify({
          name,
          params,
          query,
          hash,
        }),
      );
    }
  } else if (window.sessionStorage) {
    window.sessionStorage.removeItem(
      'USER_POST_AUTH_ROUTE',
    );
  }
}

export function doPostAuthRedirect({ commit, state }, { route, router }) {
  let targetRoute = state.preAuthRoute;
  if (window.sessionStorage) {
    if (!targetRoute) {
      const routeString = window.sessionStorage.getItem(
        'USER_POST_AUTH_ROUTE',
      );
      try {
        if (routeString) {
          targetRoute = JSON.parse(routeString);
        }
      } catch (err) {
        console.error(err);
      }
    }
    window.sessionStorage.removeItem('USER_POST_AUTH_ROUTE');
  }
  if (!targetRoute) targetRoute = { name: 'in', query: { postlogin: 1 } };
  if (route) {
    const {
      query,
      hash,
    } = route;
    if (query.ref) {
      const newQuery = Object.assign({}, query);
      delete newQuery.ref;
      if (newQuery.from) delete newQuery.from;
      targetRoute = {
        name: query.ref,
        query: newQuery,
        hash,
      };
    }
  }
  if (route.name !== targetRoute.name) {
    router.push(targetRoute);
  }
  commit(types.USER_SET_AFTER_AUTH_ROUTE, null);
}

export async function newUser({ commit, dispatch }, data) {
  await apiWrapper(
    { commit, dispatch },
    api.apiPostNewUser(data),
    { slient: true, error: 'raw' },
  );
  const cosmosWalletSource = data.cosmosWalletSource || 'authcore';
  dispatch('setDefaultCosmosWalletSource', { source: cosmosWalletSource });
  await dispatch('refreshUser');
  return true;
}

export async function updateUser({ commit, dispatch }, data) {
  await apiWrapper(
    { commit, dispatch },
    api.apiPostUpdateUser(data),
    { blocking: true },
  );
  await dispatch('refreshUser');
  return true;
}

export async function updateUserAvatar({ commit, dispatch }, data) {
  await apiWrapper(
    { commit, dispatch },
    api.apiPostUpdateUserAvatar(data),
    { blocking: true },
  );
  await dispatch('refreshUser');
  return true;
}

export async function syncAuthCoreUser({ commit, dispatch, rootState }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiSyncAuthCoreUser({ authCoreAccessToken: rootState.authCore.accessToken }),
    { blocking: true },
  );
  await dispatch('refreshUser');
}

export async function loginUser({ dispatch }, data) {
  await api.apiLoginUser(data);
  await dispatch('refreshUser');
  const cosmosWalletSource = data.cosmosWalletSource || 'authcore';
  dispatch('setDefaultCosmosWalletSource', { source: cosmosWalletSource });
  return true;
}

export async function logoutUser({ commit, dispatch, state }, data) {
  const { isAuthCore } = state.user;
  await apiWrapper({ commit, dispatch }, api.apiLogoutUser(data), { blocking: true });
  commit(types.USER_SET_USER_INFO, {});
  commit(types.UI_INFO_MSG, '');
  if (isAuthCore) await dispatch('authCoreLogoutUser');
  dispatch('clearDefaultCosmosWalletSource');
  dispatch('disconnectWallet');
  return true;
}

export async function loginUserBySign({ state, dispatch }) {
  let payload;
  try {
    payload = await User.signLogin(state.wallet);
  } catch (e) {
    // rejected signing, return false;
    return false;
  }
  if (!payload) return false;

  await api.apiLoginUser(payload);
  await dispatch('refreshUser');
  return true;
}

export function resetLoginByCosmosWallet({ commit }) {
  commit(types.USER_SET_WALLET_CONNECT_URI, '');
  commit(types.USER_SET_WALLET_CONNECT_CONNECTING, false);
}

export async function loginByCosmosWallet({ commit }, {
  source,
  isRetry = false,
} = {}) {
  let walletAddress = '';
  let signer;
  let payload;
  switch (source) {
    case 'walletconnect': {
      await WalletConnect.init({
        open: (uri) => {
          commit(types.USER_SET_WALLET_CONNECT_URI, uri);
        },
        close: (connected) => {
          commit(types.USER_SET_WALLET_CONNECT_URI, '');
          if (connected) {
            commit(types.USER_SET_WALLET_CONNECT_URI, '');
            commit(types.USER_SET_WALLET_CONNECT_CONNECTING, true);
          }
        },
        isConnectOnly: true,
        isRetry,
      });
      payload = await WalletConnect.requestForLogin(LOGIN_MESSAGE);
      walletAddress = payload.from;
      break;
    }

    case 'keplr': {
      await Keplr.initKeplr();
      walletAddress = await Keplr.getWalletAddress();
      signer = s => Keplr.signLogin(s);
      break;
    }
    default: throw new Error('UNKNOWN_COSMOS_WALLET_SOURCE');
  }
  const platform = walletAddress.startsWith('like') ? 'likeWallet' : 'cosmosWallet';
  if (!payload) {
    payload = await User.signCosmosLogin(
      walletAddress,
      signer,
      platform,
    );
  }
  if (source === 'walletconnect') {
    commit(types.USER_SET_WALLET_CONNECT_CONNECTING, false);
  }
  return {
    platform,
    wallet: walletAddress,
    payload: {
      cosmosWalletSource: source,
      ...payload,
    },
  };
}

export async function onWalletChanged({ commit }, wallet) {
  commit(types.USER_SET_LOCAL_WALLET, wallet);
}

export async function refreshUser({ commit, state, dispatch }) {
  try {
    const { data: user } = await api.apiGetUserSelf();
    const oldUser = state.user.user;
    const currentUser = (user || {}).user;
    if (user && user.user) {
      dispatch('queryLikeCoinWalletBalance');
      commit(types.USER_SET_USER_INFO, user);
      await setLoggerUser(this, { wallet: user.likeWallet });
      setUserProperties({ frontend_mode: getFrontendMode() });
    } else {
      commit(types.USER_SET_USER_INFO, {});
    }
    if (currentUser !== oldUser) {
      commit(types.UI_INFO_MSG, '');
    }
    if (user && user.locale) {
      dispatch('setLocale', user.locale);
    }
  } catch (error) {
    console.error(error);
    commit(types.USER_SET_USER_INFO, {});
    // do nothing
  }
}

export async function refreshUserInfo({ commit, dispatch }) {
  const user = await apiWrapper({ commit, dispatch }, api.apiGetUserSelf(), { slient: true });
  if (user) {
    commit(types.USER_SET_USER_INFO, user);
  }
  if (user && user.locale) {
    dispatch('setLocale', user.locale);
  }
}

export async function getWalletByUser(ctx, id) {
  const { wallet } = await apiWrapper(ctx, api.apiGetUserById(id), { blocking: true });
  return wallet;
}

export async function sendVerifyEmail({ commit, dispatch, rootState }, { id, ref }) {
  let redirect = '';
  if (REDIRECT_NAME_WHITE_LIST.indexOf(ref) > -1) redirect = ref;
  return apiWrapper(
    { commit, dispatch },
    api.apiSendVerifyEmail(id, redirect, rootState.ui.locale),
    { blocking: true },
  );
}

export async function verifyEmailByUUID({ commit, dispatch, rootState }, uuid) {
  return apiWrapper(
    { commit, dispatch },
    api.apiVerifyEmailByUUID(uuid, rootState.ui.locale),
    { blocking: true, error: 'raw' },
  );
}

export async function getMiniUserById({ commit, dispatch }, id) {
  return apiWrapper({ commit, dispatch }, api.apiGetUserMinById(id), { slient: true });
}

export async function sendInvitationEmail({ commit, dispatch, rootState }, data) {
  return apiWrapper(
    { commit, dispatch },
    api.apiSendInvitationEmail(data.user, data.email, rootState.ui.locale),
    { blocking: true },
  );
}

export async function queryLikeCoinWalletBalance({ commit }) {
  try {
    const { data } = await api.apiGetUserLikeAmount();
    commit(types.USER_SET_LIKECOIN_AMOUNT_OBJECT, data);
  } catch (err) {
    console.error(err);
  }
}

export async function updateUserReadContentStatus({ commit, dispatch }, { id, payload }) {
  try {
    await apiWrapper({ commit, dispatch }, api.apiPostUserReadContent(id, payload));
    commit(types.USER_UPDATE_READ_CONTENT_STATUS, payload);
  } catch (err) {
    console.error(err);
  }
}

export async function joinCivicLikerTrialEvent({ commit, dispatch }, eventId) {
  const data = await apiWrapper(
    { commit, dispatch },
    api.apiJoinCivicLikerTrialEventById(eventId),
    {
      blocking: true,
      slientError: true,
      error: 'raw',
    },
  );
  dispatch('refreshUser');
  return data;
}

export async function queueCivicLiker({ commit, dispatch }, { queryString }) {
  const data = await apiWrapper(
    { commit, dispatch },
    api.apiQueueCivicLikerWaitingList(queryString),
    {
      blocking: true,
      slientError: true,
    },
  );
  dispatch('refreshUser');
  return data;
}

export async function dequeueCivicLiker({ commit, dispatch }, { queryString }) {
  const data = await apiWrapper(
    { commit, dispatch },
    api.apiDequeueCivicLikerWaitingList(queryString),
  );
  await dispatch('refreshUser');
  return data;
}

export async function fetchPreferences({ commit, dispatch }) {
  const data = await apiWrapper(
    { commit, dispatch },
    api.apiFetchPreferences(),
  );
  return data;
}

export async function updatePreferences({ commit, dispatch }, payload) {
  await apiWrapper(
    { commit, dispatch },
    api.apiUpdatePreferences(payload),
  );
}
