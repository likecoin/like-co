// eslint-disable-next-line import/no-extraneous-dependencies
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
// eslint-disable-next-line import/no-extraneous-dependencies
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { QueryClient, StargateClient } from '@cosmjs/stargate';
import { MsgCreateIscnRecord } from '@likecoin/iscn-message-types/dist/iscn/tx';
import BigNumber from 'bignumber.js';

import setupISCNExtension from './iscnQueryExtension';
import { timeout } from '@/util/misc';
import { EXTERNAL_URL } from '@/constant';

const ISCN_RPC_URL = `${EXTERNAL_URL}/api/cosmos/rpc`;

let queryClient;
let stargateClient;

async function initQueryClient() {
  const tendermintClient = await Tendermint34Client.connect(ISCN_RPC_URL);
  const client = QueryClient.withExtensions(
    tendermintClient,
    setupISCNExtension,
  );
  return client;
}

export async function getQueryClient() {
  if (!queryClient) queryClient = await initQueryClient();
  return queryClient;
}

export async function getApiClient() {
  if (!stargateClient) stargateClient = await StargateClient.connect(ISCN_RPC_URL);
  return stargateClient;
}

function parseISCNRecordFields(record) {
  const {
    stakeholders,
    contentMetadata,
  } = record;
  return {
    ...record,
    stakeholders: stakeholders.map((s) => {
      if (s) {
        const sString = Buffer.from(s).toString('utf-8');
        if (sString) return JSON.parse(sString);
      }
      return s;
    }),
    contentMetadata: JSON.parse(Buffer.from(contentMetadata).toString('utf-8')),
  };
}

export function parseISCNTxInfoFromTxSuccess(tx) {
  const { transactionHash } = tx;
  let iscnId;
  if (tx.rawLog) {
    const [log] = JSON.parse(tx.rawLog);
    if (log) {
      const ev = log.events.find(e => e.type === 'iscn_record');
      if (ev) iscnId = ev.attributes[0].value;
    }
  }
  return {
    txHash: transactionHash,
    iscnId,
  };
}

export function parseISCNTxInfoFromIndexedTx(tx) {
  const { tx: txBytes, rawLog } = tx;
  const decodedTx = decodeTxRaw(txBytes);
  const messages = decodedTx.body.messages.map((m) => {
    if (m.typeUrl === '/likechain.iscn.MsgCreateIscnRecord') {
      const msg = MsgCreateIscnRecord.decode(m.value);
      if (msg.record) {
        msg.record = parseISCNRecordFields(msg.record);
      }
      return {
        ...m,
        value: msg,
      };
    }
    return null;
  });

  return {
    ...tx,
    logs: JSON.parse(rawLog),
    tx: {
      ...decodedTx,
      body: {
        ...decodedTx.body,
        messages: messages.filter(m => m),
      },
    },
  };
}

export async function getISCNTransferInfo(txHash, opt) {
  const apiClient = await getApiClient();
  const { blocking } = opt;
  let txData = await apiClient.getTx(txHash);
  if ((!txData || !txData.height) && !blocking) {
    return {};
  }
  while ((!txData || !txData.height) && blocking) {
    await timeout(1000); // eslint-disable-line no-await-in-loop
    txData = await apiClient.getTx(txHash); // eslint-disable-line no-await-in-loop
  }
  if (!txData) throw new Error('Cannot find transaction');
  const parsed = parseISCNTxInfoFromIndexedTx(txData);
  const {
    height,
    code,
  } = txData;
  if (!height) {
    return {};
  }

  const block = await apiClient.getBlock(height);
  const { header: { time: timestamp } } = block;

  const messages = [];
  parsed.tx.body.messages.forEach((m, index) => {
    if (!m || !m.typeUrl.includes('/likechain.iscn')) return;
    const data = m.value.record;
    if (!data) return;
    const log = parsed.logs[index];
    const event = log.events.find(e => e.type === 'iscn_record');
    if (!event) return;
    const { attributes } = event;
    const ipldAttr = attributes.find(a => a.key === 'ipld');
    const ipld = ipldAttr && ipldAttr.value;
    const iscnIdAttr = attributes.find(a => a.key === 'iscn_id');
    const iscnId = iscnIdAttr && iscnIdAttr.value;
    const ownerAttr = attributes.find(a => a.key === 'owner');
    const owner = ownerAttr && ownerAttr.value;
    if (!ipld || !iscnId) return;
    messages.push({
      ipld,
      id: iscnId,
      data,
      owner,
    });
  });
  const [message] = messages;
  if (!message) {
    throw new Error('Not an ISCN transaction');
  }
  const {
    ipld,
    id: iscnId,
    owner,
    data: {
      stakeholders,
      contentMetadata: {
        '@type': type,
        name,
        url,
        keywords,
        usageInfo,
      },
      recordNotes,
      contentFingerprints,
    },
  } = message;
  let parsedFingerprint = contentFingerprints.find(f => f.includes('ipfs://'));
  if (parsedFingerprint) [, parsedFingerprint] = parsedFingerprint.split('ipfs://');
  const isFailed = (code && code !== '0');
  const tags = (keywords || '').split(',');
  return {
    ipld,
    iscnId,
    from: owner,
    fingerprint: parsedFingerprint,
    tags,
    url,
    name,
    type,
    isFailed,
    rights: [usageInfo],
    stakeholders,
    contentTimestamp: (new Date(timestamp)).getTime(),
    timestamp: (new Date(timestamp)).getTime() / 1000,
    recordNotes,
  };
}

export async function getISCNTransactionCompleted(txHash) {
  const apiClient = await getApiClient();
  const txData = await apiClient.getTx(txHash);
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

export async function queryFeePerByte() {
  queryClient = await getQueryClient();
  const res = await queryClient.iscn.params();
  if (res && res.params && res.params.feePerByte) {
    const {
      denom,
      amount,
    } = res.params.feePerByte;
    return {
      denom,
      amount: new BigNumber(amount).shiftedBy(-18).toFixed(),
    };
  }
  return 0;
}
