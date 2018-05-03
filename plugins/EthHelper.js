import EthHelper from '@/util/EthHelper';

export default ({ store }) => {
  EthHelper.initApp({
    errCb: (err) => {
      store.dispatch('setWeb3IsFetching', false);
      store.dispatch('setMetamaskError', err);
    },
    retryCb: () => {
      store.dispatch('setWeb3IsFetching', true);
    },
    clearErrCb: () => {
      store.dispatch('setMetamaskError', '');
    },
    onWalletCb: async (wallet) => {
      await store.dispatch('onWalletChanged', wallet);
      await store.dispatch('setWeb3IsFetching', false);
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
