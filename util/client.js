export function checkIsMobileClient() {
  if (!global.window) return false;
  const ua = global.window.navigator.userAgent;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
    return true;
  }
  return false;
}

export function checkIsDesktopChrome() {
  if (!global.window) return false;
  const ua = global.window.navigator.userAgent;
  const uv = global.window.navigator.vendor;
  if (checkIsMobileClient()) return false;
  return (/Chrome/i.test(ua) && /Google/i.test(uv)) && !(/OPR/i.test(ua));
}

export function checkIsTrustClient(vue) {
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
  if (checkIsTrustClient(vue)) {
    window.location.assign(url);
  } else {
    window.open(url, name || '_blank', specs, replace).opener = null;
  }
}
