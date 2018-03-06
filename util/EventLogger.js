export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  if (vue.$ga) vue.$ga.event(category, action, label, value);
  if (vue.$intercom) vue.$intercom.trackEvent(action);
  if (window.FB && window.FB.AppEvents) window.FB.AppEvents.logEvent(action);
  if (window.fbq) window.fbq('track', action);
}

export default logTrackerEvent;
