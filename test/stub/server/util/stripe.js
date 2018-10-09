/* eslint import/no-unresolved: "off" */
/* eslint import/extensions: "off" */
const subscriptionData = require('../../test/data/subscription.json').stripeData.subscriptions;

console.log('Using stub (stripe.js)'); /* eslint no-console: "off" */

const stripe = {};

stripe.subscriptions = {
  retrieve: (subscriptionId) => {
    const subscription = subscriptionData.find(s => s.id === subscriptionId);
    subscription.current_period_end = Math.floor(Date.now() / 1000) - 10000;
    subscription.current_period_start = Math.floor(Date.now() / 1000) + 10000;
    return subscription;
  },
};

export default stripe;
