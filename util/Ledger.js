import network from './cosmos/network';

async function getHDPath(hdPathString) {
  const { Slip10RawIndex } = await import('@cosmjs/crypto');
  return hdPathString
    .split('/')
    .slice(1)
    .map((value) => {
      const { length } = value;
      if (value[length - 1] === "'") {
        return Slip10RawIndex.hardened(Number(value.slice(0, length - 1)));
      }
      return Slip10RawIndex.normal(Number(value.slice(0, length)));
    });
}

class Ledger {
  constructor() {
    this.ledgerTransport = '';
    this.signer = null;
    this.accounts = [];
  }

  async init() {
    const { LedgerSigner } = await import('@cosmjs/launchpad-ledger');
    const interactiveTimeout = 120000;
    const isWindows = navigator.platform.includes('Win');
    const hasHIDEnabled = !!navigator.hid;

    let transport;
    const { ledgerTransport } = this;
    if (isWindows) {
      if (!hasHIDEnabled) {
        throw new Error(
          "Your browser doesn't have HID enabled. Please enable this feature by visiting: chrome://flags/#enable-experimental-web-platform-features",
        );
      }
      const { default: TransportWebHID } = await import(
        // eslint-disable-next-line comma-dangle
        /* webpackChunkName: "webhid" */ '@ledgerhq/hw-transport-webhid'
      );
      if (!ledgerTransport) {
        transport = await TransportWebHID.create(
          interactiveTimeout,
          interactiveTimeout,
        );
      }
    } else {
      const { default: TransportWebUSB } = await import(
        // eslint-disable-next-line comma-dangle
        '@ledgerhq/hw-transport-webusb'
      );

      transport = await TransportWebUSB.create(
        interactiveTimeout,
        interactiveTimeout,
      );
    }
    if (!transport) transport = ledgerTransport;
    const signer = new LedgerSigner(transport, {
      testModeAllowed: true,
      hdPaths: [await getHDPath(network.HDPath)],
      prefix: network.addressPrefix,
    });
    this.accounts = await signer.getAccounts();
    this.signer = signer;
    this.ledgerTransport = ledgerTransport;
    return { ledger: signer, transport };
  }


  internalGetWalletAddress() {
    const [wallet = {}] = this.accounts;
    return wallet.address;
  }

  async getWalletAddress() {
    if (!this.accounts[0]) await this.init();
    return this.internalGetWalletAddress();
  }


  async signLogin(signPayload) {
    await this.init();
    const message = {
      chain_id: network.id,
      memo: signPayload,
      msgs: [],
      fee: { gas: '1', amount: { denom: 'nanolike', amount: '0' } },
      sequence: '0',
      account_number: '0',
    };
    const payload = await this.signer.sign(
      this.internalGetWalletAddress(),
      message,
    );
    return { message, ...payload };
  }

  async prepareCosmosTxSigner() {
    const { ledger: signerInstance } = await this.init();
    return async function signer(signMessage) {
      const data = JSON.parse(signMessage);
      const dataWithSign = await signerInstance.sign(this.internalGetWalletAddress(), data);
      const signObject = dataWithSign.signature;
      return {
        signature: Buffer.from(signObject.signature, 'base64'),
        publicKey: Buffer.from(signObject.pub_key.value, 'base64'),
      };
    };
  }
}

export default new Ledger();
