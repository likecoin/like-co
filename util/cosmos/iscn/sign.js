// eslint-disable-next-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';
import bech32 from 'bech32';
import { getISCNLib } from './query';
import { ISCN_RPC_URL } from './constant';
import { EXTERNAL_URL } from '../../../constant';

let isConnected;
let iscnClient;

async function getISCNEstimationClient() {
  if (!iscnClient) {
    const iscn = await getISCNLib();
    iscnClient = new iscn.ISCNSigningClient(ISCN_RPC_URL);
  }
  return iscnClient;
}

function changeAddressPrefix(address, newPrefix) {
  const { words } = bech32.decode(`${address}`);
  return bech32.encode(newPrefix, words);
}

function isValidLikeAddress(address) {
  return /^like1[ac-hj-np-z02-9]{38}$/.test(address);
}

async function getISCNSigningClient(signer) {
  if (!isConnected) {
    const client = await getISCNEstimationClient();
    await client.connectWithSigner(ISCN_RPC_URL, signer);
    isConnected = true;
  }
  return iscnClient;
}

function getAuthorISCNPayload(payload) {
  const {
    userId,
    displayName,
    cosmosWallet,
    author,
    authorDescription,
    rewardProportion = 1,
  } = payload;
  const stakeholders = [];
  if (typeof author === 'object') {
    stakeholders.push({
      rewardProportion,
      contributionType: 'http://schema.org/author',
      ...author,
    });
  } else if (cosmosWallet || userId) {
    const identifier = [];
    let likePrefixAddress = cosmosWallet;
    if (likePrefixAddress) {
      if (!isValidLikeAddress(cosmosWallet)) {
        likePrefixAddress = changeAddressPrefix(cosmosWallet, 'like');
      }
    }
    if (userId) {
      identifier.push({ '@type': 'PropertyValue', propertyID: 'Liker ID', value: `${EXTERNAL_URL}/${userId}` });
    }
    if (likePrefixAddress) {
      identifier.push({ '@type': 'PropertyValue', propertyID: 'LikeCoin Wallet', value: likePrefixAddress });
    }
    const entity = {
      '@id': likePrefixAddress,
      identifier,
    };
    if (author) {
      entity.name = author;
      entity.description = authorDescription;
    } else if (userId) {
      entity.name = displayName;
    }
    stakeholders.push({
      entity,
      rewardProportion,
      contributionType: 'http://schema.org/author',
    });
  }
  return {
    stakeholders,
  };
}

function getPublisherISCNPayload(publisher) {
  const stakeholders = [];
  let contentFingerprints = [];
  if (!publisher) return {};
  if (typeof publisher === 'object') {
    const {
      contentFingerprints: publisherContentFingerprints,
      license,
      ...actualPublisher
    } = publisher;
    contentFingerprints = publisherContentFingerprints;
    stakeholders.push({
      rewardProportion: 0.025,
      contributionType: 'http://schema.org/publisher',
      ...actualPublisher,
    });
  } else {
    stakeholders.push({
      entity: {
        '@id': publisher,
      },
      rewardProportion: 0,
      contributionType: 'http://schema.org/publisher',
    });
  }
  return {
    stakeholders,
    contentFingerprints: contentFingerprints || [],
  };
}

export function preformatISCNPayload(payload) {
  const {
    userId,
    displayName,
    cosmosWallet,
    fingerprints,
    name,
    tags,
    type,
    license,
    publisher,
    author,
    authorDescription,
    description,
    url,
    stakeholders: inputStakeholders = [],
    recordNotes = '',
  } = payload;

  let stakeholders = inputStakeholders || [];
  let actualType = 'CreativeWork';
  const {
    stakeholders: publisherStakeholders,
    contentFingerprints: publisherContentFingerprints,
  } = getPublisherISCNPayload(publisher);

  const rewardProportion = publisherStakeholders ? 1 - publisherStakeholders.reduce((acc, cur) => {
    if (cur.rewardProportion) return acc + cur.rewardProportion;
    return acc;
  }, 0) : 1;
  const { stakeholders: authorStakeholders } = getAuthorISCNPayload({
    userId,
    displayName,
    cosmosWallet,
    author,
    authorDescription,
    rewardProportion,
  });
  if (authorStakeholders) stakeholders = stakeholders.concat(authorStakeholders);
  if (publisherStakeholders) stakeholders = stakeholders.concat(publisherStakeholders);

  switch (type) {
    case 'message':
    case 'image':
    case 'photo':
    case 'article': {
      actualType = type[0].toUpperCase().concat(type.slice(1));
      break;
    }
    default: actualType = 'CreativeWork';
  }

  let contentFingerprints = [];
  if (fingerprints) {
    contentFingerprints = contentFingerprints.concat(fingerprints);
  }
  if (publisherContentFingerprints) {
    contentFingerprints = contentFingerprints.concat(publisherContentFingerprints);
  }

  const preformatedPayload = {
    name,
    description,
    url,
    keywords: tags,
    type: actualType,
    usageInfo: license,
    recordNotes,
    contentFingerprints,
    stakeholders,
  };
  return preformatedPayload;
}

export async function calculateISCNTotalFee(payload, { memo } = {}) {
  const client = await getISCNEstimationClient();
  const { gas, iscnFee } = await client.esimateISCNTxGasAndFee(payload, { memo });
  const ISCNFeeAmount = iscnFee.amount;
  const gasFeeAmount = gas.fee.amount[0].amount;
  const ISCNTotalFee = new BigNumber(ISCNFeeAmount).plus(gasFeeAmount).shiftedBy(-9).toFixed(2);
  return { ISCNTotalFee };
}

export async function signISCNTx(
  payload, signer, address, { iscnId, memo, broadcast = true } = {},
) {
  const client = await getISCNSigningClient(signer);
  let res;
  if (iscnId) {
    res = await client.updateISCNRecord(address, iscnId, payload, { memo, broadcast });
  } else {
    res = await client.createISCNRecord(address, payload, { memo, broadcast });
  }
  return res;
}
