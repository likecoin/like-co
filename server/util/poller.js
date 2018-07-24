import { EXTRA_EMAIL_BLACLIST } from '../../constant';

const configRef = require('../util/firebase').configCollection;
const accounts = require('../config/accounts.js'); // eslint-disable-line import/no-extraneous-dependencies

let { gasPrice } = accounts[0];
let emailBlacklist = EXTRA_EMAIL_BLACLIST;
let emailNoDot = [];
let unsubscribeGasPrice;
let unsubscribeEmailBlacklist;
let unsubscribeEmailNoDot;

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

function pollEmailNoDot() {
  try {
    const watchRef = configRef.doc('emailNoDot');
    const watch = () => {
      if (!unsubscribeEmailNoDot) {
        unsubscribeEmailNoDot = watchRef.onSnapshot((docSnapshot) => {
          if (docSnapshot.exists) {
            const { list } = docSnapshot.data();
            emailNoDot = list;
          }
        }, (err) => {
          console.error(err.message || err); // eslint-disable-line no-console
          if (typeof unsubscribeEmailNoDot === 'function') {
            unsubscribeEmailNoDot();
            unsubscribeEmailNoDot = null;
          }
          const timer = setInterval(() => {
            console.log('Trying to restart watcher (email no dot)...'); // eslint-disable-line no-console
            try {
              watch();
              clearInterval(timer);
            } catch (innerErr) {
              console.log('Watcher restart failed (email no dot)'); // eslint-disable-line no-console
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
  pollGasPrice();
  pollEmailBlacklist();
  pollEmailNoDot();
}

export function stopPoller() {
  if (typeof unsubscribeGasPrice === 'function') {
    unsubscribeGasPrice();
    unsubscribeGasPrice = null;
  }
  if (typeof unsubscribeEmailBlacklist === 'function') {
    unsubscribeEmailBlacklist();
    unsubscribeEmailBlacklist = null;
  }
  if (typeof unsubscribeEmailNoDot === 'function') {
    unsubscribeEmailNoDot();
    unsubscribeEmailNoDot = null;
  }
}

export function getGasPrice() {
  return gasPrice;
}

export function getEmailBlacklist() {
  return emailBlacklist;
}

export function getEmailNoDot() {
  return emailNoDot;
}
