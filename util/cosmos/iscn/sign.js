// eslint-disable-next-line import/no-extraneous-dependencies
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClient } from "@cosmjs/stargate";
import BigNumber from 'bignumber.js';

import { setupISCNExtension } from "./iscnQueryExtension";
import config from '~/constant/network';
import { COSMOS_DENOM } from '~/constant';

import {
  defaultRegistryTypes,
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} from "@cosmjs/stargate";
import { DEFAULT_ISCN_GAS_PRICE } from '../CosmosHelper';
import { ISCN_PUBLISHERS, ISCN_LICENSES } from './iscnConstant';
import { timeout } from '@/util/misc';
import { apiPostISCNMessageForSign } from '../api/api';
import { assertOk, queryTxInclusion } from './misc';

const ISCN_DEV_RESTFUL_API = '/api/cosmos/iscn-dev/lcd';

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
export async function sendTx(msgCallPromise, signer, {
  gasPrices = DEFAULT_ISCN_GAS_PRICE,
  memo,
  simulate: isSimulate,
} = {}) {
  const { simulate, send } = await msgCallPromise;
  const gas = (await simulate({ memo })).toString();
  if (isSimulate) return { gas, gasPrices };
  const { hash, included } = await send({ gas, gasPrices, memo }, signer);
  return {
    txHash: hash,
    included,
    gas,
    gasPrices,
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
