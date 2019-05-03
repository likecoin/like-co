/**
 * Extract the `to` information from the ETH transaction.
 *
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {string} The `to` information.
 */
export function getEthTxTo(_, web3, t) {
  return web3.utils.toChecksumAddress(t.to);
}

/**
 * Extract the `to` information from the general LikeCoin transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {string} The `to` information.
 */
export function getLikeCoinTxTo(abiDecoder, web3, t) {
  const decoded = abiDecoder.decodeMethod(t.input);
  const txTo = decoded.params.find(p => p.name === '_to').value;
  return web3.utils.toChecksumAddress(txTo);
}

/**
 * Extract the `to` information from the `transferMultiple` transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @returns {array} The array of `to` information.
 */
export function getMultipleTxTo(abiDecoder, web3, t) {
  const decoded = abiDecoder.decodeMethod(t.input);
  const txTo = decoded.params.find(p => p.name === '_addrs').value;
  txTo.forEach((to, index) => {
    txTo[index] = web3.utils.toChecksumAddress(to);
  });
  return txTo;
}
