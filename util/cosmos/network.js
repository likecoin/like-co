export default {
  id: 'likecoin-chain-sheungwan', // DEPRECATE, only used for Lunie extension, NOT CHAIN ID
  name: 'LikeCoin chain',
  description:
      'LikeCoin is a Decentralized Publishing Infrastructure for Decentralized Archive, Decentralized Rewards, Decentralized Curation and Decentralized Governance.',
  logo: 'logo.svg',
  website: 'https://like.co',
  apiURL: 'https://mainnet-node.like.co', // use `npx lcp --proxyUrl http://34.123.30.100:1317`
  rpcURL: 'ws://mainnet-node.like.co:26657',
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
