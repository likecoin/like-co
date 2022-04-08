import WalletConnectClient from '@walletconnect/client';
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal';
import { payloadId } from '@walletconnect/utils';

import {
  EXTERNAL_HOSTNAME,
  EXTERNAL_URL,
} from '../constant';

import network from './cosmos/network';

class WalletConnect {
  constructor() {
    this.signer = null;
    this.accounts = [];
    this.connector = null;
  }

  async checkIfInited() {
    if (!this.connector) {
      const res = await this.init();
      if (!res) throw new Error('CANNOT_INIT_WALLETCONNECT');
    }
  }

  async init() {
    try {
      const connector = new WalletConnectClient({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: WalletConnectQRCodeModal,
      });
      // XXX: Client meta options in the constructor is ignored
      // https://github.com/osmosis-labs/osmosis-frontend/blob/9c5f8cf5de035348e0aeb38468f1b8a208a9b99d/src/dialogs/connect-wallet.tsx#L185-L193
      // eslint-disable-next-line no-underscore-dangle
      connector._clientMeta = {
        name: EXTERNAL_HOSTNAME,
        description: EXTERNAL_HOSTNAME,
        url: EXTERNAL_URL,
        icons: [`${EXTERNAL_URL}/logo.png`],
      };
      connector.on('disconnect', () => {
        connector.killSession();
        this.reset();
      });

      // Always starts a new session
      if (connector.connected) {
        connector.killSession();
      }
      await connector.connect();
      const [account] = await connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmos_getAccounts',
        params: [network.id],
      });
      if (!account) return false;

      const {
        bech32Address: address,
        algo,
        pubKey: pubKeyInHex,
      } = account;
      if (!address || !algo || !pubKeyInHex) return false;

      const pubkey = new Uint8Array(Buffer.from(pubKeyInHex, 'hex'));
      const accounts = [{ address, pubkey, algo }];
      const offlineSigner = {
        getAccounts: () => Promise.resolve(accounts),
        signAmino: async (signerAddress, signDoc) => {
          const [payload] = await connector.sendCustomRequest({
            id: payloadId(),
            jsonrpc: '2.0',
            method: 'cosmos_signAmino',
            params: [
              network.id,
              signerAddress,
              signDoc,
            ],
          });
          return payload;
        },
      };
      this.signer = offlineSigner;
      this.accounts = accounts;
      this.connector = connector;
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return false;
  }

  internalGetWalletAddress() {
    const [wallet = {}] = this.accounts;
    return wallet.address;
  }

  async getWalletAddress() {
    await this.checkIfInited();
    const address = this.internalGetWalletAddress();
    return address;
  }

  async signLogin(signPayload) {
    await this.checkIfInited();
    const message = {
      chain_id: network.id,
      memo: signPayload,
      msgs: [],
      fee: { gas: '1', amount: [{ denom: 'nanolike', amount: '0' }] },
      sequence: '0',
      account_number: '0',
    };
    const payload = await this.signer.signAmino(
      this.internalGetWalletAddress(),
      message,
    );
    // Reset after signing the login payload
    this.reset();
    return { message, ...payload };
  }

  reset() {
    if (this.connector) {
      this.connector.killSession();
      this.connector = null;
    }
    this.signer = null;
    this.accounts = [];
  }
}

export default new WalletConnect();
