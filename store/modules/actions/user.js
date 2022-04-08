import * as api from '@/util/api/api';
import * as types from '@/store/mutation-types';
import { REDIRECT_NAME_WHITE_LIST } from '@/constant';

import User from '@/util/User';
import Keplr from '@/util/Keplr';
import WalletConnect from '@/util/WalletConnect';
import { setTrackerUser } from '@/util/EventLogger';

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
  router.push(targetRoute);
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

export async function linkWalletToUser({ commit, dispatch }, payload) {
  await apiWrapper({ commit, dispatch }, api.apiLinkAuthPlatform('wallet', payload), { blocking: true });
  await dispatch('refreshUser');
  return true;
}

export async function linkUserAuthPlatform({ commit, dispatch }, { platform, payload }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiLinkAuthPlatform(platform, payload),
    { blocking: true },
  );
  await dispatch('refreshUser');
  return true;
}

export async function unlinkUserAuthPlatform({ commit, dispatch }, { platform }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiUnlinkAuthPlatform(platform),
    { blocking: true },
  );
  await dispatch('refreshUser');
  return true;
}


export async function logoutUser({ commit, dispatch, state }, data) {
  const { isAuthCore } = state.user;
  await apiWrapper({ commit, dispatch }, api.apiLogoutUser(data), { blocking: true });
  commit(types.USER_SET_USER_INFO, {});
  commit(types.UI_INFO_MSG, '');
  if (isAuthCore) await dispatch('authCoreLogoutUser');
  dispatch('clearDefaultCosmosWalletSource');
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

export async function loginByCosmosWallet(_, source) {
  let payload;
  switch (source) {
    case 'walletconnect': {
      await WalletConnect.init();
      payload = await User.signCosmosLogin(
        await WalletConnect.getWalletAddress(),
        s => WalletConnect.signLogin(s),
      );
      break;
    }

    case 'keplr': {
      await Keplr.initKeplr();
      payload = await User.signCosmosLogin(
        await Keplr.getWalletAddress(),
        s => Keplr.signLogin(s),
      );
      break;
    }
    default: throw new Error('UNKNOWN_COSMOS_WALLET_SOURCE');
  }
  return { cosmosWalletSource: source, ...payload };
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
      await dispatch('fetchSocialListDetailsById', user.user);
      commit(types.USER_SET_USER_INFO, user);
      await setTrackerUser(user);
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

export async function fetchtSocialListById({ commit, dispatch }, id) {
  const platforms = await apiWrapper({ commit, dispatch }, api.apiGetSocialListById(id));
  commit(types.USER_SET_SOCIAL, platforms);
  return true;
}

export async function fetchSocialListDetailsById({ commit, dispatch }, id) {
  const payload = await apiWrapper({ commit, dispatch }, api.apiGetSocialListDetialsById(id));
  commit(types.USER_SET_SOCIAL_DETAILS, payload);
}

export async function fetchAuthPlatformsById({ commit, dispatch }, id) {
  commit(types.USER_SET_AUTH_PLATFORMS, { isFetching: true });
  const platforms = await apiWrapper({ commit, dispatch }, api.apiFetchLinkedAuthPlatforms(id));
  commit(types.USER_SET_AUTH_PLATFORMS, { platforms });
}


export async function fetchSocialPlatformLink({ commit, dispatch }, { platform, id }) {
  return apiWrapper({ commit, dispatch }, api.apiGetSocialPlatformLink(platform, id));
}

export async function linkSocialPlatform({ commit, dispatch }, { platform, payload }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiLinkSocialPlatform(platform, payload),
  );
  await dispatch('refreshUser');

  return true;
}

export async function unlinkSocialPlatform({ commit, dispatch }, { platform, payload }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiUnlinkSocialPlatform(platform, payload),
  );
  commit(types.USER_UNLINK_SOCIAL, platform);

  await dispatch('refreshUser');
}

export async function selectFacebookPageLink({ commit, dispatch }, { pageId, payload }) {
  const { url } = await apiWrapper(
    { commit, dispatch },
    api.apiSelectFacebookPageLink(pageId, payload),
  );
  commit(types.USER_SELECT_FACEBOOK_PAGE_LINK, url);
}

export async function updateSocialPlatformIsPublic({ commit, dispatch }, payload) {
  await apiWrapper(
    { commit, dispatch },
    api.apiPostSocialPlatformsIsPublic(payload),
  );
  commit(types.USER_SET_SOCIAL_PLATFORMS_IS_PUBLIC, payload);
}

export async function addUserSocialLink({ commit, dispatch }, payload) {
  const link = await apiWrapper(
    { commit, dispatch },
    api.apiPostAddUserSocialLink(payload),
  );
  commit(types.USER_ADD_SOCIAL_LINK, link);
}

export async function updateUserSocialLink({ commit, dispatch }, { linkId, payload }) {
  await apiWrapper(
    { commit, dispatch },
    api.apiPostUpdateUserSocialLink(linkId, payload),
  );
  commit(types.USER_SET_SOCIAL_LINK, payload.link);
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
