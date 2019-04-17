import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';

import * as To from './to';
import * as From from './from';
import * as Value from './value';
import * as Receipt from './receipt';


const state = {
  abiDecoder: null,
  web3: null,
  handlers: {
    ETH: [
      To.getEthTxTo,
      From.getTxFrom,
      Value.getEthTxValue,
      Receipt.getEthTxReceipt,
    ],
    Transfer: [
      To.getLikeCoinTxTo,
      From.getTxFrom,
      Value.getLikeCoinTxValue,
      Receipt.getTxReceipt,
    ],
    Delegated: [
      To.getLikeCoinTxTo,
      From.getDelegatedTxFrom,
      Value.getLikeCoinTxValue,
      Receipt.getDelegatedTxReceipt,
    ],
    Lock: [
      To.getLikeCoinTxTo,
      From.getTxFrom,
      Value.getLikeCoinTxValue,
      Receipt.getLockTxReceipt,
    ],
    Multiple: [
      To.getMultipleTxTo,
      From.getTxFrom,
      Value.getMultipleTxValue,
      Receipt.getMultipleTxReceipt,
    ],
  },
};


/**
 * Initialize the transaction info handler.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 */
export function init(abiDecoder, web3) {
  if (state.abiDecoder === null) {
    state.abiDecoder = abiDecoder;
  }
  if (state.web3 === null) {
    state.web3 = web3;
  }
}

/**
 * Retrieve the transaction type.
 *
 * @param {object} t The transaction object.
 * @return {string} 'ETH'|'Transfer'|'Delegated'|'Lock'|'Multiple'
 *
 * @throws Will throw an error if abi-decoder is not initialized.
 * @throws Will throw an error if the contract address is not matched.
 * @throws Will throw an error if the transaction is invalid.
 */
export function getTxType(t) {
  if (t.value > 0) return 'ETH';
  if (t.to.toLowerCase() !== LIKE_COIN_ADDRESS.toLowerCase()) {
    throw new Error('Not LikeCoin transaction');
  }
  if (state.abiDecoder === null) throw new Error('abi-decoder should be initialized before using');
  const decoded = state.abiDecoder.decodeMethod(t.input);
  if (decoded.name === 'transfer') return 'Transfer';
  if (decoded.name === 'transferDelegated') return 'Delegated';
  if (decoded.name === 'transferAndLock') return 'Lock';
  if (decoded.name === 'transferMultiple') return 'Multiple';
  throw new Error('Not LikeCoin Store transaction');
}

/**
 * Extract the `to` information from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {object} t The transaction object.
 * @returns {string|array} The (array of) `to` information.
 */
export function getTxTo(type, t) {
  return state.handlers[type][0](state.abiDecoder, state.web3, t);
}

/**
 * Extract the `from` information from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {object} t The transaction object.
 * @returns {string} The `from` information.
 */
export function getTxFrom(type, t) {
  return state.handlers[type][1](state.abiDecoder, state.web3, t);
}

/**
 * Extract the `value` information from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {object} t The transaction object.
 * @returns {string|array} The (array of) `value` information.
 */
export function getTxValue(type, t) {
  return state.handlers[type][2](state.abiDecoder, t);
}

/**
 * Extract the receipt from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {object} t The transaction object.
 * @param {object} r The transaction receipt object.
 * @param {object} block The block object.
 * @param {string|array} to The (array of) `to` information.
 * @param {string} from The `from` information.
 * @param {string|array} value The (array of) `value` information.
 * @returns {object} The receipt object.
 *
 * @throws Will throw an error if the transaction data cannot be fetched.
 * @throws Will throw an error if the receipt cannot be parsed.
 *
 * @see {@link Receipt/formatReceipt}
 */
export function getTxReceipt(type, t, r, block, to, from, value) {
  return state.handlers[type][3](
    state.abiDecoder,
    state.web3,
    t,
    r,
    block,
    to,
    from,
    value,
  );
}
