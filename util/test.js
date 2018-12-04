import { IS_TESTNET } from '@/constant';

export function getSingleTestAttribute(identitier) {
  return IS_TESTNET ? { 'lc-test': identitier } : null;
}

const getTestAttribute = prefix => testId => getSingleTestAttribute(`${prefix}-${testId}`);

export default getTestAttribute;
