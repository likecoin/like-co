export default ({ store }) => {
  if (window && window.localStorage) {
    const accessToken = window.localStorage.getItem('authcore.accessToken');
    if (accessToken) store.dispatch('setAuthCoreToken', accessToken);
  }
};
