import Web3 from 'web3';
import { LIKE_COIN_ABI, LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';

const abiDecoder = require('abi-decoder');

abiDecoder.addABI(LIKE_COIN_ABI);

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

class EthHelper {
  initApp({
    errCb,
    clearErrCb,
    onWalletCb,
    onSign,
    onSigned,
  }) {
    this.errCb = errCb;
    this.clearErrCb = clearErrCb;
    this.onWalletCb = onWalletCb;
    this.onSign = onSign;
    this.onSigned = onSigned;
    this.pollForWeb3();
  }

  async pollForWeb3() {
    if (typeof window.web3 !== 'undefined') {
      if (this.retryTimer) {
        clearTimeout(this.retryTimer);
        this.retryTimer = null;
      }
      if (!this.web3) {
        this.web3 = new Web3(window.web3.currentProvider);
      }
      const network = await this.web3.eth.net.getNetworkType();
      if (network === 'rinkeby') {
        if (this.clearErrCb) this.clearErrCb();
        this.startApp();
        this.isMetaMask = true;
      } else {
        if (this.errCb) this.errCb('testnet');
        this.retryTimer = setTimeout(() => this.pollForWeb3(), 3000);
      }
    } else {
      if (this.errCb) this.errCb('web3');
      this.retryTimer = setTimeout(() => this.pollForWeb3(), 3000);
    }
  }

  startApp() {
    this.LikeCoin = new this.web3.eth.Contract(LIKE_COIN_ABI, LIKE_COIN_ADDRESS);
    this.getAccounts();
  }

  getAccounts() {
    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts && accounts[0]) {
        this.accounts = accounts;
        [this.wallet] = accounts;
        if (this.onWalletCb) this.onWalletCb(this.wallet);
        if (this.clearErrCb) this.clearErrCb();
      } else {
        if (this.isMetaMask && this.errCb) this.errCb('locked');
        this.retryTimer = setTimeout(() => this.getAccounts(), 3000);
      }
    });
  }

  async waitForTxToBeMined(txHash) {
    let txReceipt;
    while (!txReceipt) {
      /* eslint-disable no-await-in-loop */
      await timeout(1000);
      txReceipt = await this.web3.eth.getTransactionReceipt(txHash);
      if (txReceipt && (txReceipt.status === 0 || txReceipt.status === '0x0')) throw new Error('Transaction failed');
    }
  }

  getWallet() {
    return this.wallet;
  }

  async getTransferInfo(txHash) {
    const t = await this.web3.eth.getTransaction(txHash);
    if (!t) throw new Error('Cannot find transaction');
    if (t.to.toLowerCase() !== LIKE_COIN_ADDRESS.toLowerCase()) throw new Error('Not LikeCoin transaction');
    const decoded = abiDecoder.decodeMethod(t.input);
    const isDelegated = (decoded.name === 'transferDelegated');
    if (decoded.name !== 'transfer' && !isDelegated) throw new Error('Not LikeCoin Store transaction');
    if (!t.blockNumber) {
      /* eslint-disable no-underscore-dangle */
      const _to = this.web3.utils.toChecksumAddress(decoded.params.find(p => p.name === '_to').value);
      let _from = isDelegated ? decoded.params.find(p => p.name === '_from').value : t.from;
      _from = this.web3.utils.toChecksumAddress(_from);
      const _value = decoded.params.find(p => p.name === '_value').value;
      return {
        _from,
        _to,
        _value,
      };
    }
    const [r, block] = await Promise.all([
      this.web3.eth.getTransactionReceipt(txHash),
      this.web3.eth.getBlock(t.blockNumber),
    ]);
    if (!r.logs || !r.logs.length) throw new Error('Cannot fetch transaction Data');
    const [logs] = abiDecoder.decodeLogs(r.logs);
    const _to = this.web3.utils.toChecksumAddress(logs.events.find(p => p.name === '_to').value);
    const _from = this.web3.utils.toChecksumAddress(logs.events.find(p => p.name === '_from').value);
    const _value = logs.events.find(p => p.name === '_value').value;
    return {
      _to,
      _from,
      _value,
      timestamp: block.timestamp,
    };
  }

  async queryLikeCoinBalance(addr) {
    if (!addr) return '';
    return this.LikeCoin.methods.balanceOf(addr).call();
  }

  async genTypedSignData(from, to, value, maxReward) {
    let nonce;
    do {
      nonce = this.web3.utils.randomHex(32);
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
      this.web3.currentProvider.sendAsync(obj, (err, result) => {
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
    if (!this.isMetaMask) return Promise.reject(new Error('No MetaMask'));
    if (this.onSign) this.onSign();
    const from = this.getWallet();
    const signData = await this.genTypedSignData(from, to, value, maxReward);
    const nonce = signData.filter(param => param.name === 'nonce')[0].value;
    const rawSignature = (await this.signTyped(signData, from)).substr(2);
    if (this.onSigned) this.onSigned();
    if (!rawSignature) return Promise.reject(new Error('Signing Rejected'));
    const r = `0x${rawSignature.substr(0, 64)}`;
    const s = `0x${rawSignature.substr(64, 64)}`;
    const v = Number.parseInt(rawSignature.substr(128, 2), 16);
    const postData = {
      from,
      to,
      value: value.toString(10),
      maxReward: maxReward.toString(10),
      nonce,
      r,
      s,
      v,
    };
    return Promise.resolve(postData);
  }

  static genTypedSignNewUser(payload) {
    return [
      { type: 'string', name: 'payload', value: payload },
    ];
  }

  async signNewUser(payload) {
    if (!this.isMetaMask) return Promise.reject(new Error('No MetaMask'));
    const from = this.getWallet();
    const signData = EthHelper.genTypedSignNewUser(payload);
    const rawSignature = await this.signTyped(signData, from);
    if (!rawSignature) return Promise.reject(new Error('Signing Rejected'));
    return rawSignature;
  }
}

export default new EthHelper();
