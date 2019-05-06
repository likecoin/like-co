/* eslint-disable no-underscore-dangle */
import { IS_TESTNET, INFURA_HOST, CONFIRMATION_NEEDED } from '@/constant';

import { getTxInfo, getTxReceipt } from './txInfo/txInfo';
import { isReceiptSuccess } from './txInfo/receipt';
import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin-address';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function prettifyNumber(n) {
  const s = n.toString(10);
  let start = 0;
  let until = ((s.length + 2) % 3) + 1;
  const arr = [];
  while (start < s.length) {
    arr.push(s.substr(start, until - start));
    start = until;
    until += 3;
  }
  return arr.join(' ');
}

function filterMultipleTransferTo(address, data) {
  if (!address
    || data._from === address
    || !Array.isArray(data._to)
    || !Array.isArray(data._value)) return data;
  const to = [];
  const value = [];
  data._to.forEach((addr, index) => {
    if (addr === address) {
      to.push(addr);
      value.push(data._value[index]);
    }
  });
  return {
    ...data,
    _to: to,
    _value: value,
  };
}

class EthHelper {
  initApp({
    errCb,
    clearErrCb,
    onWalletCb,
    onSetWeb3,
    onSign,
    onLogin,
    onSigned,
  }) {
    this.abiDecoder = null;
    this.queryWeb3 = null;
    this.Web3 = null;
    Object.assign(this, {
      wallet: '',
      errCb,
      clearErrCb,
      onWalletCb,
      onSetWeb3,
      onSign,
      onLogin,
      onSigned,
    });
  }

  async initAbiDecoder() {
    if (this.abiDecoder) return;
    const [
      { LIKE_COIN_ABI },
      abiDecoderLib,
    ] = await Promise.all([
      import(/* webpackChunkName: "web3" */ '@/constant/contract/likecoin-abi'),
      import(/* webpackChunkName: "web3" */ '@likecoin/abi-decoder/dist/es5'),
    ]);
    const abiDecoder = abiDecoderLib.default || abiDecoderLib;
    this.abiDecoder = abiDecoder;
    this.abiDecoder.addABI(LIKE_COIN_ABI);
  }

  async initQueryWeb3() {
    if (this.queryWeb3) return;
    if (this.initWeb3Promise) {
      await this.initWeb3Promise;
      return;
    }
    this.initWeb3Promise = this.handleQueryWeb3Init();
    await this.initWeb3Promise;
  }

  async handleQueryWeb3Init() {
    const [
      Web3Lib,
    ] = await Promise.all([
      import(/* webpackChunkName: "web3" */ 'web3'),
    ]);
    const Web3 = Web3Lib.default || Web3Lib;
    this.Web3 = Web3;
    const provider = new Web3.providers.HttpProvider(INFURA_HOST);
    const web3Instance = new Web3(provider);
    this.queryWeb3 = web3Instance;
  }

  async initQueryLikeCoin() {
    if (this.queryLikeCoin) return;
    const [
      { LIKE_COIN_ABI },
    ] = await Promise.all([
      import(/* webpackChunkName: "web3" */ '@/constant/contract/likecoin-abi'),
    ]);
    this.queryLikeCoin = new this.queryWeb3.eth.Contract(LIKE_COIN_ABI, LIKE_COIN_ADDRESS);
  }

