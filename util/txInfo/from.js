/**
 * Extract the `from` information from the transaction.
 *
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {string} The `from` information.
 */
export function getTxFrom(_, web3, t) {
  return web3.utils.toChecksumAddress(t.from);
}

/**
 * Extract the `from` information from the `transferDelegated` transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {string} The `from` information.
 */
export function getDelegatedTxFrom(abiDecoder, web3, t) {
  const decoded = abiDecoder.decodeMethod(t.input);
  const from = decoded.params.find(p => p.name === '_from').value;
  return web3.utils.toChecksumAddress(from);
}
