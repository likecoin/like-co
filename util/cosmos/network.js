import { IS_TESTNET } from '../../constant';

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
      chainDenom: 'nanolike',
      chainToViewConversionFactor: '0.000000001',
      icon: 'currencies/like.png',
      coinGeckoId: 'likecoin',
    },
  ],
  addressPrefix: 'cosmos',
};

const testnetConfig = {
  id: 'iscn-dev-chain-2',
  name: 'LikeCoin ISCN Dev Chain', // TO-DO
  apiURL: 'https://node.iscn-dev-2.like.co',
  rpcURL: 'https://node.iscn-dev-2.like.co/rpc/',
  stakingWalletURL: 'http://likecoin-chain-taipei2.netlify.app/', // TO-DO
};

const combinedConfig = {
  ...mainConfig,
  ...(IS_TESTNET ? testnetConfig : {}),
};

export default combinedConfig;