  clearTimers() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
  }

  async pollForWeb3(initType = 'window') {
    this.isInited = false;
    this.clearTimers();
    try {
      if (!this.queryWeb3) await this.initQueryWeb3();
      if (typeof window.web3 !== 'undefined') {
        if (!this.actionWeb3 || this.web3Type !== 'window') {
          this.setWeb3Type('window');
          this.actionWeb3 = new this.Web3(window.web3.currentProvider);
        }
        const network = await this.actionWeb3.eth.net.getNetworkType();
        const target = (IS_TESTNET ? 'rinkeby' : 'main');
        if (network === target) {
          await this.startApp();
          this.isInited = true;
        } else {
          if (this.errCb) this.errCb('testnet');
          this.retryTimer = setTimeout(() => this.pollForWeb3(initType), 3000);
        }
      } else {
        if (this.errCb) this.errCb('web3');
        if (this.web3Type !== 'infura') {
          this.actionWeb3 = this.queryWeb3;
          this.setWeb3Type('infura');
        }
        if (initType === 'window') return;
        this.retryTimer = setTimeout(() => this.pollForWeb3(initType), 3000);
      }
    } catch (err) {
      console.error(err);
      this.clearTimers();
      this.retryTimer = setTimeout(() => this.pollForWeb3(initType), 2000);
    }
  }

  async startApp() {
    const [
      { LIKE_COIN_ABI },
    ] = await Promise.all([
      import(/* webpackChunkName: "web3" */ '@/constant/contract/likecoin-abi'),
    ]);
    this.LikeCoin = new this.actionWeb3.eth.Contract(LIKE_COIN_ABI, LIKE_COIN_ADDRESS);
    setTimeout(() => this.pollForAccounts());
  }

  pollForAccounts() {
    this.getAccounts();
    this.pollingTimer = setInterval(() => this.getAccounts(), 3000);
  }

  async getAccounts() {
    if (this.isInited) {
      const accounts = await this.actionWeb3.eth.getAccounts();
      if (accounts && accounts[0]) {
        if (this.wallet !== accounts[0]) {
          this.accounts = accounts;
          [this.wallet] = accounts;
          if (this.onWalletCb) this.onWalletCb(this.wallet);
          if (this.clearErrCb) this.clearErrCb();
        }
      } else if (this.isInited && this.errCb) {
        this.wallet = '';
        if (this.onWalletCb) this.onWalletCb('');
        this.errCb('locked');
        if (this.web3Type === 'window' && window.ethereum) {
          try {
            await window.ethereum.enable();
          } catch (e) {
            // disable if users do not approve metamask access
            this.disableWeb3();
          }
        }
      }
    }
  }

  resetWeb3() {
    this.pollForWeb3();
  }

  async waitForTxToBeMined(txHash) {
    let done = false;
    if (!this.queryWeb3) await this.initQueryWeb3();
    while (!done) {
      /* eslint-disable no-await-in-loop */
      await timeout(1000);
      const [t, txReceipt, currentBlockNumber] = await Promise.all([
        this.queryWeb3.eth.getTransaction(txHash),
        this.queryWeb3.eth.getTransactionReceipt(txHash),
        this.queryWeb3.eth.getBlockNumber(),
      ]);
      if (txReceipt && !isReceiptSuccess(txReceipt)) throw new Error('Transaction failed');
      done = t && txReceipt && currentBlockNumber && t.blockNumber
        && (currentBlockNumber - t.blockNumber > CONFIRMATION_NEEDED);
    }
  }

  async utf8ToHex(data) {
    if (!this.queryWeb3) await this.initQueryWeb3();
    return this.queryWeb3.utils.utf8ToHex(data);
  }

  setWeb3Type(type) {
    this.web3Type = type;
    if (this.onSetWeb3) this.onSetWeb3(type);
  }

  getWallet() {
    return this.wallet;
  }

  getIsSupportTransferDelegated() {
    /* Trust not support Bignumber yet */
    if (this.web3Type === 'window' && window.web3 && window.web3.currentProvider.isTrust) {
      return false;
    }
    return this.web3Type !== 'infura';
  }

  async getTransactionCompleted(txHash) {
    if (!this.queryWeb3) await this.initQueryWeb3();
    const [t, currentBlockNumber] = await Promise.all([
      this.queryWeb3.eth.getTransaction(txHash),
      this.queryWeb3.eth.getBlockNumber(),
    ]);
    if (!t || !currentBlockNumber) {
      return 0;
    }
    if (t.blockNumber && (currentBlockNumber - t.blockNumber > CONFIRMATION_NEEDED)) {
      const [r, block] = await Promise.all([
        this.queryWeb3.eth.getTransactionReceipt(txHash),
        this.queryWeb3.eth.getBlock(t.blockNumber),
      ]);
      return {
        ts: (block && r) ? block.timestamp : 0,
        isFailed: (r && !isReceiptSuccess(r)),
      };
    }
    return {
      ts: 0,
      isFailed: false,
    };
  }

  async getTransferInfo(txHash, opt) {
    if (!this.queryWeb3) await this.initQueryWeb3();
    if (!this.abiDecoder) await this.initAbiDecoder();
    const { queryWeb3: web3Instance, abiDecoder } = this;
    const { blocking, filterAddress } = opt;
    let [t, currentBlockNumber] = await Promise.all([
      web3Instance.eth.getTransaction(txHash),
      web3Instance.eth.getBlockNumber(),
    ]);
    while ((!t || !currentBlockNumber) && blocking) {
      await timeout(1000); // eslint-disable-line no-await-in-loop
      ([t, currentBlockNumber] = await Promise.all([
        web3Instance.eth.getTransaction(txHash),
        web3Instance.eth.getBlockNumber(),
      ]));
    }
    if (!t || !currentBlockNumber) throw new Error('Cannot find transaction');
    const {
      type,
      _to,
      _from,
      _value,
    } = getTxInfo(abiDecoder, web3Instance, t);
    if (!t.blockNumber || (currentBlockNumber - t.blockNumber < CONFIRMATION_NEEDED)) {
      return filterMultipleTransferTo(filterAddress, {
        _from,
        _to,
        _value,
      });
    }
    const receipt = await getTxReceipt(
      type,
      abiDecoder,
      web3Instance,
      txHash,
      t,
      _to,
      _from,
      _value,
    );
    if (receipt.isFailed) {
      return filterMultipleTransferTo(filterAddress, {
        isFailed: receipt.isFailed,
        _to: receipt._to,
        _from: receipt._from,
        _value: receipt._value,
        timestamp: receipt.timestamp,
      });
    }
    return filterMultipleTransferTo(filterAddress, receipt);
  }

  async queryLikeCoinBalance(addr) {
    const address = addr || this.wallet || '';
    if (!address) return '';
    if (!this.queryWeb3) await this.initQueryWeb3();
    if (!this.queryLikeCoin) await this.initQueryLikeCoin();
    return this.queryLikeCoin.methods.balanceOf(address).call();
  }

  async queryEthBalance(addr) {
    const address = addr || this.wallet || '';
    if (!address) return '';
    if (!this.queryWeb3) await this.initQueryWeb3();
    return this.queryWeb3.eth.getBalance(address);
  }

  async genTypedSignData(from, to, value, maxReward) {
    let nonce;
    do {
      nonce = this.actionWeb3.utils.randomHex(32);
    } while (await this.LikeCoin.methods.usedNonce(from, nonce).call());
    return [
      { type: 'address', name: 'contract', value: LIKE_COIN_ADDRESS },
      { type: 'string', name: 'method', value: 'transferDelegated' },
      { type: 'address', name: 'to', value: to },
      { type: 'uint256', name: 'value', value: prettifyNumber(value) },
      { type: 'uint256', name: 'maxReward', value: prettifyNumber(maxReward) },
      { type: 'uint256', name: 'nonce', value: nonce },
    ];
  }

  sendAsync(obj) {
    return new Promise((resolve, reject) => {
      this.actionWeb3.currentProvider.sendAsync(obj, (err, result) => {
        if (err) {
          reject(err);
        } else if (result.error) {
          reject(result.error);
        } else {
          resolve(result.result || result);
        }
      });
    });
  }

  async signTyped(signData, from) {
    try {
      const result = await this.sendAsync({
        method: 'eth_signTypedData',
        params: [signData, from],
        from,
      });
      return result;
    } catch (err) {
      console.error(err);
    }
    return '';
  }

  async signTransferDelegated(to, value, maxReward) {
    if (!this.getIsSupportTransferDelegated()) {
      return Promise.reject(new Error('Not Supported'));
    }
    if (this.onSign) {
      this.onSign({
        action: 'sendLIKE',
        payload: { to, value },
      });
    }
    const from = this.getWallet();
    const signData = await this.genTypedSignData(from, to, value, maxReward);
    const nonce = signData.filter(param => param.name === 'nonce')[0].value;
    const rawSignature = (await this.signTyped(signData, from)).substr(2);
    if (this.onSigned) this.onSigned();
    if (!rawSignature) return Promise.reject(new Error('Signing Rejected'));
    const signature = `0x${rawSignature}`;
    const postData = {
      from,
      to,
      value: value.toString(10),
      maxReward: maxReward.toString(10),
      nonce,
      signature,
    };
    return Promise.resolve(postData);
  }

  async sendTransaction(to, value, { gasPrice, gasLimit } = {}) {
    if (!this.isInited) return Promise.reject(new Error('No web3'));
    if (this.onSign) this.onSign();
    const txEventEmitter = new Promise((resolve, reject) => {
      this.actionWeb3.eth.sendTransaction({
        from: this.wallet,
        to,
        value,
        gasPrice,
        gasLimit,
      })
        .on('transactionHash', (hash) => {
          if (this.onSigned) this.onSigned();
          resolve(hash);
        })
        .on('error', (err) => {
          if (this.onSigned) this.onSigned();
          reject(err);
        });
    });
    return txEventEmitter;
  }

  async signLogin(payload) {
    if (!this.isInited) return Promise.reject(new Error('No web3'));
    if (this.onLogin) this.onLogin();
    return this.personalSign(payload);
  }

  async signUserPayload(payload) {
    if (!this.isInited) return Promise.reject(new Error('No web3'));
    if (this.onSign) this.onSign();
    return this.personalSign(payload);
  }

  async personalSign(payload) {
    if (!this.isInited) return Promise.reject(new Error('No web3'));
    const from = this.getWallet();
    try {
      const rawSignature = await this.actionWeb3.eth.personal.sign(payload, from);
      if (this.onSigned) this.onSigned();
      if (!rawSignature) return Promise.reject(new Error('Signing Rejected'));
      return rawSignature;
    } catch (err) {
      if (this.onSigned) this.onSigned();
      throw err;
    }
  }

  getIsInited() {
    return this.isInited;
  }

  disableWeb3() {
    this.isInited = false;
  }
}

export default new EthHelper();
