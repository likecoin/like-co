export function isTrustClient(vue) {
  return vue.$store.getters.getWeb3Type === 'window' && window.web3 && window.web3.currentProvider.isTrust;
}

export function isAndroid() {
  if (!navigator) return false;
  return /(android)/i.test(navigator.userAgent);
}

export function isIOS() {
  if (!navigator) return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function openURL(vue, url, name, specs, replace) {
  if (isTrustClient(vue)) {
    window.location.assign(url);
  } else {
    window.open(url, name || '_blank', specs, replace);
  }
}
