export const getAuthCoreAccessToken = state => state.accessToken;

export const getAuthCoreNeedReAuth = (state, getters, rootState) => {
  let isAuthCore;
  if (rootState.user.user) {
    ({ isAuthCore } = rootState.user.user);
  }
  return isAuthCore && !state.accessToken;
};

export const getAuthCoreKVClient = state => state.kvClient;

export const getAuthCoreCosmosAddress = state => state.cosmosProvider;

export const getAuthCoreCosmosProvider = state => state.cosmosProvider;
