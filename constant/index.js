import BigNumber from 'bignumber.js';
import moment from 'moment';

export const { IS_TESTNET } = process.env;

export const ETHERSCAN_HOST = IS_TESTNET ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io';

export const INFURA_HOST = IS_TESTNET ? 'https://rinkeby.infura.io/ywCD9mvUruQeYcZcyghk' : 'https://mainnet.infura.io/ywCD9mvUruQeYcZcyghk';

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const PUBSUB_TOPIC_MISC = 'misc';

export const ONE_LIKE = new BigNumber(10).pow(18);

const whiteList = ['oicetest.lakoo.com', 'oice.com', 'likecoin.store', 'likecoin.foundation'];
if (IS_TESTNET) whiteList.push('localhost');

export const REDIRECT_WHITE_LIST = whiteList;

export const KYC_USD_LIMIT = 100000; // TODO

export const KYC_STATUS_ENUM = {
  NONE: 0,
  PENDING: 1,
  STANDARD: 2,
  ADVANCED: 3,
};

export const ETH_TO_LIKECOIN_RATIO = 40000;
export const INITIAL_TOKENSALE_ETH = new BigNumber(5400);

export const SALE_DATE_ANNOUNCE_DATE = moment('2018-04-09T00:00:00+0800');
export const SALE_DATE = moment('2018-04-23T00:00:00+0800');
