/* eslint-disable */
// assert that a transaction was sent successful
export function assertOk (res) {
  if (Array.isArray(res)) {
    if (res.length === 0) throw new Error(`Error sending transaction`)

    res.forEach(assertOk)
  }

  if (res.error) {
    throw new Error(res.error)
  }

  const txRes = res.tx_response
  // Sometimes we get back failed transactions, which shows only by them having a `code` property
  if (txRes.code) {
    const message = txRes.raw_log.message
      ? JSON.parse(txRes.raw_log).message
      : txRes.raw_log
    throw new Error(message)
  }

  if (!txRes.txhash) {
    const message = txRes.message
    throw new Error(message)
  }

  return res
}

export async function queryTxInclusion (txHash, cosmosRESTURL, iterations = 60, timeout = 3000) {
  let includedTx
  while (iterations-- > 0) {
    try {
      includedTx = await fetch(`${cosmosRESTURL}/cosmos/tx/v1beta1/txs/${txHash}`)
        .then(function (response) {
          if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response.json())
          } else {
            var error = new Error(response.statusText || response.status)
            error.response = response
            return Promise.reject(error)
          }
        })
      break
    } catch (err) {
      // tx wasn't included in a block yet
      await new Promise(resolve =>
        setTimeout(resolve, timeout)
      )
    }
  }
  if (iterations <= 0) {
    throw new Error(`The transaction was still not included in a block. We can't say for certain it will be included in the future.`)
  }

  assertOk(includedTx)

  return includedTx
}
