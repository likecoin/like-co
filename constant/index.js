import BigNumber from 'bignumber.js';

export const { IS_TESTNET } = process.env;

export const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.CI;

export const BONUS_ADDRESSES = IS_TESTNET
  ? ['0xC75c0b2a92fd823A05C7AE3949ad6f1aB20Dd37E', '0x1cf94c2bbA216e3f1ecff7762af47844C43d3FdA', '0x6A9e2dE467097B4D14F44944aC2a49A750Fc93b8']
  : ['0x65b8E5D9d95e707349789E42fa2f88EE5B20B072', '0x1cf94c2bbA216e3f1ecff7762af47844C43d3FdA', '0x6A9e2dE467097B4D14F44944aC2a49A750Fc93b8'];

export const ETHERSCAN_HOST = IS_TESTNET ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io';

export const INFURA_HOST = IS_TESTNET ? 'https://rinkeby.infura.io/v3/9a6771595426445cb247e83d4ad85645' : 'https://mainnet.infura.io/v3/9a6771595426445cb247e83d4ad85645';

export const ETH_NETWORK_NAME = IS_TESTNET ? 'rinkeby' : 'mainnet';

export const CONFIRMATION_NEEDED = 6;

export const EMAIL_REGEX = '^[a-zA-Z0-9.!#$%&\'*/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$';
export const W3C_EMAIL_REGEX = IS_TESTNET ? '.*' : EMAIL_REGEX;

/* TEMP: reformat medium referrer into medium post */
export const MEDIUM_REGEX = /^(?:https?:\/\/)?[^/]*\/media\/[a-zA-Z0-9_]+(?:\?postId=([a-zA-Z0-9_]+))?/;

export const PUBSUB_TOPIC_MISC = 'misc';

export const LOGIN_MESSAGE = 'Login - Reinventing the Like';

export const ONE_LIKE = new BigNumber(10).pow(18);

const whiteList = [
  'oice.com',
  'oicetest.lakoo.com',
  'like.co',
  'rinkeby.like.co',
  'button.like.co',
  'button.rinkeby.like.co',
];
if (IS_TESTNET) whiteList.push('localhost');

export const REDIRECT_WHITE_LIST = whiteList;

export const REDIRECT_NAME_WHITE_LIST = ['in-tokensale', 'in-bundle', 'in-settings'];

export const TRANSACTION_QUERY_LIMIT = 10;

export const KYC_STATUS_ENUM = {
  NONE: 0,
  PENDING: 1,
  STANDARD: 2,
  ADVANCED: 3,
};

export const ETH_TO_LIKECOIN_RATIO = 40000;
export const FINAL_TOKENSALE_ETH_VALUE = 7562.26;
export const FINAL_TOKENSALE_PERCENTAGE = 180;

export const BONUS_LOCK_UNTIL_DATE = 1540267200000;

export const GETTING_STARTED_TASKS = ['taskSocial', 'taskOnepager', 'taskVideo', 'taskPaymentPage'];

/* Dont show key if value exist
e.g. joinTokenSale also claims refereeTokenSale, so hideh refereeTokenSale */
export const MERGED_MISSIONS = {
  refereeTokenSale: 'joinTokenSale',
};

export const TRUST_URL = 'https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=';

export const EXTRA_EMAIL_BLACLIST = [
  'tutye.com',
];

export const LIQUID_LIKEETH_URL = 'https://app.liquid.com/exchange/LIKEETH';
export const WORDPRESS_PLUGIN_URL = 'https://wordpress.org/plugins/likecoin/';
export const OICE_URL = 'https://oice.com';

export const EXTERNAL_HOSTNAME = IS_TESTNET ? 'rinkeby.like.co' : 'like.co';

export const SOCIAL_MEDIA_LIST = [
  {
    id: 'likecoin',
    tier: 0,
  },
  {
    id: 'facebook',
    tier: 1,
  },
  {
    id: 'flickr',
    tier: 1,
  },
  {
    id: 'medium',
    tier: 1,
  },
  {
    id: 'twitter',
    tier: 1,
  },
];

export const LOGIN_CONNECTION_LIST = [
  'google',
  'facebook',
  'twitter',
];

export const OTHER_CONNECTION_LIST = [
  'medium',
  'flickr',
];

export const IS_LOGIN_SOCIAL = new Set(LOGIN_CONNECTION_LIST);

export const LINK_ICON_TYPES = ['profile', 'blog', 'photo', 'mail', 'contact', 'link'];

export const DISPLAY_SOCIAL_MEDIA_OPTIONS = [
  'all', // default
  'wp',
  'medium',
];

export const SUPPORTED_AVATER_TYPE = new Set([
  'jpg',
  'png',
  'gif',
  'webp',
  'tif',
  'bmp',
]);

export const AVATAR_DEFAULT_PATH = 'https://static.like.co/likecoin_de-portrait.jpg';

export const LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN = IS_TESTNET ? '*' : 'https://button.like.co';

export const WALLET_NOTICE_EXPIRY_INTERVAL = IS_TESTNET ? 300 : 604800; // In second

export const CIVIC_LIKER_START_DATE = 1546473600000; // 2019-01-03T08:00:00+0800
