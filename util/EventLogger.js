export function logTrackerEvent(
  vue,
  category,
  action,
  label,
  value,
) {
  if (vue.$ga) vue.$ga.event(category, action, label, value);
  if (vue.$intercom) vue.$intercom.trackEvent(action);
}

export default logTrackerEvent;
