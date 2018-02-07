export const { IS_TESTNET } = process.env;

export const ETHERSCAN_HOST = IS_TESTNET ? 'https://rinkeby.etherscan.io' : 'https://etherscan.io';

export const INFURA_HOST = IS_TESTNET ? 'https://rinkeby.infura.io/ywCD9mvUruQeYcZcyghk' : 'https://mainnet.infura.io/ywCD9mvUruQeYcZcyghk';
