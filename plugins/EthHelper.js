import EthHelper from '@/util/EthHelper';

const web3Error = 'Like function will not work without a wallet, is &nbsp;<a href="https://metamask.io/"> Metamask </a>&nbsp; installed?';
const testnetError = 'You are in wrong ETH network, please switch to testnet '
  + ' &nbsp;<a href="https://www.rinkeby.io/"> Rinkeby </a>&nbsp; in metamask.';
const lockedError = 'Cannot obtain your ETH wallet, please make sure it is UNLOCKED.';
const metamaskSignInfo = 'Please Sign your transaction in Metamask.';

export default ({ store }) => {
  EthHelper.initApp({
    errCb: (err) => {
      let errMsg = '';
      if (err === 'web3') errMsg = web3Error;
      else if (err === 'testnet') errMsg = testnetError;
      else if (err === 'locked') errMsg = lockedError;
      store.dispatch('setPopupError', errMsg);
    },
    clearErrCb: () => {
      store.dispatch('setPopupError', '');
    },
    onWalletCb: (wallet) => {
      store.dispatch('setLocalWallet', wallet);
      store.dispatch('isUser', wallet);
    },
    onSign: () => {
      store.dispatch('setPopupInfo', metamaskSignInfo);
    },
    onSigned: () => {
      store.dispatch('setPopupInfo', '');
    },
  });
};
