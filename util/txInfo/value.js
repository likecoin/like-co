/**
 * Extract the `value` information from the ETH transaction.
 *
 * @param {object} t The transaction object.
 * @returns {string} The `value` information.
 */
export function getEthTxValue(_, t) {
  return t.value;
}

/**
 * Extract the `value` information from the general LikeCoin transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {object} t The transaction object.
 * @returns {string} The `value` information.
 */
export function getLikeCoinTxValue(abiDecoder, t) {
  const decoded = abiDecoder.decodeMethod(t.input);
  return decoded.params.find(p => p.name === '_value').value;
}

/**
 * Extract the `value` information from the `transferMultiple` transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {object} t The transaction object.
 * @returns {array} The array of `value` information.
 */
export function getMultipleTxValue(abiDecoder, t) {
  const decoded = abiDecoder.decodeMethod(t.input);
  return decoded.params.find(p => p.name === '_values').value;
}
