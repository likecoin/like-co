import { COSMOS_CHAIN_ID, COSMOS_DENOM } from '@/constant';
import { timeout } from '@/util/misc';

let Cosmos;
let api;

async function initCosmos() {
  if (api) return;
  ([Cosmos] = await Promise.all([
    import(/* webpackChunkName: "web3" */ '@lunie/cosmos-api'),
  ]));
  if (Cosmos.default) Cosmos = Cosmos.default;
  api = new Cosmos('/api/cosmos/lcd', COSMOS_CHAIN_ID);
}

function LIKEToNanolike(value) {
  return `${Number.parseInt(value, 10).toString()}000000000`;
}

export function LIKEToAmount(value) {
  return { denom: COSMOS_DENOM, amount: LIKEToNanolike(value) };
}

export function amountToLIKE(likecoin) {
  if (likecoin.denom === 'nanolike') {
    return (Number.parseFloat(likecoin.amount) / 1e9);
  }
  console.error(`${likecoin.denom} is not supported denom`);
  return -1;
}

export async function getTransactionCompleted(txHash) {
  if (!api) await initCosmos();
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
  if (!api) await initCosmos();
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
      value: {
        msg: [{
          value: {
            amount: [amount],
            from_address: from,
            to_address: to,
          },
        }],
      },
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
    timestamp: (new Date(timestamp)).getTime() / 1000,
  };
}

export async function queryLikeCoinBalance(addr) {
  if (!api) await initCosmos();
  const { account } = await api.get.account(addr);
  if (!account) return 0;
  const [{ amount }] = account.coins.filter(coin => coin.denom === COSMOS_DENOM);
  return amountToLIKE(amount);
}

export async function sendTx(msgCallPromise, signer) {
  const { simulate, send } = await msgCallPromise;
  const gas = (await simulate({})).toString();
  const { hash, included } = await send({ gas }, signer);
  return { txHash: hash, included };
}

export function transfer({ from, to, value }, signer) {
  const amount = LIKEToAmount(value);
  const msgPromise = api.MsgSend(from, { toAddress: to, amounts: [amount] });
  return sendTx(msgPromise, signer);
}
