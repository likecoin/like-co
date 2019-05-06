import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin-address';

import * as To from './to';
import * as From from './from';
import * as Value from './value';
import * as Receipt from './receipt';


const handlers = {
  ETH: {
    to: To.getEthTxTo,
    from: From.getTxFrom,
    value: Value.getEthTxValue,
    receipt: Receipt.getEthTxReceipt,
  },
  Transfer: {
    to: To.getLikeCoinTxTo,
    from: From.getTxFrom,
    value: Value.getLikeCoinTxValue,
    receipt: Receipt.getTxReceipt,
  },
  Delegated: {
    to: To.getLikeCoinTxTo,
    from: From.getDelegatedTxFrom,
    value: Value.getLikeCoinTxValue,
    receipt: Receipt.getDelegatedTxReceipt,
  },
  Lock: {
    to: To.getLikeCoinTxTo,
    from: From.getTxFrom,
    value: Value.getLikeCoinTxValue,
    receipt: Receipt.getLockTxReceipt,
  },
  Multiple: {
    to: To.getMultipleTxTo,
    from: From.getTxFrom,
    value: Value.getMultipleTxValue,
    receipt: Receipt.getMultipleTxReceipt,
  },
};


/**
 * Retrieve the transaction type.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {object} t The transaction object.
 * @return {string} 'ETH'|'Transfer'|'Delegated'|'Lock'|'Multiple'
 *
 * @throws Will throw an error if abi-decoder is not initialized.
 * @throws Will throw an error if the contract address is not matched.
 * @throws Will throw an error if the transaction is invalid.
 */
export function getTxType(abiDecoder, t) {
  if (t.value > 0) return 'ETH';
  if (t.to.toLowerCase() !== LIKE_COIN_ADDRESS.toLowerCase()) {
    throw new Error('Not LikeCoin transaction');
  }
  if (abiDecoder === null) throw new Error('abi-decoder should be initialized before using');
  const decoded = abiDecoder.decodeMethod(t.input);
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
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {string|array} The (array of) `to` information.
 */
export function getTxTo(type, abiDecoder, web3, t) {
  return handlers[type].to(abiDecoder, web3, t);
}

/**
 * Extract the `from` information from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {string} The `from` information.
 */
export function getTxFrom(type, abiDecoder, web3, t) {
  return handlers[type].from(abiDecoder, web3, t);
}

/**
 * Extract the `value` information from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {object} t The transaction object.
 * @returns {string|array} The (array of) `value` information.
 */
export function getTxValue(type, abiDecoder, t) {
  return handlers[type].value(abiDecoder, t);
}

/**
 * Extract the basic information from the transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {object} { type, _to, _from, _value }
 *
 * @throws Will throw an error if abi-decoder is not initialized.
 * @throws Will throw an error if the contract address is not matched.
 * @throws Will throw an error if the transaction is invalid.
 *
 * @see {@link getTxType}
 * @see {@link getTxTo}
 * @see {@link getTxFrom}
 * @see {@link getTxValue}
 */
export function getTxInfo(abiDecoder, web3, t) {
  const type = getTxType(abiDecoder, t);
  return {
    type,
    _to: getTxTo(type, abiDecoder, web3, t),
    _from: getTxFrom(type, abiDecoder, web3, t),
    _value: getTxValue(type, abiDecoder, t),
  };
}

/**
 * Extract the receipt from the transaction.
 *
 * @param {string} type The type of the transaction.
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {string} txHash The transaction hash.
 * @param {object} t The transaction object.
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
export async function getTxReceipt(type, abiDecoder, web3, txHash, t, to, from, value) {
  const [r, block] = await Promise.all([
    web3.eth.getTransactionReceipt(txHash),
    web3.eth.getBlock(t.blockNumber),
  ]);
  if (!r || !Receipt.isReceiptSuccess(r)) {
    return Receipt.formatReceipt(false, r, to, from, value, null);
  }
  return handlers[type].receipt(
    abiDecoder,
    web3,
    t,
    r,
    block,
    to,
    from,
    value,
  );
}
