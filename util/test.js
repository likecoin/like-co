import { IS_TESTNET } from '@/constant';

const getTestAttribute = prefix => testId => (
  IS_TESTNET ? ({
    'lc-test': `${prefix}-${testId}`,
  }) : (
    null
  )
);

export default getTestAttribute;
