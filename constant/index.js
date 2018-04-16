import BigNumber from 'bignumber.js';
import moment from 'moment';

export const { IS_TESTNET } = process.env;

export const ETHERSCAN_HOST = IS_TESTNET ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io';

export const INFURA_HOST = IS_TESTNET ? 'https://rinkeby.infura.io/ywCD9mvUruQeYcZcyghk' : 'https://mainnet.infura.io/ywCD9mvUruQeYcZcyghk';

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const W3C_EMAIL_REGEX = IS_TESTNET ? '.*' : '^[a-zA-Z0-9.!#$%&\'*/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';

export const PUBSUB_TOPIC_MISC = 'misc';

export const ONE_LIKE = new BigNumber(10).pow(18);

const whiteList = ['oicetest.lakoo.com', 'oice.com', 'like.co', 'rinkeby.like.co'];
if (IS_TESTNET) whiteList.push('localhost');

export const REDIRECT_WHITE_LIST = whiteList;

export const REDIRECT_NAME_WHITE_LIST = ['in-tokensale', 'in-bundle'];

export const TRANSACTION_QUERY_LIMIT = 10;

export const KYC_ETH_LIMIT = 10;

export const KYC_STATUS_ENUM = {
  NONE: 0,
  PENDING: 1,
  STANDARD: 2,
  ADVANCED: 3,
};

export const ETH_TO_LIKECOIN_RATIO = 40000;
export const INITIAL_TOKENSALE_ETH = new BigNumber(5400);

export const SALE_DATE_ANNOUNCE_DATE = moment('2018-04-13T18:00:00+0800');
export const SALE_DATE = moment('2018-04-23T12:00:00+0800');


const toolbarsDisableError = {
  'in-whitepaper': ['web3', 'testnet', 'locked'],
  'verify-uuid': ['web3', 'locked'],
  'in-tx-id': ['web3', 'locked'],
  id: ['web3', 'testnet', 'locked'],
  'id-amount': ['web3', 'testnet', 'locked'],
  'claim-id-coupon': ['web3', 'locked'],
  'in-backer': ['web3', 'testnet', 'locked'],
  'in-tokensale': ['web3', 'testnet', 'locked'],
  'in-tokensale-tx-id': ['web3', 'locked'],
};
export const getToolbarsDisableError = route => (toolbarsDisableError[route] || false);

export const GETTING_STARTED_TASKS = ['taskTelegram', 'taskVideo', 'taskTokensale'];
