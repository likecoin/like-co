export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'customEvent',
    category,
    action,
    label,
    value,
  });
  if (vue.$intercom) vue.$intercom.trackEvent(`likecoin-store_${action}`, { label });
  if (window.FB && window.FB.AppEvents) window.FB.AppEvents.logEvent(action, value, { label });
  if (window.fbq) window.fbq('track', action);
}

export default logTrackerEvent;
