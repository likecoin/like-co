// eslint-disable-next-line import/no-extraneous-dependencies
import BigNumber from 'bignumber.js';
import { ISCNSigningClient } from '@likecoin/iscn-js';

import { ISCN_RPC_URL, ISCN_PUBLISHERS, ISCN_LICENSES } from './constant';
import { EXTERNAL_URL } from '../../../constant';

let isConnected;
let iscnClient;

function getISCNEstimationClient() {
  if (!iscnClient) {
    iscnClient = new ISCNSigningClient(ISCN_RPC_URL);
  }
  return iscnClient;
}

async function getISCNSigningClient(signer) {
  if (!isConnected) {
    const client = getISCNEstimationClient();
    await client.connectWithSigner(ISCN_RPC_URL, signer);
    isConnected = true;
  }
  return iscnClient;
}

function getPublisherISCNPayload(user, { publisher, license }) {
  const {
    userId,
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
      stakeholders.push({
        entity: {
          id,
          name,
          description,
        },
        rewardProportion: 0,
        contributionType: 'http://schema.org/publisher',
      });
      usageInfo = `ipfs://${ISCN_LICENSES[mattersLicense]['/']}`;
    }
    // eslint-disable-next-line no-fallthrough
    default: {
      switch (license) {
        default:
          if (!usageInfo) usageInfo = `ipfs://${ISCN_LICENSES.default['/']}`;
      }
      stakeholders.unshift({
        entity: {
          id: `${EXTERNAL_URL}/${userId}`,
          name: displayName,
        },
        rewardProportion: 1,
        contributionType: 'http://schema.org/author',
      });
      break;
    }
  }
  return {
    usageInfo,
    stakeholders,
  };
}

function preformatISCNPayload(payload) {
  const {
    userId,
    displayName,
    cosmosWallet,
    fingerprint,
    name,
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
  if (fingerprint) {
    if (Array.isArray(fingerprint)) {
      for (let i = 0; i < fingerprint.length; i += 1) {
        contentFingerprints.push(fingerprint[i]);
      }
    } else {
      contentFingerprints.push(fingerprint);
    }
  }

  const preformatedPayload = {
    name,
    description,
    url,
    keywords: tags,
    type: actualType,
    usageInfo,
    recordNotes: '',
    contentFingerprints,
    stakeholders,
  };
  return preformatedPayload;
}

export async function calculateISCNTotalFee(tx) {
  const payload = preformatISCNPayload(tx);
  const client = await getISCNEstimationClient();
  const { gas, iscnFee } = await client.esimateISCNTxGasAndFee(payload);
  const ISCNFeeAmount = iscnFee.amount;
  const gasFeeAmount = gas.fee.amount[0].amount;
  const ISCNTotalFee = new BigNumber(ISCNFeeAmount).plus(gasFeeAmount).shiftedBy(-9).toFixed(2);
  return { ISCNTotalFee };
}

export async function signISCNTx(tx, signer, address, memo) {
  const payload = preformatISCNPayload(tx);
  const client = await getISCNSigningClient(signer);
  const res = await client.createISCNRecord(address, payload, { memo });
  return res;
}
