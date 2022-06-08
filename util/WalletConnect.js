import WalletConnectClient from '@walletconnect/client';
import { payloadId } from '@walletconnect/utils';

import {
  EXTERNAL_HOSTNAME,
  EXTERNAL_URL,
} from '../constant';

import network from './cosmos/network';

const ERROR_MESSAGE_REJECTED_CALL_REQUEST = 'User rejected call request';

class WalletConnect {
  constructor() {
    this.signer = null;
    this.accounts = [];
    this.connector = null;
    this.isInited = false;
    this.handleQRCodeModalOpen = null;
    this.handleQRCodeModalClose = null;
  }

  async checkIfInited() {
    if (!this.isInited) {
      const res = await this.init();
      if (!res) throw new Error('CANNOT_INIT_WALLETCONNECT');
    }
  }

  async init({
    open,
    close,
    isConnectOnly = false,
    isRetry = false,
  } = {}) {
    this.handleQRCodeModalOpen = open;
    this.handleQRCodeModalClose = close;
    if (!isRetry) {
      this.reset();
    }
    try {
      this.connector = new WalletConnectClient({
        bridge: 'https://bridge.walletconnect.org',
        qrcodeModal: {
          open: (uri, cb, opts) => {
            if (!this.handleQRCodeModalOpen) return;
            this.handleQRCodeModalOpen(uri, cb, opts);
          },
          close: () => {
            if (!this.handleQRCodeModalClose) return;
            this.handleQRCodeModalClose(this.connector.connected);
          },
        },
      });
      // XXX: Client meta options in the constructor is ignored
      // https://github.com/osmosis-labs/osmosis-frontend/blob/9c5f8cf5de035348e0aeb38468f1b8a208a9b99d/src/dialogs/connect-wallet.tsx#L185-L193
      // eslint-disable-next-line no-underscore-dangle
      this.connector._clientMeta = {
        name: EXTERNAL_HOSTNAME,
        description: EXTERNAL_HOSTNAME,
        url: EXTERNAL_URL,
        icons: [`${EXTERNAL_URL}/logo.png`],
      };

      // Always starts a new session
      if (!this.connector.connected) {
        await this.connector.connect();
      }
      if (isConnectOnly) {
        return;
      }
      const [account] = await this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'cosmos_getAccounts',
        params: [network.id],
      });
      if (!account) {
        throw new Error('WALLETCONNECT_GET_ACCOUNTS_FAILED');
      }

      const {
        bech32Address: address,
        algo,
        pubKey: pubKeyInHex,
      } = account;
      if (!address || !algo || !pubKeyInHex) {
        throw new Error('WALLETCONNECT_GET_ACCOUNTS_RESULT_INCORRECT');
      }

      const pubkey = new Uint8Array(Buffer.from(pubKeyInHex, 'hex'));
      const accounts = [{ address, pubkey, algo }];
      const offlineSigner = {
        getAccounts: () => Promise.resolve(accounts),
        signAmino: async (signerAddress, signDoc) => {
          try {
            const [payload] = await this.connector.sendCustomRequest({
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
          } catch (error) {
            this.reset();
            if (error.message && error.message.includes(ERROR_MESSAGE_REJECTED_CALL_REQUEST)) {
              throw new Error('WALLETCONNECT_REJECTED_SIGN');
            }
            throw error;
          }
        },
      };
      this.signer = offlineSigner;
      this.accounts = accounts;
      this.isInited = true;
    } catch (error) {
      this.reset();
      if (error.message && error.message.includes(ERROR_MESSAGE_REJECTED_CALL_REQUEST)) {
        throw new Error('WALLETCONNECT_REJECTED_CALL_REQUEST');
      } else {
        throw new Error('WALLETCONNECT_UNKNOWN_ERROR');
      }
    }
  }

  async requestForLogin(loginMessage) {
    const payload = await Promise.race([
      this.connector.sendCustomRequest({
        id: payloadId(),
        jsonrpc: '2.0',
        method: 'likerId_login',
        params: [network.id, loginMessage],
      }),
      new Promise(resolve => setTimeout(() => resolve(), 5000)),
    ]);
    if (!payload) {
      throw new Error('WALLETCONNECT_LOGIN_TIMEOUT');
    }
    this.connector.killSession();
    return payload;
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
      if (this.connector.connected) {
        this.connector.killSession();
      }
      this.connector = null;
    }
    this.isInited = false;
    this.signer = null;
    this.accounts = [];
  }
}

export default new WalletConnect();
