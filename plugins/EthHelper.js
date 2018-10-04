import EthHelper from '@/util/EthHelper';

export default ({ store }) => {
  EthHelper.initApp({
    errCb: (err) => {
      store.dispatch('setMetamaskError', err);
    },
    clearErrCb: () => {
      store.dispatch('setMetamaskError', '');
    },
    onWalletCb: async (wallet) => {
      await store.dispatch('onWalletChanged', wallet);
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
