import BigNumber from 'bignumber.js';
import {
  COSMOS_DENOM,
  BASIC_TRANSFER_GAS,
  EXTERNAL_URL,
} from '@/constant';
import { timeout } from '@/util/misc';
import { queryTxInclusion } from '@/util/cosmos/misc';
import {
  SigningStargateClient,
  StargateClient,
} from '@cosmjs/stargate';
import { MsgSend, MsgMultiSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx';
import {
  TxRaw,
  TxBody,
} from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export const DEFAULT_GAS_PRICE = [{ amount: '1000', denom: COSMOS_DENOM }];
export const DEFAULT_GAS_PRICE_NUMBER = parseInt(DEFAULT_GAS_PRICE[0].amount, 10);
export const DEFAULT_ISCN_GAS_PRICE = [{ amount: 0, denom: COSMOS_DENOM }];
const COSMOS_RESTFUL_API = `${EXTERNAL_URL}/api/cosmos/lcd`;
const COSMOS_RPC_API = `${EXTERNAL_URL}/api/cosmos/rpc`;
let stargateClient;
let signingStargateClient;

async function initStargateClient() {
  if (stargateClient) return;
  stargateClient = await StargateClient.connect(COSMOS_RPC_API);
}

async function initSigningStargateClient(url, senderWallet) {
  if (signingStargateClient) return;
  signingStargateClient = await SigningStargateClient.connectWithSigner(url, senderWallet);
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
  if (!stargateClient) await initStargateClient();
  const txData = await stargateClient.getTx(txHash);
  if (!txData || !txData.height) {
    return 0;
  }
  const {
    height,
    code,
  } = txData;
  const block = await stargateClient.getBlock(height);
  const { header: { time: timestamp } } = block;

  return {
    ts: (new Date(timestamp)).getTime(),
    isFailed: (code && code !== 0),
  };
}

export async function getTransferInfo(txHash, opt) {
  if (!stargateClient) await initStargateClient();
  const { blocking } = opt;
  let txData = await stargateClient.getTx(txHash);
  if ((!txData || !txData.height) && !blocking) {
    return {};
  }
  while ((!txData || !txData.height) && blocking) {
    await timeout(1000); // eslint-disable-line no-await-in-loop
    txData = await stargateClient.getTx(txHash); // eslint-disable-line no-await-in-loop
  }
  if (!txData) throw new Error('Cannot find transaction');
  const {
    height,
    code,
  } = txData;
  const block = await stargateClient.getBlock(height);
  const { header: { time: timestamp } } = block;
  const txRaw = TxRaw.decode(Buffer.from(txData.tx, 'base64'));
  const txBody = TxBody.decode(txRaw.bodyBytes);
  const { messages } = txBody;
  let amounts = [];
  let amount = [];
  let from = [];
  let to = [];
  let redirectToISCNTransactionPage = false;
  if (messages.length > 1) {
    messages.forEach((m) => {
      const { typeUrl, value } = m;
      if (typeUrl === '/cosmos.bank.v1beta1.MsgSend' || typeUrl === '/cosmos.bank.v1beta1.MsgMultiSend') {
        if (typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
          const payloadValue = MsgSend.decode(value);
          const {
            amount: [a],
            fromAddress: f,
            toAddress: t,
          } = payloadValue;
          amounts.push(a);
          from.push(f);
          to.push(t);
        } else if (typeUrl === '/cosmos.bank.v1beta1.MsgMultiSend') {
          const payloadValue = MsgMultiSend.decode(value);
          const {
            inputs,
            outputs,
          } = payloadValue;
          if (inputs.length > 1) {
            from = from.concat(inputs.map(i => i.address));
          } else {
            from.push(inputs[0].address);
          }
          if (outputs.length > 1) {
            to = to.concat(outputs.map(o => o.address));
            amounts = amounts.concat(outputs.map(o => o.coins[0]));
          } else {
            to.push(outputs[0].address);
            amounts.push([outputs[0].coins[0]]);
          }
        }
      }
    });
  } else {
    const { typeUrl, value } = messages[0];
    if (typeUrl === '/cosmos.bank.v1beta1.MsgSend' || typeUrl === '/cosmos.bank.v1beta1.MsgMultiSend') {
      if (typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
        const payloadValue = MsgSend.decode(value);
        ({
          amount: [amount],
          fromAddress: from,
          toAddress: to,
        } = payloadValue);
        amounts = amount;
      } else if (typeUrl === '/cosmos.bank.v1beta1.MsgMultiSend') {
        const payloadValue = MsgMultiSend.decode(value);
        const {
          inputs,
          outputs,
        } = payloadValue;
        from = inputs.length > 1 ? inputs.map(i => i.address) : inputs[0].address;
        to = outputs.length > 1 ? outputs.map(o => o.address) : outputs[0].address;
        amounts = outputs.length > 1 ? outputs.map(o => o.coins[0]) : [outputs[0].coins[0]];
      }
    } else if (typeUrl === '/likechain.iscn.MsgCreateIscnRecord'
              || typeUrl === '/likechain.iscn.MsgUpdateIscnRecord'
              || typeUrl === '/likechain.iscn.MsgChangeIscnRecordOwnership'
    ) {
      redirectToISCNTransactionPage = true;
    }
  }

  if (Array.isArray(from)) [from] = from; // TODO: support multiple from addr?
  if (!txData.height) {
    return {
      _from: from,
      _to: to,
      _amount: amounts,
    };
  }
  const isFailed = (code && code !== 0);
  return {
    redirectToISCNTransactionPage,
    isFailed,
    _from: from,
    _to: to,
    _amount: amounts,
    timestamp: (new Date(timestamp)).getTime() / 1000,
  };
}

export async function queryLikeCoinBalance(addr) {
  if (!stargateClient) await initStargateClient();
  const amount = await stargateClient.getBalance(addr, COSMOS_DENOM);
  if (!amount) return 0;
  return amountToLIKE(amount);
}

export async function calculateGas(to) {
  const fee = {
    amount: [{
      amount: ((to.length * parseInt(BASIC_TRANSFER_GAS, 10))
      * DEFAULT_GAS_PRICE_NUMBER).toString(),
      denom: COSMOS_DENOM,
    }],
    gas: (to.length * parseInt(BASIC_TRANSFER_GAS, 10)).toString(),
  };
  const { gas } = fee;
  const feeAmount = fee.amount;
  return { gas, feeAmount };
}

export async function transfer({
  from,
  to,
  value,
  memo,
}, signer) {
  const amount = LIKEToAmount(value);
  const { gas, feeAmount } = await calculateGas([to]);
  const fee = {
    amount: feeAmount,
    gas,
  };
  if (!signingStargateClient) {
    await initSigningStargateClient(COSMOS_RPC_API, signer);
  }
  const sendMsg = MsgSend.fromPartial({
    fromAddress: from,
    toAddress: to,
    amount: [amount],
  });

  const msgs = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: sendMsg,
  };
  const broadcastedTx = await signingStargateClient.signAndBroadcast(from, [msgs], fee, memo);
  return {
    txHash: broadcastedTx.transactionHash,
    gas,
    feeAmount,
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
  const { gas, feeAmount } = await calculateGas(tos);
  const fee = {
    amount: feeAmount,
    gas,
  };
  if (!signingStargateClient) {
    await initSigningStargateClient(COSMOS_RPC_API, // eslint-disable-line no-await-in-loop);
      signer);
  }
  const sendMsg = MsgMultiSend.fromPartial({
    inputs: [
      {
        address: from,
        coins: [
          {
            denom: COSMOS_DENOM,
            amount: totalValue.toFixed().toString(),
          },
        ],
      },
    ],
    outputs,
  });

  const msgs = {
    typeUrl: '/cosmos.bank.v1beta1.MsgMultiSend',
    value: sendMsg,
  };

  const broadcastedTx = await signingStargateClient.signAndBroadcast(from, [msgs], fee, memo);
  return {
    txHash: broadcastedTx.transactionHash,
    gas,
    feeAmount,
    included: () => queryTxInclusion(broadcastedTx.transactionHash, COSMOS_RESTFUL_API),
  };
}
