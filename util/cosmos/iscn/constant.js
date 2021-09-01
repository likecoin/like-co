import { EXTERNAL_URL, COSMOS_DENOM } from '@/constant';

export const ISCN_GAS = 200000;
export const DEFAULT_ISCN_GAS_PRICE = [{ amount: '1', denom: COSMOS_DENOM }];
export const DEFAULT_ISCN_GAS_PRICE_NUMBER = parseInt(DEFAULT_ISCN_GAS_PRICE[0].amount, 10);
export const ISCN_REGISTRY_NAME = 'likecoin-chain';
export const ISCN_PUBLISHERS = {
  matters: {
    license: 'matters',
    description: 'Matters is a decentralized, cryptocurrency driven content creation and discussion platform.',
    id: 'https://matters.news/',
    name: 'Matters',
  },
};

export const ISCN_LICENSES = {
  matters: {
    '/': 'QmRvpQiiLA8ttSLAXEd5RArmXeG4qWEsKPmrB7KeiLSuE4',
  },
  default: {
    '/': 'QmZhRNkZaSnhDr6gBC22zwhTjsGyUx39tm8gjFYnTr2SjN',
  },
};

export const ISCN_RPC_URL = `${EXTERNAL_URL}/api/cosmos/rpc`;
