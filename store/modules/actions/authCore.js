import { AuthCoreAuthClient } from 'authcore-js';
import * as types from '@/store/mutation-types';
import { AUTHCORE_API_HOST, IS_TESTNET } from '@/constant';

const authcoreURL = IS_TESTNET ? 'https://likecoin-integration-test.authcore.io' : 'https://authcore.like.co';
const { AuthcoreVaultClient, AuthcoreCosmosProvider } = require('secretd-js');

export async function fetchAuthCoreAccessTokenAndUser({ dispatch }, code) {
  const authClient = await new AuthCoreAuthClient({
    apiBaseURL: AUTHCORE_API_HOST,
  });
  const token = await authClient.createAccessToken(code);
  const { access_token: accessToken, id_token: idToken } = token;
  await authClient.setAccessToken(accessToken);
  const currentUser = await dispatch('fetchAuthCoreUser', { authClient });
  return { accessToken, currentUser, idToken };
}

export async function fetchAuthCoreUser({ commit, state }, { authClient } = {}) {
  const client = authClient || state.authClient;
  if (!client) return {};
  const currentUser = await client.getCurrentUser();
  // TODO: remove camel case casting after authcore unify key style
  const {
    profile_name: profileName,
    primary_email: primaryEmail,
    primary_phone: primaryPhone,
    suggested_name: suggestedName,
    display_name: displayName,
  } = currentUser;
  const user = {
    ...currentUser,
    profileName,
    primaryEmail,
    primaryPhone,
    suggestedName,
    displayName,
  };
  commit(types.AUTHCORE_SET_CURRENT_USER, user);
  return user;
}

export async function setAuthCoreToken({ commit, state, dispatch }, accessToken) {
  commit(types.AUTHCORE_SET_ACCESS_TOKEN, accessToken);
  if (accessToken) {
    if (window.localStorage) window.localStorage.setItem('authcore.accessToken', accessToken);
    if (state.authClient) {
      state.authClient.setAccessToken(accessToken);
    } else {
      await dispatch('initAuthCoreClient');
    }
    await dispatch('initAuthCoreWalletService');
    await dispatch('fetchAuthCoreOAuthFactors');
  } else {
    if (window.localStorage) window.localStorage.removeItem('authcore.accessToken');
    await dispatch('clearAuthCoreAllClients');
  }
}

export async function authCoreLogoutUser({ commit, state, dispatch }) {
  if (state.authClient) {
    try {
      await state.authClient.signOut();
    } catch (err) {
      console.error(err);
    }
  }
  await dispatch('setAuthCoreToken', '');
  commit(types.AUTHCORE_SET_CURRENT_USER, {});
}

export async function initAuthCoreClient({ commit, state, dispatch }) {
  const { accessToken } = state;
  const authClient = await new AuthCoreAuthClient({
    apiBaseURL: AUTHCORE_API_HOST,
    callbacks: {
      unauthenticated: () => {
        dispatch('setAuthCoreToken', '');
        commit(types.AUTHCORE_SET_CURRENT_USER, {});
      },
    },
    accessToken,
  });
  commit(types.AUTHCORE_SET_AUTH_CLIENT, authClient);
}

export async function initAuthCoreWalletService({ commit, state }) {
  const keyVaultClient = await new AuthcoreVaultClient({
    apiBaseURL: AUTHCORE_API_HOST,
    accessToken: state.accessToken,
  });
  const walletSubprovider = await new AuthcoreCosmosProvider({
    client: keyVaultClient,
  });
  commit(types.AUTHCORE_SET_KV_CLIENT, keyVaultClient);
  commit(types.AUTHCORE_SET_COSMOS_PROVIDER, walletSubprovider);
}

export async function initAuthCoreCosmosWallet({ state, dispatch }) {
  let { kvClient, cosmosProvider } = state;
  try {
    if (!kvClient || !cosmosProvider) await dispatch('initAuthCoreWalletService');
    ({ kvClient, cosmosProvider } = state);
    const [cosmosAddress] = await cosmosProvider.getAddresses();
    return cosmosAddress;
  } catch (err) {
    console.error(err);
  }
  return '';
}

export async function clearAuthCoreAllClients({ commit }) {
  commit(types.AUTHCORE_SET_AUTH_CLIENT, null);
  commit(types.AUTHCORE_SET_KV_CLIENT, null);
  commit(types.AUTHCORE_SET_COSMOS_PROVIDER, null);
  commit(types.AUTHCORE_SET_OAUTH_FACTORS, null);
}

export async function fetchAuthCoreOAuthFactors({ state, commit }) {
  const platforms = await state.authClient.listOAuthFactors();
  commit(types.AUTHCORE_SET_OAUTH_FACTORS, platforms);
}

export async function fetchAuthCoreCosmosWallet({ state }) {
  if (!state.cosmosProvider) return null;
  const [cosmosAddress] = await state.cosmosProvider.getAddresses();
  return cosmosAddress;
}

export async function prepareAuthCoreCosmosTxSigner({ state, dispatch }) {
  let cosmosProvider;
  if (state.cosmosProvider) {
    cosmosProvider = state.cosmosProvider; // eslint-disable-line prefer-destructuring
  }
  if (state.accessToken) {
    cosmosProvider = await dispatch('setupCosmosProvider', state.accessToken);
  }
  if (cosmosProvider) {
    return {
      signAmino: async (_, data) => {
        const { signatures, ...signed } = await cosmosProvider.sign(data);
        return { signed, signature: signatures[0] };
      },
    };
  }
  return null;
}

export async function restoreAccessToken({ commit }) {
  if (window.localStorage) {
    const accessToken = window.localStorage.getItem('authcore.access_token');
    if (accessToken) commit('AUTHCORE_SET_ACCESS_TOKEN', accessToken);
  }
}

export async function setupCosmosProvider({ commit }, accessToken) {
  const kvClient = await new AuthcoreVaultClient({
    apiBaseURL: authcoreURL,
    accessToken,
  });
  commit('AUTHCORE_SET_KV_CLIENT', kvClient);
  const cosmosProvider = await new AuthcoreCosmosProvider({
    client: kvClient,
  });
  commit('AUTHCORE_SET_COSMOS_PROVIDER', cosmosProvider);
  return cosmosProvider;
}
