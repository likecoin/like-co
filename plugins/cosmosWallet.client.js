export default ({ store }) => {
  if (window.localStorage) {
    const { defaultCosmosWalletSource } = window.localStorage;
    if (defaultCosmosWalletSource) {
      store.dispatch('setDefaultCosmosWalletSource', defaultCosmosWalletSource);
    }
  }
};
