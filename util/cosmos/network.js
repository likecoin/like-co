import { IS_TESTNET, COSMOS_DENOM } from '../../constant';

const mainConfig = {
  id: 'likecoin-mainnet-2',
  name: 'LikeCoin chain',
  website: 'https://like.co',
  apiURL: 'https://mainnet-node.like.co',
  rpcURL: 'https://mainnet-node.like.co/rpc/',
  stakingWalletURL: 'https://stake.like.co',
  stakingDenom: 'LIKE',
  coinLookup: [
    {
      viewDenom: 'LIKE',
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
  name: 'LikeCoin Taipei test chain',
  apiURL: 'https://node.testnet.like.co',
  rpcURL: 'https://node.testnet.like.co/rpc/',
  stakingWalletURL: 'https://likecoin-public-testnet-5.netlify.app/',
};

const combinedConfig = {
  ...mainConfig,
  ...(IS_TESTNET ? testnetConfig : {}),
};

export default combinedConfig;
