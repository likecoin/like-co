import {
  LIKECOIN_CHAIN_ID,
  LIKECOIN_CHAIN_RPC,
  LIKECOIN_CHAIN_API,
  LIKECOIN_CHAIN_DENOM,
  LIKECOIN_CHAIN_MIN_DENOM,
  CIVIC_LIKER_V3_STAKING_ENDPOINT,
  EXTERNAL_URL,
} from '.';

const { IS_TESTNET } = process.env;

export const LIKECOIN_WALLET_CONNECTOR_CONFIG = {
  chainId: LIKECOIN_CHAIN_ID,
  chainName: IS_TESTNET ? 'LikeCoin public test chain' : 'LikeCoin',
  rpcURL: LIKECOIN_CHAIN_RPC,
  restURL: LIKECOIN_CHAIN_API,
  coinType: 118,
  coinDenom: LIKECOIN_CHAIN_DENOM,
  coinMinimalDenom: LIKECOIN_CHAIN_MIN_DENOM,
  coinDecimals: 9,
  coinGeckoId: IS_TESTNET ? '' : 'likecoin',
  walletURLForStaking: CIVIC_LIKER_V3_STAKING_ENDPOINT,
  bech32PrefixAccAddr: 'like',
  bech32PrefixAccPub: 'likepub',
  bech32PrefixValAddr: 'likevaloper',
  bech32PrefixValPub: 'likevaloperpub',
  bech32PrefixConsAddr: 'likevalcons',
  bech32PrefixConsPub: 'likevalconspub',
  availableMethods: [
    'liker-id',
    'keplr',
    'keplr-mobile',
    'cosmostation',
    'cosmostation-mobile',
    'likerland-app',
    'leap',
    'metamask-leap',
    'walletconnect-v2',
  ],
  keplrInstallCTAPreset: 'origin',
  likerLandAppWCBridge: 'https://wc-bridge-1.like.co',
  walletConnectProjectId: 'e110ac49451fee41d5bcda1b0dfdb94e',
  walletConnectMetadata: {
    description: 'LikeCoin - Decentralized Publishing Infrastructure',
    url: 'https://like.co',
    icons: ['https://like.co/logo.png'],
    name: 'LikeCoin',
  },
  cosmostationDirectSignEnabled: true,
  authcoreClientId: 'likecoin-app-hidesocial', // 'likecoin-app' if show all
  authcoreApiHost: IS_TESTNET
    ? 'https://likecoin-integration-test.authcore.io'
    : 'https://authcore.like.co',
  authcoreRedirectUrl: `${EXTERNAL_URL}/in/register?redirect_sign_in=1&method=liker-id`,
};
export default LIKECOIN_WALLET_CONNECTOR_CONFIG;
