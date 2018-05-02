import { INITIAL_TOKENSALE_ETH_VALUE } from '../../constant';

const configRef = require('../util/firebase').configCollection;

/* eslint import/no-mutable-exports: "off" */
export let tokensaleInitial = INITIAL_TOKENSALE_ETH_VALUE;
let unsubscribeTokensaleInitial;

function pollTokensaleInitial() {
  try {
    const watchRef = configRef.doc('tokensale');
    const watch = () => {
      if (!unsubscribeTokensaleInitial) {
        unsubscribeTokensaleInitial = watchRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const { initial } = docSnapshot.data();
            tokensaleInitial = initial;
          }
        }, (err) => {
          console.error(err.message || err); // eslint-disable-line no-console
          if (typeof unsubscribeTokensaleInitial === 'function') {
            unsubscribeTokensaleInitial();
            unsubscribeTokensaleInitial = null;
          }
          const timer = setInterval(() => {
            console.log('Trying to restart watcher (initial tokensale)...'); // eslint-disable-line no-console
            try {
              watch();
              clearInterval(timer);
            } catch (innerErr) {
              console.log('Watcher restart failed (initial tokensale)'); // eslint-disable-line no-console
            }
          }, 10000);
        });
      }
    };
    watch();
  } catch (err) {
    const msg = err.message || err;
    console.error(msg); // eslint-disable-line no-console
  }
}

export function startPoller() {
  pollTokensaleInitial();
}

export function stopPoller() {
  if (typeof unsubscribeTokensaleInitial === 'function') {
    unsubscribeTokensaleInitial();
    unsubscribeTokensaleInitial = null;
  }
}
