/**
 * Check whether the receipt succeeded.
 *
 * @param {object} txReceipt The transaction receipt object.
 * @returns {bool} Whether the receipt is succeeded.
 */
export function isReceiptSuccess(txReceipt) {
  return txReceipt && txReceipt.status !== false && txReceipt.status !== 0 && txReceipt.status !== '0x0';
}

/**
 * Construct the receipt object.
 *
 * @param {bool} isEth Whether the transaction is for ETH.
 * @param {object} r The transaction receipt object.
 * @param {string|array} to The (array of) `to` information.
 * @param {string} from The `from` information.
 * @param {string|array} value The (array of) `value` information.
 * @param {object} block The block object.
 * @returns {object} The receipt object:
 *   {
 *     isEth: Whether the transaction is for ETH
 *     isFailed: Whether the receipt is succeeded
 *     _to: The (array of) `to` information
 *     _from: The `from` information
 *     _value: The (array of) `value` information
 *     timestamp: The timestamp
 *   }
 */
export function formatReceipt(isEth, r, to, from, value, block) {
  return {
    isEth,
    isFailed: r && !isReceiptSuccess(r),
    _to: to,
    _from: from,
    _value: value,
    timestamp: block ? block.timestamp : 0,
  };
}

/**
 * Extract the receipt from the ETH transaction.
 *
 * @param {web3} web3 The Web3 instance.
 * @param {object} r The transaction receipt object.
 * @param {object} block The block object.
 * @param {string} value The `value` information.
 * @returns {object} The receipt object.
 *
 * @see {@link formatReceipt}
 */
export function getEthTxReceipt(_abiDecoder, web3, _t, r, block, _to, _from, value) {
  const to = web3.utils.toChecksumAddress(r.to);
  const from = web3.utils.toChecksumAddress(r.from);
  return formatReceipt(true, r, to, from, value, block);
}

/**
 * Extract the receipt from the `transfer` transaction.
 *
 * @param {object} r The transaction receipt object.
 * @param {object} block The block object.
 * @param {string} to The `to` information.
 * @param {string} from The `from` information.
 * @param {string} value The `value` information.
 * @returns {object} The receipt object.
 *
 * @see {@link formatReceipt}
 */
export function getTxReceipt(_abiDecoder, _web3, _t, r, block, to, from, value) {
  return formatReceipt(false, r, to, from, value, block);
}

/**
 * Extract the receipt from the `transferDelegated` transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} t The transaction object.
 * @param {object} r The transaction receipt object.
 * @param {object} block The block object.
 * @returns {object} The receipt object.
 *
 * @throws Will throw an error if the transaction data cannot be fetched.
 * @throws Will throw an error if the receipt cannot be parsed.
 *
 * @see {@link formatReceipt}
 */
export function getDelegatedTxReceipt(abiDecoder, web3, t, r, block) {
  const decoded = abiDecoder.decodeMethod(t.input);
  const txTo = decoded.params.find(p => p.name === '_to').value;
  if (!r.logs || !r.logs.length) throw new Error('Cannot fetch transaction Data');
  const logs = abiDecoder.decodeLogs(r.logs);
  const targetLogs = logs.filter(l => (l.events.find(e => e.name === 'to').value.toLowerCase()) === txTo.toLowerCase());
  if (!targetLogs || !targetLogs.length) throw new Error('Cannot parse receipt');
  const [log] = targetLogs;
  return formatReceipt(
    false,
    r,
    web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'to')).value),
    web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'from')).value),
    log.events.find(p => (p.name === 'value')).value,
    block,
  );
}

/**
 * Extract the receipt from the `transferAndLock` transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} r The transaction receipt object.
 * @param {object} block The block object.
 * @param {string} from The `from` information.
 * @returns {object} The receipt object.
 *
 * @throws Will throw an error if the transaction data cannot be fetched.
 * @throws Will throw an error if the receipt cannot be parsed.
 *
 * @see {@link formatReceipt}
 */
export function getLockTxReceipt(abiDecoder, web3, _t, r, block, _to, from) {
  if (!r.logs || !r.logs.length) throw new Error('Cannot fetch transaction Data');
  const logs = abiDecoder.decodeLogs(r.logs);
  const targetLogs = logs.filter(l => (l.name === 'Transfer'));
  if (!targetLogs || !targetLogs.length) throw new Error('Cannot parse receipt');
  const [log] = targetLogs;
  return formatReceipt(
    false,
    r,
    web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'to')).value),
    from,
    log.events.find(p => (p.name === 'value')).value,
    block,
  );
}

/**
 * Extract the receipt from the `transerMultiple` transaction.
 *
 * @param {abi-decoder} abiDecoder The ABI decoder for Etherem transactions.
 * @param {web3} web3 The Web3 instance.
 * @param {object} r The transaction receipt object.
 * @param {object} block The block object.
 * @param {string} from The `from` information.
 * @returns {object} The receipt object.
 *
 * @throws Will throw an error if the transaction data cannot be fetched.
 * @throws Will throw an error if the receipt cannot be parsed.
 *
 * @see {@link formatReceipt}
 */
export function getMultipleTxReceipt(abiDecoder, web3, _t, r, block, _to, from) {
  if (!r.logs || !r.logs.length) throw new Error('Cannot fetch transaction Data');
  const logs = abiDecoder.decodeLogs(r.logs);
  const targetLogs = logs.filter(l => (l.name === 'Transfer'));
  if (!targetLogs || !targetLogs.length) throw new Error('Cannot parse receipt');
  const to = [];
  const value = [];
  targetLogs.forEach((log) => {
    to.push(web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'to')).value));
    value.push(log.events.find(p => (p.name === 'value')).value);
  });
  return formatReceipt(false, r, to, from, value, block);
}
