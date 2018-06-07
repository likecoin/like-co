import { IS_TESTNET } from '@/constant';

const getTestAttribute = name => (
  IS_TESTNET ?
    {
      'lc-test': name,
    } :
    null
);

export default getTestAttribute;
