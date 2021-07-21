import BigNumber from 'bignumber.js';
import {
  COSMOS_DENOM,
  // EXTERNAL_URL,
} from '@/constant';
import { timeout } from '@/util/misc';
import { queryTxInclusion } from '@/util/cosmos/misc';
import {
  CosmosClient, SigningCosmosClient,
  GasPrice,
} from '@cosmjs/launchpad';

export const DEFAULT_GAS_PRICE = [{ amount: '1000', denom: 'nanolike' }];
export const DEFAULT_GAS_PRICE_NUMBER = parseInt(DEFAULT_GAS_PRICE[0].amount, 10);
export const DEFAULT_ISCN_GAS_PRICE = [{ amount: 0, denom: 'nanolike' }];
const COSMOS_RESTFUL_API = 'http://localhost:3000/api/cosmos/lcd'; // for deployment, change to `${EXTERNAL_URL}/api/cosmos/lcd`

let cosmosClient;
let signingCosmosClient;

async function initCosmosClient() {
  if (cosmosClient) return;
  cosmosClient = new CosmosClient(COSMOS_RESTFUL_API);
}

async function initSigningCosmosClient(url, signerAddress,
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
  if (likecoin.denom === 'nanolike') {
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
  const fullLogs = JSON.parse(rawLog.slice(1, rawLog.length - 1));
  return {
    ts: (new Date(timestamp)).getTime(),
    isFailed: (code && code !== '0') || !fullLogs.success,
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

export async function transfer({
  from,
  to,
  value,
  memo,
}, signer) {
  const amount = LIKEToAmount(value);
  const fee = {
    amount: DEFAULT_GAS_PRICE,
    gas: '44000',
  };
  const gasPrice = GasPrice.fromString(fee.amount[0].amount.concat(fee.amount.demon));
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
    gas: fee.gas,
    gasPrices: fee.amount,
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
  const fee = {
    amount: DEFAULT_GAS_PRICE,
    gas: '88000', // need to be higher than 44000 or error: out of gas in location: WriteFlat will happen
  };
  const gasPrice = GasPrice.fromString(fee.amount[0].amount.concat(fee.amount.demon));
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
              denom: 'nanolike',
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
    gas: fee.gas,
    gasPrices: fee.amount,
    included: () => queryTxInclusion(broadcastedTx.transactionHash, COSMOS_RESTFUL_API),
  };
}
