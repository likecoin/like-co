export function isTrustClient(vue) {
  return vue.$store.getters.getWeb3Type === 'window' && window.web3 && window.web3.currentProvider.isTrust;
}

export function openURL(vue, url, name, specs, replace) {
  if (isTrustClient(vue)) {
    window.location.assign(url);
  } else {
    window.open(url, name || '_blank', specs, replace);
  }
}
