import { AuthCoreKeyVaultClient, AuthCoreCosmosProvider } from 'authcore-js';
import * as types from '@/store/mutation-types';
import { AUTHCORE_API_HOST, COSMOS_CHAIN_ID } from '@/constant';

export async function setAuthCoreToken({ commit }, accessToken) {
  commit(types.AUTHCORE_SET_ACCESS_TOKEN, accessToken);
}

export async function initAuthCoreCosmosWallet({ commit, state }) {
  const keyVaultClient = await new AuthCoreKeyVaultClient({
    apiBaseURL: AUTHCORE_API_HOST,
    accessToken: state.accessToken,
  });
  const walletSubprovider = await new AuthCoreCosmosProvider({
    authcoreClient: keyVaultClient,
    authcoreWidgetsUrl: `${AUTHCORE_API_HOST}/widgets`,
    container: '',
    chainId: COSMOS_CHAIN_ID,
  });
  const { length } = await walletSubprovider.getAddresses();
  if (!length) {
    await keyVaultClient.createSecret('HD_KEY', 16);
  }
  commit(types.AUTHCORE_SET_KV_CLIENT, keyVaultClient);
  commit(types.AUTHCORE_SET_COSMOS_PROVIDER, walletSubprovider);
}

export async function fetchAuthCoreCosmosWallet({ state }) {
  if (!state.cosmosProvider) return null;
  const [cosmosAddress] = await state.cosmosProvider.getAddresses();
  return cosmosAddress;
}
