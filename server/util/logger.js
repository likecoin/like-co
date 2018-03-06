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

export async function logPaymentTx(payload) {
  return logTransferDelegatedTx(payload); // dummy function
}
