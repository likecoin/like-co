export const getAuthCoreAccessToken = state => state.accessToken;

export const getAuthCoreNeedReAuth = (state, getters, rootState) => {
  let cosmosWallet;
  if (rootState.user.user) {
    ({ cosmosWallet } = rootState.user.user);
  }
  return cosmosWallet && !state.accessToken;
};

export const getAuthCoreKVClient = state => state.kvClient;

export const getAuthCoreCosmosAddress = state => state.cosmosProvider;

export const getAuthCoreCosmosProvider = state => state.cosmosProvider;
