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
    user,
    intercomToken,
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
  if (vue.$intercom) {
    const opt = {};
    if (boot) opt.LikeCoin = true;
    if (user) opt.user_id = user;
    if (intercomToken) opt.user_hash = intercomToken;
    if (displayName) opt.name = displayName;
    if (email) opt.email = email;
    if (primaryPhone) opt.phone = primaryPhone;
    if (wallet) opt.wallet = wallet;
    if (cosmosWallet) opt.cosmos_wallet = cosmosWallet;
    if (LIKE) opt.LIKE = LIKE;
    if (language) opt.language = language;
    if (isAuthCore) opt.binded_authcore = true;
    vue.$intercom.update(opt);
  }
  if (window.$crisp) {
    const { $crisp } = window;
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
    window.$crisp.push(['set', 'session:data', [opt]]);
  }
}

export function setUserSupportErrorEvent(vue, message) {
  if (vue.$intercom) {
    vue.$intercom.update({ lastError: message });
    vue.$intercom.trackEvent('likecoin-store_error', { message });
  }
  if (window.$crisp) {
    window.$crisp.push(['set', 'session:data', [[['lastError', message]]]]);
    window.$crisp.push(['set', 'session:event', [[['likecoin-store_error', message]]]]);
  }
}

export function setUserSupportOAuthFactors(vue, factors) {
  if ((vue.$intercom || window.$crisp) && factors) {
    const services = factors.map(f => f.service);
    const intercomOpt = {};
    const crispOpt = [];
    services.forEach((service) => {
      // eslint-disable-next-line no-param-reassign
      if (service) intercomOpt[`binded_${service.toLowerCase()}`] = true;
      if (service) crispOpt.push([`binded_${service.toLowerCase()}`, true]);
    });
    if (vue.$intercom) vue.$intercom.update(intercomOpt);
    if (window.$crisp) window.$crisp.push(['set', 'session:data', [crispOpt]]);
  }
}

export async function setTrackerUserId(userId) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  window.dataLayer = window.dataLayer || [];
  try {
    let hashedId = await digestMessage(userId);
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
    if (vue.$intercom) vue.$intercom.trackEvent(`likecoin-store_${action}`, { label });
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
    if (window.fbq) window.fbq('trackCustom', action, { label });
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
