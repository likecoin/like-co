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

export async function setUserSupportData(vue, u) {
  const {
    user,
    displayName,
    email,
    primaryPhone,
  } = u;
  if (window.Intercom) {
    window.Intercom('boot', {
      user_id: user,
      email,
      name: displayName,
      phone: primaryPhone,
    });
  }
}

export async function setLoggerUser(vue, { wallet }) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  try {
    if (vue.$gtag) {
      let hashedId = await digestMessage(wallet);
      hashedId = hexString(hashedId);
      vue.$gtag.set({ userId: hashedId });
      // HACK: use .set to mitigate connected site user_id issue
      // https://support.google.com/analytics/answer/9973999?hl=en
      // vue.$gtag.config({ user_id: hashedId });
      vue.$gtag.set({ user_id: hashedId });
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
  }
}

export async function setUserProperties(keyValues) {
  if (window.doNotTrack || navigator.doNotTrack) return;
  if (!keyValues) return;
  window.dataLayer = window.dataLayer || [];
  try {
    window.dataLayer.push('set', 'user_properties', keyValues);
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
    if (window.Intercom) {
      window.Intercom('trackEvent', `likecoin-store_${action}`, { label });
    }
    // do not track
    if (window.doNotTrack || navigator.doNotTrack) return;
    if (vue.$gtag) {
      vue.$gtag.event(action, {
        event_category: category,
        event_label: label.substring(0, 499),
        value,
      });
    }
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
    if (vue.$gtag) {
      vue.$gtag.event('timing_complete', {
        name: action,
        event_category: category,
        event_label: label.substring(0, 499),
        value,
      });
    }
  } catch (err) {
    console.error('logging error:');
    console.error(err);
  }
}
export default logTrackerEvent;
