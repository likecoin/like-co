import { EXTERNAL_URL } from '@/constant';

export const ISCN_PUBLISHERS = {
  matters: {
    license: 'matters',
    description: 'Matters is a decentralized, cryptocurrency driven content creation and discussion platform.',
    id: 'https://matters.news/',
    name: 'Matters',
  },
  wordpress: {
    license: 'wordpress',
    description: 'WordPress (WP, WordPress.org) is a free and open-source content management system',
    name: 'WordPress',
  },
};

export const ISCN_LICENSES = {
  matters: {
    '/': 'QmRvpQiiLA8ttSLAXEd5RArmXeG4qWEsKPmrB7KeiLSuE4',
  },
  wordpress: {
    '/': 'QmZhRNkZaSnhDr6gBC22zwhTjsGyUx39tm8gjFYnTr2SjN',
  },
  default: {
    '/': 'QmZhRNkZaSnhDr6gBC22zwhTjsGyUx39tm8gjFYnTr2SjN',
  },
};

export const ISCN_RPC_URL = `${EXTERNAL_URL}/api/cosmos/rpc`;
