import { LcdClient } from '@cosmjs/launchpad';
import { timeout } from '@/util/misc';

const ISCN_DEV_RESTFUL_API = '/api/cosmos/iscn-dev/lcd';

let iscnApi;
async function initISCNCosmos() {
  if (iscnApi) return;
  iscnApi = LcdClient.withExtensions({ ISCN_DEV_RESTFUL_API });
}

export default async function getISCNTransferInfo(txHash, opt) {
  if (!iscnApi) await initISCNCosmos();
  const { blocking } = opt;
  let txData = await iscnApi.txById(txHash);
  if ((!txData || !txData.height) && !blocking) {
    return {};
  }
  while ((!txData || !txData.height) && blocking) {
    await timeout(1000); // eslint-disable-line no-await-in-loop
    txData = await iscnApi.txById(txHash); // eslint-disable-line no-await-in-loop
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
