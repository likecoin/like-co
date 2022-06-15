/* eslint-disable max-len */
/* eslint-disable prefer-template */
import network from './cosmos/network';
import { timeout } from '@/util/misc';

function configToKeplrCoin(denom) {
  const c = network.coinLookup.find(coin => coin.viewDenom === denom);
  return {
    coinDenom: c.viewDenom,
    coinMinimalDenom: c.chainDenom,
    coinDecimals: c.chainToViewConversionFactor
      .toString()
      .split('.')[1].length,
    coinGeckoId: c.coinGeckoId,
  };
}

class Keplr {
  constructor() {
    this.offlineSigner = null;
    this.accounts = [];
    this.inited = false;
  }

  async checkIfInited() {
    if (!this.inited) {
      const res = await this.initKeplr();
      if (!res) throw new Error('CANNOT_INIT_KEPLR');
    }
  }

  async initKeplr() {
    if (this.inited) return true;
    if (!window.keplr) {
      let tries = 0;
      const TRY_COUNT = 3;
      while (!window.keplr && TRY_COUNT > tries) {
        // eslint-disable-next-line no-await-in-loop
        await timeout(1000);
        tries += 1;
      }
    }
    if (window.keplr && window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain({
          chainId: network.id,
          chainName: network.name,
          rpc: network.rpcURL,
          rest: network.apiURL,
          stakeCurrency: configToKeplrCoin(network.stakingDenom),
          walletUrlForStaking: network.stakingWalletURL,
          bip44: {
            coinType: 118,
          },
          bech32Config: {
            bech32PrefixAccAddr: network.addressPrefix,
            bech32PrefixAccPub: network.addressPrefix + 'pub',
            bech32PrefixValAddr: network.addressPrefix + 'valoper',
            bech32PrefixValPub: network.addressPrefix + 'valoperpub',
            bech32PrefixConsAddr: network.addressPrefix + 'valcons',
            bech32PrefixConsPub: network.addressPrefix + 'valconspub',
          },
          currencies: network.coinLookup.map(({ viewDenom }) => configToKeplrCoin(viewDenom)),
          feeCurrencies: network.coinLookup.map(({ viewDenom }) => configToKeplrCoin(viewDenom)),
          coinType: 118,
          gasPriceStep: {
            low: 1,
            average: 10,
            high: 1000,
          },
          features: [
            'stargate',
            'ibc-transfer',
            'no-legacy-stdTx',
            'ibc-go',
          ],
        });
        await window.keplr.enable(network.id);

        const offlineSigner = window.getOfflineSigner(network.id);
        this.signer = offlineSigner;
        this.accounts = await offlineSigner.getAccounts();
        this.inited = true;
        return true;
      } catch (error) {
        console.error(error);
      }
    }
    return false;
  }

  async getKeplrSigner() {
    await this.checkIfInited();
    return this.signer;
  }

  getIsInited() {
    return this.inited;
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
    if (!window.keplr) throw new Error('CANNOT_FIND_KEPLR');
    window.keplr.defaultOptions = window.keplr.defaultOptions || {};
    const originalConfig = window.keplr.defaultOptions.sign || {};
    window.keplr.defaultOptions.sign = {
      ...originalConfig,
      preferNoSetFee: true,
      preferNoSetMemo: true,
    };
    const message = {
      chain_id: network.id,
      memo: signPayload,
      msgs: [],
      fee: { gas: '1', amount: [{ denom: 'nanolike', amount: '0' }] },
      sequence: '0',
      account_number: '0',
    };
    const payload = await this.signer.sign(
      this.internalGetWalletAddress(),
      message,
    );
    window.keplr.defaultOptions.sign = originalConfig;
    return { message, ...payload };
  }

  async prepareCosmosTxSigner() {
    await this.checkIfInited();
    return this.signer;
  }
}

export default new Keplr();
