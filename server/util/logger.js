const dbRef = require('../util/firebase').txCollection;

export async function logTransferDelegatedTx(payload) {
  const {
    txHash,
    from,
    to,
    value,
  } = payload;
  try {
    await dbRef.doc(txHash).create({
      type: 'transferDelegated',
      from,
      to,
      value,
      ts: Date.now(),
    });
  } catch (err) {
    console.error(err);
  }
}

export async function logPaymentTx(payload) {
  return logTransferDelegatedTx(payload); // dummy function
}
