/* eslint-disable no-underscore-dangle */
import Web3 from 'web3';
import { LIKE_COIN_ABI, LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';
import { LIKE_COIN_ICO_ABI, LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import { IS_TESTNET, INFURA_HOST } from '@/constant';

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
    this.wallet = '';
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
      if (!this.web3 || this.isOnInfura) {
        this.isOnInfura = false;
        this.web3 = new Web3(window.web3.currentProvider);
      }
      const network = await this.web3.eth.net.getNetworkType();
      const target = (IS_TESTNET ? 'rinkeby' : 'main');
      if (network === target) {
        if (this.clearErrCb) this.clearErrCb();
        this.startApp();
        this.isMetaMask = true;
      } else {
        if (this.errCb) this.errCb('testnet');
        this.retryTimer = setTimeout(() => this.pollForWeb3(), 3000);
      }
    } else {
      if (this.errCb) this.errCb('web3');
      if (!this.isOnInfura) {
        const provider = new Web3.providers.HttpProvider(INFURA_HOST);
        this.web3 = new Web3(provider);
        this.isOnInfura = true;
      }
      this.retryTimer = setTimeout(() => this.pollForWeb3(), 3000);
    }
  }

  startApp() {
    this.LikeCoin = new this.web3.eth.Contract(LIKE_COIN_ABI, LIKE_COIN_ADDRESS);
    this.LikeCoinICO = new this.web3.eth.Contract(LIKE_COIN_ICO_ABI, LIKE_COIN_ICO_ADDRESS);
    this.getAccounts();
    this.pollingTimer = setInterval(() => this.getAccounts(), 3000);
  }

  getAccounts() {
    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts && accounts[0]) {
        if (this.wallet !== accounts[0]) {
          this.accounts = accounts;
          [this.wallet] = accounts;
          if (this.onWalletCb) this.onWalletCb(this.wallet);
          if (this.clearErrCb) this.clearErrCb();
        }
      } else if (this.isMetaMask && this.errCb) {
        this.wallet = '';
        this.errCb('locked');
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

  async getTransactionCompleted(txHash) {
    const t = await this.web3.eth.getTransaction(txHash);
    if (!t) return 0;
    if (t.blockNumber) {
      const [r, block] = await Promise.all([
        this.web3.eth.getTransactionReceipt(txHash),
        this.web3.eth.getBlock(t.blockNumber),
      ]);
      return {
        ts: (block && r) ? block.timestamp : 0,
        isFailed: (r && r.status === '0x0'),
      };
    }
    return {
      ts: 0,
      isFailed: false,
    };
  }

  async getEthTransferInfo(txHash, tx) {
    let t = tx;
    if (!t) t = await this.web3.eth.getTransaction(txHash);
    if (!t) throw new Error('Cannot find transaction');
    let _to = this.web3.utils.toChecksumAddress(t.to);
    let _from = this.web3.utils.toChecksumAddress(t.from);
    let _value = t.value;
    if (!t.blockNumber) {
      return {
        isEth: true,
        _from,
        _to,
        _value,
      };
    }
    const [r, block] = await Promise.all([
      this.web3.eth.getTransactionReceipt(txHash),
      this.web3.eth.getBlock(t.blockNumber),
    ]);
    _to = this.web3.utils.toChecksumAddress(r.to);
    _from = this.web3.utils.toChecksumAddress(r.from);
    _value = t.value;
    return {
      isEth: true,
      isFailed: r && r.status === '0x0',
      _to,
      _from,
      _value,
      timestamp: block ? block.timestamp : 0,
    };
  }

  async getTransferInfo(txHash, opt) {
    const { blocking } = opt;
    let t = await this.web3.eth.getTransaction(txHash);
    while (!t && blocking) {
      await timeout(1000); // eslint-disable-line no-await-in-loop
      t = await this.web3.eth.getTransaction(txHash);
    }
    if (!t) throw new Error('Cannot find transaction');
    if (t.value > 0) return this.getEthTransferInfo(txHash, t);
    if (t.to.toLowerCase() !== LIKE_COIN_ADDRESS.toLowerCase()) throw new Error('Not LikeCoin transaction');
    const decoded = abiDecoder.decodeMethod(t.input);
    const isDelegated = (decoded.name === 'transferDelegated');
    if (decoded.name !== 'transfer' && !isDelegated) throw new Error('Not LikeCoin Store transaction');

    const txTo = decoded.params.find(p => p.name === '_to').value;
    let _to = this.web3.utils.toChecksumAddress(txTo);
    let _from = isDelegated ? decoded.params.find(p => p.name === '_from').value : t.from;
    _from = this.web3.utils.toChecksumAddress(_from);
    let _value = decoded.params.find(p => p.name === '_value').value;
    if (!t.blockNumber) {
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
    if (!r || r.status === '0x0') {
      return {
        isFailed: (r && r.status === '0x0'),
        _to,
        _from,
        _value,
        timestamp: block ? block.timestamp : 0,
      };
    }
    if (!r.logs || !r.logs.length) throw new Error('Cannot fetch transaction Data');
    const logs = abiDecoder.decodeLogs(r.logs);
    const targetLogs = logs.filter(l => (l.events.find(e => e.name === 'to').value) === txTo);
    if (!targetLogs || !targetLogs.length) throw new Error('Cannot parse receipt');
    const [log] = targetLogs;
    _to = this.web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'to')).value);
    _from = this.web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'from')).value);
    _value = log.events.find(p => (p.name === 'value')).value;
    return {
      _to,
      _from,
      _value,
      timestamp: block ? block.timestamp : 0,
    };
  }

  async queryLikeCoinBalance(addr) {
    if (!addr) return '';
    return this.LikeCoin.methods.balanceOf(addr).call();
  }

  async queryEthBalance(addr) {
    if (!addr) return '';
    return this.web3.eth.getBalance(addr);
  }

  async queryKYCStatus(addr) {
    const address = addr || this.wallet || '';
    if (!address) return false;
    return this.LikeCoinICO.methods.kycDone(address).call();
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

  async sendTransaction(to, value) {
    if (!this.isMetaMask) return Promise.reject(new Error('No MetaMask'));
    if (this.onSign) this.onSign();
    const txEventEmitter = new Promise((resolve, reject) => {
      this.web3.eth.sendTransaction({
        from: this.wallet,
        to,
        value,
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

  static genTypedSignUserPayload(payload) {
    return [
      { type: 'string', name: 'payload', value: payload },
    ];
  }

  async signUserPayload(payload) {
    if (!this.isMetaMask) return Promise.reject(new Error('No MetaMask'));
    const from = this.getWallet();
    if (this.onSign) this.onSign();
    const signData = EthHelper.genTypedSignUserPayload(payload);
    const rawSignature = await this.signTyped(signData, from);
    if (this.onSigned) this.onSigned();
    if (!rawSignature) return Promise.reject(new Error('Signing Rejected'));
    return rawSignature;
  }
}

export default new EthHelper();
