import BigNumber from 'bignumber.js';
import {
  COSMOS_DENOM,
  BASIC_TRANSFER_GAS,
  EXTERNAL_URL,
} from '@/constant';
import { timeout } from '@/util/misc';
import { queryTxInclusion } from '@/util/cosmos/misc';
import {
  CosmosClient, SigningCosmosClient,
  GasPrice,
} from '@cosmjs/launchpad';

export const DEFAULT_GAS_PRICE = [{ amount: '1000', denom: COSMOS_DENOM }];
export const DEFAULT_GAS_PRICE_NUMBER = parseInt(DEFAULT_GAS_PRICE[0].amount, 10);
export const DEFAULT_ISCN_GAS_PRICE = [{ amount: 0, denom: COSMOS_DENOM }];
const COSMOS_RESTFUL_API = `${EXTERNAL_URL}/api/cosmos/lcd`;

let cosmosClient;
let signingCosmosClient;

function initCosmosClient() {
  if (cosmosClient) return;
  cosmosClient = new CosmosClient(COSMOS_RESTFUL_API);
}

function initSigningCosmosClient(url, signerAddress,
  signer, gasPrice, gasLimits, broadcastMode) {
  if (signingCosmosClient) return;
  signingCosmosClient = new SigningCosmosClient(url, signerAddress,
    signer, gasPrice, gasLimits, broadcastMode);
}

function LIKEToNanolike(value) {
  return (new BigNumber(value)).multipliedBy(1e9).toFixed();
}

export function LIKEToAmount(value) {
  return { denom: COSMOS_DENOM, amount: LIKEToNanolike(value) };
}

export function amountToLIKE(likecoin) {
  if (likecoin.denom === COSMOS_DENOM) {
    return (new BigNumber(likecoin.amount)).dividedBy(1e9).toFixed();
  }
  console.error(`${likecoin.denom} is not supported denom`);
  return -1;
}

export async function getTransactionCompleted(txHash) {
  if (!cosmosClient) await initCosmosClient();
  const txData = await cosmosClient.getTx(txHash);
  if (!txData || !txData.height) {
    return 0;
  }
  const {
    timestamp,
    code,
    rawLog,
  } = txData;
  const fullLogs = JSON.parse(rawLog);
  return {
    ts: (new Date(timestamp)).getTime(),
    isFailed: (code && code !== '0') || !fullLogs[0].success,
  };
}

export async function getTransferInfo(txHash, opt) {
  if (!cosmosClient) await initCosmosClient();
  const { blocking } = opt;
  // TODO: handle tranferMultiple?
  let txData = await cosmosClient.getTx(txHash);
  if ((!txData || !txData.height) && !blocking) {
    return {};
  }
  while ((!txData || !txData.height) && blocking) {
    await timeout(1000); // eslint-disable-line no-await-in-loop
    txData = await cosmosClient.getTx(txHash); // eslint-disable-line no-await-in-loop
  }
  if (!txData) throw new Error('Cannot find transaction');
  const {
    rawLog,
    timestamp,
    code,
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
  const fullLogs = JSON.parse(rawLog.slice(1, rawLog.length - 1));
  const isFailed = (code && code !== '0') || !fullLogs.success;
  return {
    isFailed,
    _from: from,
    _to: to,
    _amount: amount,
    timestamp: (new Date(timestamp)).getTime() / 1000,
  };
}

export async function queryLikeCoinBalance(addr) {
  if (!cosmosClient) await initCosmosClient();
  const account = await cosmosClient.getAccount(addr);
  const [amount] = account.balance.filter(balance => balance.denom === COSMOS_DENOM);
  if (!amount) return 0;
  return amountToLIKE(amount);
}

export async function calculateGas(to) {
  const fee = {
    amount: DEFAULT_GAS_PRICE,
    gas: (to.length * parseInt(BASIC_TRANSFER_GAS, 10)).toString(),
  };
  const { gas } = fee;
  const gasPrices = fee.amount;
  return { gas, gasPrices };
}

export async function transfer({
  from,
  to,
  value,
  memo,
}, signer) {
  const amount = LIKEToAmount(value);
  const { gas, gasPrices } = await calculateGas([to]);
  const fee = {
    amount: DEFAULT_GAS_PRICE,
    gas,
  };
  const gasPrice = GasPrice.fromString(DEFAULT_GAS_PRICE[0].amount.concat(COSMOS_DENOM));
  if (!signingCosmosClient) {
    await initSigningCosmosClient(COSMOS_RESTFUL_API, from, signer, gasPrice, {}, 'block');
  }
  const sendMsg = {
    type: 'cosmos-sdk/MsgSend',
    value: {
      from_address: from,
      to_address: to,
      amount: [amount],
    },
  };

  const broadcastedTx = await signingCosmosClient.signAndBroadcast([sendMsg], fee, memo);
  return {
    txHash: broadcastedTx.transactionHash,
    gas,
    gasPrices,
    included: () => queryTxInclusion(broadcastedTx.transactionHash, COSMOS_RESTFUL_API),
  };
}

export async function transferMultiple({
  from,
  tos,
  values,
  memo,
}, signer) {
  const amounts = values.map(v => LIKEToAmount(v));
  const totalValue = amounts.reduce((acc, amount) => acc.plus(amount.amount), new BigNumber(0));
  const outputs = [];
  tos.forEach((target, index) => {
    outputs.push({
      address: target,
      coins: [amounts[index]],
    });
  });
  const { gas, gasPrices } = await calculateGas(tos);
  const fee = {
    amount: DEFAULT_GAS_PRICE,
    gas,
  };
  const gasPrice = GasPrice.fromString(DEFAULT_GAS_PRICE[0].amount.concat(COSMOS_DENOM));
  if (!signingCosmosClient) {
    await initSigningCosmosClient(COSMOS_RESTFUL_API, // eslint-disable-line no-await-in-loop
      from,
      signer, gasPrice, {}, 'block');
  }
  const sendMsg = {
    type: 'cosmos-sdk/MsgMultiSend',
    value: {
      inputs: [
        {
          address: from,
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
  const broadcastedTx = await signingCosmosClient.signAndBroadcast([sendMsg], fee, memo);
  return {
    txHash: broadcastedTx.transactionHash,
    gas,
    gasPrices,
    included: () => queryTxInclusion(broadcastedTx.transactionHash, COSMOS_RESTFUL_API),
  };
}
