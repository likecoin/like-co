import { IS_TESTNET } from '../../constant';

const mainConfig = {
  id: 'likecoin-chain-sheungwan',
  name: 'LikeCoin chain',
  description:
      'LikeCoin is a Decentralized Publishing Infrastructure for Decentralized Archive, Decentralized Rewards, Decentralized Curation and Decentralized Governance.',
  logo: 'logo.svg',
  website: 'https://like.co',
  apiURL: 'https://mainnet-node.like.co',
  rpcURL: 'ws://mainnet-node.like.co:26657',
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
  validatorAddressPrefix: 'cosmosvaloper',
  validatorConsensusaddressPrefix: 'cosmosvalcons',
  HDPath: "m/44'/118'/0'/0/0",
  lockUpPeriod: '21 days',
  fees: {
    default: {
      gasEstimate: 350000,
      feeOptions: [
        {
          denom: 'LIKE',
          amount: '0.00000001',
        },
      ],
    },
  },
  icon: 'https://like.co/logo.png',
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
