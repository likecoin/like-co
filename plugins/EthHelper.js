import EthHelper from '@/util/EthHelper';

export default ({ store }) => {
  EthHelper.initApp({
    errCb: (err) => {
      store.dispatch('setMetamaskError', err);
    },
    clearErrCb: () => {
      store.dispatch('setMetamaskError', '');
    },
    onWalletCb: (wallet) => {
      store.dispatch('setLocalWallet', wallet);
      store.dispatch('isUser', wallet);
    },
    onSign: () => {
      store.dispatch('setMetamaskError', 'sign');
    },
    onSigned: () => {
      store.dispatch('setMetamaskError', '');
    },
  });
};
