/* eslint-disable no-underscore-dangle */
import Web3 from 'web3';

import { LIKE_COIN_ABI, LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';
import { LIKE_COIN_ICO_ABI, LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import { IS_TESTNET, INFURA_HOST } from '@/constant';

const abiDecoder = require('@likecoin/abi-decoder/dist/es5');

abiDecoder.addABI(LIKE_COIN_ABI);

async function createLedgerWeb3(networkId) {
  /* for ledger */
  let [
    ProviderEngine,
    FetchSubprovider,
    TransportU2F,
    createLedgerSubprovider,
  ] = await Promise.all([
    import(/* webpackChunkName: "ledger" */ 'web3-provider-engine/dist/es5'),
    import(/* webpackChunkName: "ledger" */ 'web3-provider-engine/dist/es5/subproviders/fetch'),
    import(/* webpackChunkName: "ledger" */ '@ledgerhq/hw-transport-u2f'),
    import(/* webpackChunkName: "ledger" */ '@ledgerhq/web3-subprovider'),
  ]);
  if (ProviderEngine.default) ProviderEngine = ProviderEngine.default;
  if (FetchSubprovider.default) FetchSubprovider = FetchSubprovider.default;
  if (TransportU2F.default) TransportU2F = TransportU2F.default;
  if (createLedgerSubprovider.default) createLedgerSubprovider = createLedgerSubprovider.default;
  const engine = new ProviderEngine();
  const getTransport = () => TransportU2F.create();
  const ledger = createLedgerSubprovider(getTransport, {
    networkId,
    accountsLength: 1,
  });
  engine.addProvider(ledger);
  engine.addProvider(new FetchSubprovider({ rpcUrl: INFURA_HOST }));
  engine.start();
  return new Web3(engine);
}

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
    retryCb,
    onWalletCb,
    onSetWeb3,
    onSign,
    onSigned,
  }) {
    this.wallet = '';
    this.errCb = errCb;
    this.clearErrCb = clearErrCb;
    this.retryCb = retryCb;
    this.onWalletCb = onWalletCb;
    this.onSetWeb3 = onSetWeb3;
    this.onSign = onSign;
    this.onSigned = onSigned;
    this.pollForWeb3();
  }

  async pollForWeb3(initType) {
    this.isInited = false;
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (initType || typeof window.web3 !== 'undefined') {
      if (initType === 'ledger' && this.web3Type !== 'ledger') {
        this.web3 = await createLedgerWeb3(IS_TESTNET ? 4 : 1);
        this.setWeb3Type('ledger');
      } else if (!this.web3 || this.web3Type !== 'window') {
        this.setWeb3Type('window');
        this.web3 = new Web3(window.web3.currentProvider);
      }
      const network = await this.web3.eth.net.getNetworkType();
      const target = (IS_TESTNET ? 'rinkeby' : 'main');
      if (network === target) {
        if (this.retryCb) this.retryCb();
        this.startApp();
        this.isInited = true;
      } else {
        if (this.errCb) this.errCb('testnet');
        this.retryTimer = setTimeout(() => this.pollForWeb3(initType), 3000);
      }
    } else {
      if (this.errCb) this.errCb('web3');
      if (this.web3Type !== 'infura') {
        const provider = new Web3.providers.HttpProvider(INFURA_HOST);
        this.web3 = new Web3(provider);
        this.setWeb3Type('infura');
      }
      this.retryTimer = setTimeout(() => this.pollForWeb3(initType), 3000);
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
      } else if (this.isInited && this.errCb) {
        this.wallet = '';
        this.errCb('locked');
      }
    });
  }

  setLedgerOn() {
    this.pollForWeb3('ledger');
  }

  resetWeb3() {
    this.pollForWeb3('window');
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

  utf8ToHex(data) {
    return this.web3.utils.utf8ToHex(data);
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
    return (this.web3Type !== 'ledger' && this.web3Type !== 'infura');
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
    const isDelegated = decoded.name === 'transferDelegated';
    const isLock = decoded.name === 'transferAndLock';
    if (decoded.name !== 'transfer' && !isDelegated && !isLock) {
      throw new Error('Not LikeCoin Store transaction');
    }
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
    if (isDelegated) {
      const targetLogs = logs.filter(l => (l.events
        .find(e => e.name === 'to').value.toLowerCase()) === txTo.toLowerCase());
      if (!targetLogs || !targetLogs.length) throw new Error('Cannot parse receipt');
      const [log] = targetLogs;
      _to = this.web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'to')).value);
      _from = isDelegated ? this.web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'from')).value) : t.from;
      _value = log.events.find(p => (p.name === 'value')).value;
    } else if (isLock) {
      const targetLogs = logs.filter(l => (l.name === 'Transfer'));
      if (!targetLogs || !targetLogs.length) throw new Error('Cannot parse receipt');
      const [log] = targetLogs;
      _to = this.web3.utils.toChecksumAddress(log.events.find(p => (p.name === 'to')).value);
      _value = log.events.find(p => (p.name === 'value')).value;
    }
    return {
      _to,
      _from,
      _value,
      timestamp: block ? block.timestamp : 0,
    };
  }

  async queryLikeCoinBalance(addr) {
    const address = addr || this.wallet || '';
    if (!address) return '';
    return this.LikeCoin.methods.balanceOf(address).call();
  }

  async queryEthBalance(addr) {
    const address = addr || this.wallet || '';
    if (!address) return '';
    return this.web3.eth.getBalance(address);
  }

  async queryKYCStatus(addr) {
    const address = addr || this.wallet || '';
    if (!address) return false;
    return this.LikeCoinICO.methods.kycDone(address).call();
  }

  async getAddressPurchaseEvents(addr) {
    return this.LikeCoinICO.getPastEvents('Purchase', {
      fromBlock: 0,
      filter: {
        _addr: addr,
      },
    });
  }

  async getAddressPurchaseTotal(addr) {
    const address = addr || this.wallet || '';
    return (await this.getAddressPurchaseEvents(address))
      .reduce(
        (acc, e) => ({
          coin: acc.coin.add(new this.web3.utils.BN(e.returnValues._coins)),
          eth: acc.eth.add(new this.web3.utils.BN(e.returnValues._ethers)),
        }),
        { coin: new this.web3.utils.BN(0), eth: new this.web3.utils.BN(0) },
      );
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
    if (!this.getIsSupportTransferDelegated()) {
      return Promise.reject(new Error('Not Supported'));
    }
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
    if (!this.isInited) return Promise.reject(new Error('No web3'));
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

  async signUserPayload(payload) {
    if (!this.isInited) return Promise.reject(new Error('No web3'));
    const from = this.getWallet();
    if (this.onSign) this.onSign();
    try {
      const rawSignature = await this.web3.eth.personal.sign(payload, from);
      if (this.onSigned) this.onSigned();
      if (!rawSignature) return Promise.reject(new Error('Signing Rejected'));
      return rawSignature;
    } catch (err) {
      if (this.onSigned) this.onSigned();
      throw err;
    }
  }
}

export default new EthHelper();
