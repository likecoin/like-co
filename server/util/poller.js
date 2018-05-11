import {
  INITIAL_TOKENSALE_ETH_VALUE,
  EXTRA_EMAIL_BLACLIST,
} from '../../constant';

const configRef = require('../util/firebase').configCollection;
const accounts = require('@ServerConfig/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies

/* eslint import/no-mutable-exports: "off" */
export let tokensaleInitial = INITIAL_TOKENSALE_ETH_VALUE;
export let { gasPrice } = accounts[0];
export let emailBlacklist = EXTRA_EMAIL_BLACLIST;
let unsubscribeTokensaleInitial;
let unsubscribeGasPrice;
let unsubscribeEmailBlacklist;

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

function pollGasPrice() {
  try {
    const watchRef = configRef.doc('gasPrice');
    const watch = () => {
      if (!unsubscribeGasPrice) {
        unsubscribeGasPrice = watchRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const { value } = docSnapshot.data();
            gasPrice = value;
          }
        }, (err) => {
          console.error(err.message || err); // eslint-disable-line no-console
          if (typeof unsubscribeGasPrice === 'function') {
            unsubscribeGasPrice();
            unsubscribeGasPrice = null;
          }
          const timer = setInterval(() => {
            console.log('Trying to restart watcher (gas price)...'); // eslint-disable-line no-console
            try {
              watch();
              clearInterval(timer);
            } catch (innerErr) {
              console.log('Watcher restart failed (gas price)'); // eslint-disable-line no-console
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

function pollEmailBlacklist() {
  try {
    const watchRef = configRef.doc('emailBlacklist');
    const watch = () => {
      if (!unsubscribeEmailBlacklist) {
        unsubscribeEmailBlacklist = watchRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const { list } = docSnapshot.data();
            emailBlacklist = list;
          }
        }, (err) => {
          console.error(err.message || err); // eslint-disable-line no-console
          if (typeof unsubscribeEmailBlacklist === 'function') {
            unsubscribeEmailBlacklist();
            unsubscribeEmailBlacklist = null;
          }
          const timer = setInterval(() => {
            console.log('Trying to restart watcher (email blacklist)...'); // eslint-disable-line no-console
            try {
              watch();
              clearInterval(timer);
            } catch (innerErr) {
              console.log('Watcher restart failed (email blacklist)'); // eslint-disable-line no-console
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
  pollGasPrice();
  pollEmailBlacklist();
}

export function stopPoller() {
  if (typeof unsubscribeTokensaleInitial === 'function') {
    unsubscribeTokensaleInitial();
    unsubscribeTokensaleInitial = null;
  }
  if (typeof unsubscribeGasPrice === 'function') {
    unsubscribeGasPrice();
    unsubscribeGasPrice = null;
  }
  if (typeof unsubscribeEmailBlacklist === 'function') {
    unsubscribeEmailBlacklist();
    unsubscribeEmailBlacklist = null;
  }
}
