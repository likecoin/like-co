import EthHelper from '@/util/EthHelper';

export default ({ store }) => {
  EthHelper.initApp({
    errCb: (err) => {
      store.dispatch('setUserIsFetching', false);
      store.dispatch('setMetamaskError', err);
    },
    retryCb: () => {
      store.dispatch('setUserIsFetching', true);
    },
    clearErrCb: () => {
      store.dispatch('setMetamaskError', '');
    },
    onWalletCb: (wallet) => {
      store.dispatch('setLocalWallet', wallet);
      store.dispatch('onWalletChanged');
    },
    onSetWeb3: (type) => {
      store.dispatch('setWeb3Type', type);
    },
    onSign: () => {
      store.dispatch('setMetamaskError', 'sign');
    },
    onSigned: () => {
      store.dispatch('setMetamaskError', '');
    },
  });
};
