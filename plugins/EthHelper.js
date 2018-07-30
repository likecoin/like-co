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
    onSign: (payload) => {
      store.dispatch('setMetamaskError', 'sign');
      if (payload) store.dispatch('setSignPayloadObject', payload);
    },
    onLogin: () => {
      store.dispatch('setMetamaskError', 'login');
    },
    onSigned: () => {
      store.dispatch('setMetamaskError', '');
      store.dispatch('setSignPayloadObject', {});
    },
  });
};
