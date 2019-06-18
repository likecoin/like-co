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
