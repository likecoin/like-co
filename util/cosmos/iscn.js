import { DEFAULT_GAS_PRICE } from '../CosmosHelper';

function getPublisherISCNPayload(user, ts, { publisher, license }) {
  const {
    id,
    displayName,
    cosmosWallet,
  } = user;
  const userEntity = {
    description: `LikerID: ${id}`,
    id: cosmosWallet,
    name: displayName,
  };
  const rights = [];
  let terms;
  const stakeholders = [];
  switch (publisher) {
    case 'matters': {
      stakeholders.push({
        sharing: 0,
        stakeholder: {
          description: 'Matters is a decentralized, cryptocurrency driven content creation and discussion platform.',
          id: 'https://matters.news/',
          name: 'Matters',
        },
        type: 'Publisher',
      });
      // TODO: replace placeholder
      terms = 'QmUuecLXegUEzLjvceUpVfqL143XbPG2J3HVnJowuMCh2Y';
      break;
    }
    default: {
      switch (license) {
        default:
          if (!terms) terms = 'QmZhRNkZaSnhDr6gBC22zwhTjsGyUx39tm8gjFYnTr2SjN';
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
          fingerprint,
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
      { gas, gasPrices = DEFAULT_GAS_PRICE, memo = undefined },
      signer,
    ) => api.send(cosmosWallet, { gas, gasPrices, memo }, message, signer),
  };
}

export default MsgCreateISCN;
