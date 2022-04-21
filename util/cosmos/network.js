import {
  IS_TESTNET,
  COSMOS_DENOM,
  COSMOS_VIEW_DENOM,
  EXTERNAL_HOSTNAME,
} from '../../constant';

const mainConfig = {
  id: 'likecoin-mainnet-2',
  name: 'LikeCoin chain',
  website: 'https://like.co',
  apiURL: 'https://mainnet-node.like.co',
  rpcURL: 'https://mainnet-node.like.co/rpc/',
  stakingWalletURL: 'https://stake.like.co',
  stakingDenom: COSMOS_VIEW_DENOM,
  coinLookup: [
    {
      viewDenom: COSMOS_VIEW_DENOM,
      chainDenom: COSMOS_DENOM,
      chainToViewConversionFactor: '0.000000001',
      icon: 'currencies/like.png',
      coinGeckoId: 'likecoin',
    },
  ],
  addressPrefix: 'cosmos',
};

const testnetConfig = {
  id: 'likecoin-public-testnet-5',
  name: 'LikeCoin public test chain',
  website: `https://${EXTERNAL_HOSTNAME}`,
  apiURL: 'https://node.testnet.like.co',
  rpcURL: 'https://node.testnet.like.co/rpc/',
  stakingWalletURL: 'https://likecoin-public-testnet-5.netlify.app/',
  addressPrefix: 'like',
};

const combinedConfig = {
  ...mainConfig,
  ...(IS_TESTNET ? testnetConfig : {}),
};

export default combinedConfig;
