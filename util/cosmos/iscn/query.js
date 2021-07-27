// eslint-disable-next-line import/no-extraneous-dependencies
import { Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { QueryClient, StargateClient } from '@cosmjs/stargate';

import setupISCNExtension from './iscnQueryExtension';
import { timeout } from '@/util/misc';
import { assertOk, queryTxInclusion } from '../misc';

const ISCN_RPC_URL = '/api/cosmos/rpc';

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
  const {
    timestamp,
    code,
    logs: [{ success = false } = {}] = [],
    events = [],
    tx: {
      value: {
        msg,
      },
    },
  } = txData;
  if (!txData.height) {
    return {};
  }
  const createEvent = events.find(e => e.type === 'create_iscn') || {};
  const iscnId = ((createEvent.attributes || []).find(a => a.key === 'iscn_id') || {}).value;
  if (!iscnId) throw new Error('Cannot find ISCN ID');
  const [{
    type,
    value: {
      from,
      iscnKernel: {
        content,
        rights: { rights = [] },
        stakeholders: { stakeholders = [] },
        timestamp: contentTimestamp,
        // parent,
        // version,
      },
    },
  }] = msg;
  const {
    fingerprint,
    tags,
    title,
    type: contentType,
  } = content;
  const parsedRights = rights.map((r) => {
    if (r.holder.description.includes('LikerID: ')) {
      // eslint-disable-next-line no-param-reassign
      [, r.holder.likerID] = r.holder.description.split('LikerID: ');
    }
    return r;
  });
  const parsedStakeholders = stakeholders.map((s) => {
    if (s.stakeholder.description.includes('LikerID: ')) {
      // eslint-disable-next-line no-param-reassign
      [, s.stakeholder.likerID] = s.stakeholder.description.split('LikerID: ');
    }
    return s;
  });
  const parsedFingerprint = fingerprint.split('://');
  const isFailed = (code && code !== '0') || !success;
  return {
    iscnId,
    from,
    fingerprint: parsedFingerprint[parsedFingerprint.length - 1],
    tags,
    title,
    type,
    contentType,
    isFailed,
    rights: parsedRights,
    stakeholders: parsedStakeholders,
    contentTimestamp,
    timestamp: (new Date(timestamp)).getTime() / 1000,
  };
}

export async function getISCNTransactionCompleted(txHash) {
  if (!iscnApi) await initISCNCosmos();
  const txData = await iscnApi.txById(txHash);
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
