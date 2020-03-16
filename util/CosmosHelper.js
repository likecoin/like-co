import BigNumber from 'bignumber.js';
import {
  COSMOS_CHAIN_ID,
  COSMOS_DENOM,
} from '@/constant';
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
  return (new BigNumber(value)).multipliedBy(1e9).toFixed();
}

export function LIKEToAmount(value) {
  return { denom: COSMOS_DENOM, amount: LIKEToNanolike(value) };
}

export function amountToLIKE(likecoin) {
  if (likecoin.denom === 'nanolike') {
    return (new BigNumber(likecoin.amount)).dividedBy(1e9).toFixed();
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
        msg,
      },
    },
  } = txData;
  let amount = [];
  let from = [];
  let to = [];
  if (msg.length > 1) {
    msg.forEach((m) => {
      const {
        value: {
          amount: [a],
          from_address: f,
          to_address: t,
        },
      } = m;
      amount.push(a);
      from.push(f);
      to.push(t);
    });
  } else {
    ([{
      value: {
        amount: [amount],
        from_address: from,
        to_address: to,
      },
    }] = msg);
  }
  if (Array.isArray(from)) [from] = from; // TODO: support multiple from addr?
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
  const account = await api.get.account(addr);
  const [amount] = account.coins.filter(coin => coin.denom === COSMOS_DENOM);
  if (!amount) return 0;
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

async function MsgSendMultiple(
  senderAddress,
  {
    toAddresses,
    amounts,
  },
) {
  const totalValue = amounts.reduce((acc, amount) => acc.plus(amount.amount), new BigNumber(0));
  const outputs = [];
  toAddresses.forEach((target, index) => {
    outputs.push({
      address: target,
      coins: [amounts[index]],
    });
  });
  const message = {
    type: 'cosmos-sdk/MsgMultiSend',
    value: {
      inputs: [
        {
          address: senderAddress,
          coins: [
            {
              denom: COSMOS_DENOM,
              amount: totalValue.toFixed(),
            },
          ],
        },
      ],
      outputs,
    },
  };
  return {
    message,
    simulate: ({ memo = undefined }) => {
      let base = 30000;
      const numberOfReceivers = message.value.outputs.length;
      if (numberOfReceivers) base += numberOfReceivers * 8000;
      if (memo && memo.length) base += memo.length * 100;
      return Math.floor(base * 1.2);
    },
    send: (
      { gas, gasPrices, memo = undefined },
      signer,
    ) => api.send(senderAddress, { gas, gasPrices, memo }, message, signer),
  };
}

export function transferMultiple({ from, tos, values }, signer) {
  const amounts = values.map(v => LIKEToAmount(v));
  const msgPromise = MsgSendMultiple(from, { toAddresses: tos, amounts });
  return sendTx(msgPromise, signer);
}
