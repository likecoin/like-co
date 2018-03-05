const dbRef = require('../util/firebase').txCollection;

export async function logTransferDelegatedTx(payload) {
  const { txHash } = payload;
  try {
    await dbRef.doc(txHash).create({
      type: 'transferDelegated',
      status: 'pending',
      ts: Date.now(),
      ...payload,
    });
  } catch (err) {
    console.error(err);
  }
}

export async function logETHTx(payload) {
  const {
    txHash,
    from,
    to,
    value,
    currentBlock,
    nonce,
  } = payload;
  try {
    await dbRef.doc(txHash).create({
      type: 'transfer',
      status: 'pending',
      from,
      to,
      value,
      currentBlock,
      nonce,
      ts: Date.now(),
    });
  } catch (err) {
    console.error(err);
  }
}
