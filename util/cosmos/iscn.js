import { DEFAULT_ISCN_GAS_PRICE, sendTx } from '../CosmosHelper';
import { ISCN_PUBLISHERS, ISCN_LICENSES } from './iscnConstant';
import {
  ISCN_TESTNET_CHAIN_ID,
} from '@/constant';

let iscnApi;
let Cosmos;

async function initISCNCosmos() {
  if (iscnApi) return;
  ([Cosmos] = await Promise.all([
    import(/* webpackChunkName: "web3" */ '@lunie/cosmos-api'),
  ]));
  if (Cosmos.default) Cosmos = Cosmos.default;
  iscnApi = new Cosmos('/api/cosmos/iscn-dev/lcd', ISCN_TESTNET_CHAIN_ID);
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
      break;
    }
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
          from: new Date(ts).toISOString(),
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
  api,
  {
    id,
    displayName,
    cosmosWallet,
  },
  {
    fingerprint,
    title,
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
        rights: { rights },
        stakeholders: { stakeholders },
        timestamp: new Date(ts).toISOString(),
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
    ) => api.send(cosmosWallet, { gas, gasPrices, memo }, message, signer),
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
  const msgPromise = MsgCreateISCN(iscnApi,
    {
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
