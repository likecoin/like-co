import BigNumber from 'bignumber.js';
import {
  ONE_LIKE,
  ETH_MIGRATION_MIN_LIKECOIN_AMOUNT,
} from '~/constant';

export const getUserInfo = state => state.user;

export const getUserId = state => (state.user || {}).user;

export const getUserIsRegistered = state => !!state.user.user;

export const getUserIsInBonusCoolDown = state => state.user.bonusCooldown;

export const getUserHasWallet = state => !!(state.user.wallet || state.user.cosmosWallet);

export const getUserIsAuthCore = state => state.user.isAuthCore;

export const getUserIsLegacy = (state) => {
  const {
    wallet,
    isAuthCore,
    cosmosWallet,
  } = state.user;
  return wallet && !(isAuthCore || cosmosWallet);
};

export const getLocalWeb3Wallet = state => state.wallet;

export const getUserIsLoadingAuthPlaforms = state => (
  !state.isFetchedAuthPlatforms || state.isFetchingAuthPlatforms
);
export const getUserAuthPlatforms = state => state.authPlatforms;

export const getUserSocialPlatforms = state => state.platforms;

export const getUserSocialLinks = state => state.links;

export const getUserSocialMeta = state => state.socialMeta;

export const getUserHasPendingLike = state => state.likecoinAmountObject
  && state.likecoinAmountObject.pendingLIKE
  && state.likecoinAmountObject.pendingLIKE > 0;

export const getUserLikeCoinAmountInBigNumber = state => state.likeCoinAmountInBigNumber;

export const getUserLikeCoinAmountIsZero = state => (
  !state.likeCoinAmountInBigNumber
  || state.likeCoinAmountInBigNumber.isZero()
);

export const getUserHasERC20LikeCoin = (state) => {
  const { likecoinAmountObject } = state;
  if (!likecoinAmountObject) return false;
  const { walletLIKE } = likecoinAmountObject;
  if (!walletLIKE || !(walletLIKE > 0)) return false;
  return new BigNumber(walletLIKE).multipliedBy(ONE_LIKE).gte(ETH_MIGRATION_MIN_LIKECOIN_AMOUNT);
};

export const getUserERC20LikeCoinAmounInBigNumber = state => state.likecoinAmountObject.walletLIKE;

export const getUserAuthCoreAccessToken = state => state.authCoreAccessToken;
