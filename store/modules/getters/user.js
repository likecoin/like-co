export const getUserInfo = state => state.user;

export const getUserId = state => (state.user || {}).user;

export const getUserIsRegistered = state => !!state.user.user;

export const getUserIsInBonusCoolDown = state => state.user.bonusCooldown;

export const getUserHasWallet = state => !!(state.user.wallet || state.user.cosmosWallet);

export const getLocalWeb3Wallet = state => state.wallet;

export const getUserIsLoadingAuthPlaforms = state => (
  !state.isFetchedAuthPlatforms || state.isFetchingAuthPlatforms
);
export const getUserAuthPlatforms = state => state.authPlatforms;

export const getUserSocialPlatforms = state => state.platforms;

export const getUserSocialLinks = state => state.links;

export const getUserSocialMeta = state => state.socialMeta;

export const getUserLikeCoinAmountInBigNumber = state => state.likeCoinAmountInBigNumber;

export const getUserLikeCoinAmountIsZero = state => (
  !state.likeCoinAmountInBigNumber
  || state.likeCoinAmountInBigNumber.isZero()
);
