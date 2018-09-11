export const getUserInfo = state => state.user;

export const getUserId = state => (state.user || {}).user;

export const getUserIsFetching = state => state.isFetching;

export const getWeb3IsFetching = state => state.web3Fetching;

export const getUserNeedAuth = state => !state.web3Fetching && state.isAwaitingAuth;

export const getUserIsReady = (state) => {
  const { web3Fetching, isFetching, isAwaitingAuth } = state;
  return !web3Fetching && !isFetching && !isAwaitingAuth;
};

export const getUserIsRegistered = state => !!state.user.wallet;

export const getUserNeedRegister = state => (getUserIsReady(state) && !getUserIsRegistered(state));

export const getUserIsInBonusCoolDown = state => state.user.bonusCooldown;

export const getLocalWallet = state => state.wallet;

export const getUserSocialPlatforms = state => state.platforms;

export const getUserSocialLinks = state => state.links;

export const getUserSocialMeta = state => state.socialMeta;

export const getUserLikeCoinAmountInBigNumber = state => state.likeCoinAmountInBigNumber;
