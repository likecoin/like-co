import { DEFAULT_ISCN_GAS_PRICE, sendTx } from '../CosmosHelper';
import { ISCN_PUBLISHERS, ISCN_LICENSES } from './iscnConstant';
import {
  ISCN_TESTNET_CHAIN_ID,
} from '@/constant';
import { timeout } from '@/util/misc';
import { apiPostISCNMessageForSign } from '../api/api';
import { assertOk, queryTxInclusion } from './misc';

const ISCN_DEV_RESTFUL_API = '/api/cosmos/iscn-dev/lcd';

let iscnApi;
let Cosmos;

async function initISCNCosmos() {
  if (iscnApi) return;
  ([Cosmos] = await Promise.all([
    import(/* webpackChunkName: "web3" */ '@likecoin/cosmos-api'),
  ]));
  if (Cosmos.default) Cosmos = Cosmos.default;
  iscnApi = new Cosmos(ISCN_DEV_RESTFUL_API, ISCN_TESTNET_CHAIN_ID);
}

export async function getISCNTransferInfo(txHash, opt) {
  if (!iscnApi) await initISCNCosmos();
  const { blocking } = opt;
  let txData = await iscnApi.get.tx(txHash);
  if ((!txData || !txData.height) && !blocking) {
    return {};
  }
  while ((!txData || !txData.height) && blocking) {
    await timeout(1000); // eslint-disable-line no-await-in-loop
    txData = await iscnApi.get.tx(txHash); // eslint-disable-line no-await-in-loop
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
  const txData = await iscnApi.get.tx(txHash);
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

export async function sendSignedISCNTx(signedTx) {
  const body = JSON.stringify({
    tx: signedTx,
    mode: 'sync',
  });
  const res = await fetch(`${ISCN_DEV_RESTFUL_API}/txs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  }).then(r => r.json())
    .then(assertOk);
  return {
    hash: res.txhash,
    included: () => queryTxInclusion(res.txhash, ISCN_DEV_RESTFUL_API),
  };
}

function getPublisherISCNPayload(user, ts, { publisher, license }) {
  const {
    id: userId,
    displayName,
    cosmosWallet,
  } = user;
  const userEntity = {
    description: `LikerID: ${userId}`,
    id: cosmosWallet,
    name: displayName,
  };
  const rights = [];
  let terms;
  const stakeholders = [];
  switch (publisher) {
    case 'matters': {
      const {
        description,
        id,
        name,
        license: mattersLicense,
      } = ISCN_PUBLISHERS.matters;
      stakeholders.push({
        sharing: 0,
        stakeholder: {
          description,
          id,
          name,
        },
        type: 'Publisher',
      });
      terms = ISCN_LICENSES[mattersLicense];
    }
    // eslint-disable-next-line no-fallthrough
    default: {
      switch (license) {
        default:
          if (!terms) terms = ISCN_LICENSES.default;
      }
      stakeholders.unshift({
        sharing: 100,
        stakeholder: userEntity,
        type: 'Creator',
      });
      rights.unshift({
        holder: userEntity,
        period: {
          from: `${new Date(ts).toISOString().substring(0, 19)}Z`,
        },
        terms,
        type: 'License',
      });
      break;
    }
  }
  return {
    rights,
    stakeholders,
  };
}

export function MsgCreateISCN(
  {
    id,
    displayName,
    cosmosWallet,
  },
  {
    fingerprint,
    title = '',
    tags = [],
    type = 'article',
  },
  {
    license,
    publisher,
  },
) {
  const ts = Date.now();
  const { rights, stakeholders } = getPublisherISCNPayload(
    {
      id,
      displayName,
      cosmosWallet,
    }, ts, { publisher, license },
  );
  const message = {
    type: 'likechain/MsgCreateISCN',
    value: {
      from: cosmosWallet,
      iscnKernel: {
        content: {
          fingerprint: `ipfs://${fingerprint}`,
          tags,
          title,
          type,
          version: 1,
        },
        parent: null,
        rights: { rights },
        stakeholders: { stakeholders },
        timestamp: `${new Date(ts).toISOString().substring(0, 19)}Z`,
        version: 1,
      },
    },
  };
  return {
    message,
    simulate: ({ memo = undefined }) => {
      let base = 200000;
      if (memo && memo.length) base += memo.length * 100;
      return Math.floor(base * 1.2);
    },
    send: (
      { gas, gasPrices = DEFAULT_ISCN_GAS_PRICE, memo = undefined },
      signer,
    ) => iscnApi.send(cosmosWallet, { gas, gasPrices, memo }, message, signer),
  };
}
export async function remoteSignISCNPayload({
  userId,
  displayName,
  cosmosWallet,
  fingerprint,
  title,
  tags = [],
  type = 'article',
  license,
  publisher,
}) {
  const { message } = MsgCreateISCN({
    id: userId,
    displayName,
    cosmosWallet,
  },
  {
    fingerprint,
    title,
    tags,
    type,
  },
  {
    license,
    publisher,
  });
  const { data: { signedTx } = {} } = await apiPostISCNMessageForSign(message);
  if (!signedTx) throw new Error('SIGNING_FAILED');
  const { hash, included } = await sendSignedISCNTx(signedTx);
  return {
    txHash: hash,
    included,
  };
}

export async function signISCNPayload({
  userId,
  displayName,
  cosmosWallet,
  fingerprint,
  title,
  tags = [],
  type = 'article',
  license,
  publisher,
  memo,
}, signer, { simulate = false } = {}) {
  if (!iscnApi) await initISCNCosmos();
  const msgPromise = MsgCreateISCN({
    id: userId,
    displayName,
    cosmosWallet,
  },
  {
    fingerprint,
    title,
    tags,
    type,
  },
  {
    license,
    publisher,
  });
  return sendTx(msgPromise, signer, { memo, simulate, gasPrices: DEFAULT_ISCN_GAS_PRICE });
}
