function hexString(buffer) {
  const byteArray = new Uint8Array(buffer);
  const hexCodes = [...byteArray].map((value) => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, '0');
    return paddedHexCode;
  });
  return hexCodes.join('');
}

function digestMessage(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return window.crypto.subtle.digest('SHA-256', data);
}

export async function setUserSupportData(vue, u, { boot = false } = {}) {
  const {
    crispToken,
    displayName,
    email,
    wallet,
    cosmosWallet,
    primaryPhone,
    language,
    isAuthCore,
    LIKE,
  } = u;
  if (window.$crisp) {
    const { $crisp } = window;
    // restore if hidden
    $crisp.push(['do', 'chat:show']);
    if (displayName) $crisp.push(['set', 'user:nickname', [displayName]]);
    if (email) {
      const emailPayload = [email];
      if (crispToken) emailPayload.push(crispToken);
      $crisp.push(['set', 'user:email', emailPayload]);
    }
    if (primaryPhone) $crisp.push(['set', 'user:phone', [primaryPhone]]);
    const opt = [];
    if (boot) opt.push(['LikeCoin', true]);
    if (wallet) opt.push(['wallet', wallet]);
    if (cosmosWallet) opt.push(['cosmos_wallet', cosmosWallet]);
    if (LIKE) opt.push(['LIKE', LIKE]);
    if (language) opt.push(['language', language]);
    if (isAuthCore) opt.push(['binded_authcore', true]);
    $crisp.push(['set', 'session:data', [opt]]);
  }
}

export function setUserSupportErrorEvent(vue, message) {
  if (window.$crisp) {
    window.$crisp.push(['set', 'session:data', [[['lastError', message]]]]);
    window.$crisp.push(['set', 'session:event', [[['likecoin-store_error', message]]]]);
  }
}

export function setUserSupportOAuthFactors(vue, factors) {
  if (window.$crisp && factors) {
    const services = factors.map(f => f.service);
    const crispOpt = [];
    services.forEach((service) => {
      // eslint-disable-next-line no-param-reassign
      if (service) crispOpt.push([`binded_${service.toLowerCase()}`, true]);
    });
    if (window.$crisp) window.$crisp.push(['set', 'session:data', [crispOpt]]);
  }
}

export async function setTrackerUser({ user }) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  if (!user) return;
  window.dataLayer = window.dataLayer || [];
  try {
    let hashedId = await digestMessage(user);
    hashedId = hexString(hashedId);
    window.dataLayer.push({
      userId: hashedId,
    });
  } catch (err) {
    console.error(err);
  }
}

export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  try {
    if (window.$crisp) {
      window.$crisp.push(['set', 'session:event', [[[`likecoin-store_${action}`, { label }]]]]);
    }
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'customEvent',
      category,
      action,
      label,
      value,
    });
  } catch (err) {
    console.error('logging error:');
    console.error(err);
  }
}
export function logTimingEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  try {
    if (window.doNotTrack || navigator.doNotTrack) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'customTimingEvent',
      category,
      var: action,
      label,
      value,
    });
  } catch (err) {
    console.error('logging error:');
    console.error(err);
  }
}
export default logTrackerEvent;
