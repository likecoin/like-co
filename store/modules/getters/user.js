export const getUserInfo = state => state.user;

export const getUserId = state => (state.user || {}).user;

export const getUserNeedAuth = state => state.isAwaitingAuth;

export const getUserIsRegistered = state => !!state.user.user;

export const getUserIsInBonusCoolDown = state => state.user.bonusCooldown;

export const getLocalWallet = state => state.wallet;

export const getUserSocialPlatforms = state => state.platforms;

export const getUserSocialLinks = state => state.links;

export const getUserSocialMeta = state => state.socialMeta;

export const getUserLikeCoinAmountInBigNumber = state => state.likeCoinAmountInBigNumber;
