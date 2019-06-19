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
    if (window.FB && window.FB.AppEvents) window.FB.AppEvents.logEvent(action, value, { label });
    if (window.fbq) window.fbq('trackCustom', action, { value, label });
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
