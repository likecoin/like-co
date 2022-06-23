import parse from 'url-parse';
import { getCookie, setCookie, removeCookie } from 'tiny-cookie';
import {
  LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN,
  REDIRECT_WHITE_LIST,
} from '~/constant';

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
    const w = window.open(url, name || '_blank', specs, replace);
    if (w) w.opener = null;
  }
}

export function tryPostLoginRedirect({ route }) {
  const { redirect, is_popup: isPopup } = route.query;
  if (redirect && REDIRECT_WHITE_LIST.indexOf(parse(redirect, {}).hostname) !== -1) {
    // Redirect to external link
    window.location.href = redirect;
    return true;
  }
  if (window.opener) {
    // Notify LikeButton iframe to refresh
    window.opener.postMessage({
      action: 'LOGGED_IN',
    }, LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN);
  }
  if (isPopup) {
    window.close();
    return true;
  }
  return false;
}

const LIKECO_FRONTEND_MODE_COOKIE_KEY = 'likeco_frontend_mode';

export function toggleFrontendMode() {
  if (getCookie(LIKECO_FRONTEND_MODE_COOKIE_KEY)) {
    removeCookie(LIKECO_FRONTEND_MODE_COOKIE_KEY);
  } else {
    setCookie(LIKECO_FRONTEND_MODE_COOKIE_KEY, 'legacy');
  }
  window.location.reload();
}

export function getFrontendMode() {
  return getCookie(LIKECO_FRONTEND_MODE_COOKIE_KEY) || 'default';
}
