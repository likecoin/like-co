// eslint-disable-next-line import/no-extraneous-dependencies
import { Registry } from '@cosmjs/proto-signing';
import { MsgCreateIscnRecord } from '@likecoin/iscn-message-types/dist/iscn/tx';
import {
  defaultRegistryTypes,
  assertIsBroadcastTxSuccess,
  SigningStargateClient,
} from '@cosmjs/stargate';
import { DEFAULT_GAS_PRICE_NUMBER } from '../../CosmosHelper';
import { ISCN_RPC_URL, ISCN_PUBLISHERS, ISCN_LICENSES } from './constant';
import { EXTERNAL_URL } from '../../../constant';

const registry = new Registry([
  ...defaultRegistryTypes,
  ['/likechain.iscn.MsgCreateIscnRecord', MsgCreateIscnRecord], // Replace with your own type URL and Msg class
]);

export function estimateISCNTxGas() {
  const DEFAULT_GAS = 1000000; // TODO: estimate according to size
  return {
    amount: [{ amount: (DEFAULT_GAS_PRICE_NUMBER * DEFAULT_GAS).toFixed(), denom: 'nanolike' }],
    gas: DEFAULT_GAS.toFixed(),
  };
}

function getPublisherISCNPayload(user, { publisher, license }) {
  const {
    id: userId,
    displayName,
  } = user;
  let usageInfo;
  const stakeholders = [];
  switch (publisher) {
    case 'matters': {
      const {
        description,
        id,
        name,
        license: mattersLicense,
      } = ISCN_PUBLISHERS.matters;
      stakeholders.push(Buffer.from(JSON.stringify({
        entity: {
          id,
          name,
          description,
        },
        rewardProportion: 1,
        contributionType: 'http://schema.org/publisher',
      }), 'utf8'));
      usageInfo = `ipfs://${ISCN_LICENSES[mattersLicense]['/']}`;
    }
    // eslint-disable-next-line no-fallthrough
    default: {
      switch (license) {
        default:
          if (!usageInfo) usageInfo = `ipfs://${ISCN_LICENSES.default['/']}`;
      }
      stakeholders.unshift(Buffer.from(JSON.stringify({
        entity: {
          id: `${EXTERNAL_URL}/${userId}`,
          name: displayName,
        },
        rewardProportion: 1,
        contributionType: 'http://schema.org/author',
      }), 'utf8'));
      break;
    }
  }
  return {
    usageInfo,
    stakeholders,
  };
}

function formatISCNPayload(payload, version = 1) {
  const {
    userId,
    displayName,
    cosmosWallet,
    fingerprint,
    title,
    tags,
    type,
    license,
    publisher,
    description,
    url,
  } = payload;

  let actualType = 'CreativeWork';

  const { usageInfo, stakeholders } = getPublisherISCNPayload({
    userId,
    displayName,
    cosmosWallet,
  }, { publisher, license });

  switch (type) {
    case 'image':
    case 'photo':
    case 'article': {
      actualType = type[0].toUpperCase().concat(type.slice(1));
      break;
    }
    default: actualType = 'CreativeWork';
  }

  const contentFingerprints = [];
  if (fingerprint) contentFingerprints.push(`ipfs://${fingerprint}`);
  const contentMetadata = {
    '@context': 'http://schema.org/',
    '@type': actualType,
    title,
    description,
    version,
    url,
    keywords: tags.join(','),
    usageInfo,
  };
  return {
    recordNotes: '',
    contentFingerprints,
    stakeholders,
    contentMetadata: Buffer.from(JSON.stringify(contentMetadata), 'utf8'),
  };
}

export async function signISCNTx(tx, signer, address, memo) {
  const record = formatISCNPayload(tx);
  const client = await SigningStargateClient.connectWithSigner(
    ISCN_RPC_URL,
    signer,
    { registry },
  );

  const message = {
    typeUrl: '/likechain.iscn.MsgCreateIscnRecord',
    value: {
      from: address,
      record,
    },
  };
  const fee = await estimateISCNTxGas();
  const response = await client.signAndBroadcast(address, [message], fee, memo);
  assertIsBroadcastTxSuccess(response);
  return response;
}
