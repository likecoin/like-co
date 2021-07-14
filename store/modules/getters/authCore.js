export const getAuthCoreAccessToken = state => state.accessToken;

export const getAuthCoreNeedReAuth = (state, getters) => {
  const isAuthCore = getters.getUserIsAuthCore;
  return isAuthCore && !state.accessToken;
};

export const getAuthCoreAuthClient = state => state.authClient;

export const getAuthCoreKVClient = state => state.kvClient;

export const getAuthCoreCosmosProvider = state => state.cosmosProvider;

export const getAuthCoreOAuthFactors = state => state.oAuthFactors;

export const getAuthCoreCurrentUser = state => state.currentUser;
