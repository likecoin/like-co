import BigNumber from 'bignumber.js';
import { ETH_MIGRATION_MIN_LIKECOIN_AMOUNT } from '~/constant';

export const getUserInfo = state => state.user;

export const getUserId = state => (state.user || {}).user;

export const getUserIsRegistered = state => !!state.user.user;

export const getUserIsInBonusCoolDown = state => state.user.bonusCooldown;

export const getUserHasWallet = state => !!(state.user.wallet || state.user.cosmosWallet);

export const getUserIsAuthCore = state => state.user.isAuthCore;

export const getLocalWeb3Wallet = state => state.wallet;

export const getUserIsLoadingAuthPlaforms = state => (
  !state.isFetchedAuthPlatforms || state.isFetchingAuthPlatforms
);
export const getUserAuthPlatforms = state => state.authPlatforms;

export const getUserSocialPlatforms = state => state.platforms;

export const getUserSocialLinks = state => state.links;

export const getUserSocialMeta = state => state.socialMeta;

export const getUserHasPendingLike = state => state.likecoinAmountObject
  && state.likecoinAmountObject.pendingLIKE;

export const getUserLikeCoinAmountInBigNumber = state => state.likeCoinAmountInBigNumber;

export const getUserLikeCoinAmountIsZero = state => (
  !state.likeCoinAmountInBigNumber
  || state.likeCoinAmountInBigNumber.isZero()
);

export const getUserHasERC20LikeCoin = state => !!(state.likecoinAmountObject
  && state.likecoinAmountObject.walletLIKE
  && new BigNumber(state.likecoinAmountObject.walletLIKE).gte(ETH_MIGRATION_MIN_LIKECOIN_AMOUNT));

export const getUserERC20LikeCoinAmounInBigNumber = state => state.likecoinAmountObject.walletLIKE;

export const getUserAuthCoreAccessToken = state => state.authCoreAccessToken;
