import Cosmos from '@lunie/cosmos-api';
import { COSMOS_CHAIN_ID, COSMOS_DENOM } from '@/constant';
import { timeout } from '@/util/misc';

const api = new Cosmos('/api/cosmos/lcd', COSMOS_CHAIN_ID);

export function amountToLIKE(likecoin) {
  if (likecoin.denom === 'nanolike') {
    return (Number.parseFloat(likecoin.amount) / 1e9);
  }
  console.error(`${likecoin.denom} is not supported denom`);
  return -1;
}

export async function getTransactionCompleted(txHash) {
  const txData = await api.get.tx(txHash);
  if (!txData || !txData.height) {
    return 0;
  }
  const {
    timestamp,
    code,
    logs: [{ success = false } = {}] = [],
  } = txData;
  return {
    ts: (new Date(timestamp)).getTime(),
    isFailed: (code && code !== '0') || !success,
  };
}

export async function getTransferInfo(txHash, opt) {
  const { blocking } = opt;
  // TODO: handle tranferMultiple?
  let txData = await api.get.tx(txHash);
  if (!txData || !txData.height) {
    return 0;
  }
  while ((!txData || !txData.height) && blocking) {
    await timeout(1000); // eslint-disable-line no-await-in-loop
    txData = await api.get.tx(txHash); // eslint-disable-line no-await-in-loop
  }
  if (!txData) throw new Error('Cannot find transaction');
  const {
    timestamp,
    code,
    logs: [{ success = false } = {}] = [],
    tx: {
      msg: [{
        value: {
          amount: [amount],
          from_address: from,
          to_address: to,
        },
      }],
    },
  } = txData;
  if (!txData.height) {
    return {
      _from: from,
      _to: to,
      _amount: amount,
    };
  }
  const isFailed = (code && code !== '0') || !success;
  return {
    isFailed,
    _from: from,
    _to: to,
    _amount: amount,
    timestamp,
  };
}

export async function queryLikeCoinBalance(addr) {
  const { account } = await api.get.account(addr);
  if (!account) return 0;
  const [{ amount }] = account.coins.filter(coin => coin.denom === COSMOS_DENOM);
  return amountToLIKE(amount);
}
