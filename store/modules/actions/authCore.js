import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import * as types from '@/store/mutation-types';
import { AUTHCORE_API_HOST } from '@/constant';
import { formatDesmosChainLinkProof } from '../../../util/cosmos/desmos';
import { convertAddressPrefix } from '../../../util/CosmosHelper';

const { AuthcoreVaultClient, AuthcoreCosmosProvider } = require('@likecoin/secretd-js');

let cosmLib = null;
let authcoreLib = null;

async function getCosmLib() {
  if (!cosmLib) {
    cosmLib = await import(/* webpackChunkName: "cosmjs" */ '@cosmjs/proto-signing');
  }
  return cosmLib;
}

async function getAuthcoreLib() {
  if (!authcoreLib) {
    authcoreLib = await import(/* webpackChunkName: "authcore" */ '@likecoin/authcore-js');
  }
  return authcoreLib;
}

export async function fetchAuthCoreAccessTokenAndUser({ dispatch }, code) {
  const authcore = await getAuthcoreLib();
  const authClient = await new authcore.AuthCoreAuthClient({
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

export async function forceAuthCoreReAuth({ commit }, forceReAuth = true) {
  commit(types.AUTHCORE_SET_FORCE_REAUTH, forceReAuth);
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
  const authcore = await getAuthcoreLib();
  const authClient = await new authcore.AuthCoreAuthClient({
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
  const { kvClient, cosmosProvider } = state;
  if (kvClient && cosmosProvider) return;
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

export async function fetchAuthCoreLikeWallet({ state }) {
  if (!state.cosmosProvider) return null;
  const [cosmosAddress] = await state.cosmosProvider.getAddresses();
  const likeAddress = convertAddressPrefix(cosmosAddress);
  return likeAddress;
}

export async function prepareAuthCoreCosmosTxSigner({ state }) {
  if (!state.cosmosProvider) throw new Error('COSMOS_WALLET_NOT_INITED');
  const { cosmosProvider } = state;
  const [{ address }] = cosmosProvider.wallets;
  const likeAddress = convertAddressPrefix(address);
  return {
    signAmino: async (_, data) => {
      const { signatures, ...signed } = await cosmosProvider.sign(data, likeAddress);
      return { signed, signature: signatures[0] };
    },
    signDirect: async (_, data) => {
      const cosm = await getCosmLib();
      const dataToSign = cosm.makeSignBytes(data);
      const { signed, signatures } = await cosmosProvider.directSign(dataToSign, likeAddress);
      const decodedSigned = SignDoc.decode(signed);
      return { signed: decodedSigned, signature: signatures[0] };
    },
    getAccounts: async () => {
      const pubkey = {
        type: 'tendermint/PubKeySecp256k1',
        value: cosmosProvider.wallets[0].publicKey,
      };
      const pubkeyBytes = Buffer.from(pubkey.value, 'base64');
      return [{
        algo: 'secp256k1',
        address: likeAddress,
        pubkey: pubkeyBytes,
      }];
    },
  };
}

export async function signAuthCoreAddressProof({ state }) {
  if (!state.cosmosProvider) throw new Error('COSMOS_WALLET_NOT_INITED');
  const { cosmosProvider } = state;
  const [cosmosAddress] = await cosmosProvider.getAddresses();
  const { signatures, signed } = await cosmosProvider.directSign(cosmosAddress, cosmosAddress);
  const plaintext = Buffer.from(signed).toString('hex');
  const [{ signature, pub_key: pubKey }] = signatures;
  const signatureHex = Buffer.from(signature, 'base64').toString('hex');
  const proof = {
    plain_text: plaintext,
    pub_key: pubKey,
    signature: signatureHex,
  };
  return formatDesmosChainLinkProof(cosmosAddress, proof);
}
