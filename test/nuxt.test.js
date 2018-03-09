import test from 'ava';

import initNuxt from './util/index';

//
// checking functions
//
function isIncludeAll(src, list = []) {
  for (let i = 0; i < list.length; i += 1) {
    if (!src.includes(list[i])) {
      return false;
    }
  }
  return true;
}

// We keep a reference to Nuxt so we can close
// the server at the end of the test
let nuxt = null;

// Init Nuxt.js
test.before('Init Nuxt.js', async () => {
  nuxt = await initNuxt();
});

//
// test page exists and contain key phrases
//
test('Route /', async (t) => {
  const context = {};
  const { html } = await nuxt.renderRoute('/', context);
  const list = [
    'LikeCoin',
    'Reinventing the Like',
    'Rewarding Contents by Proof of Creativity',
    'LikeCoin Stack',
    'Road Map',
    'Token Distribution',
    'Early Adopters',
    'Press Coverage',
    'Early Supporters',
    'Team',
  ];
  t.true(isIncludeAll(html, list));
});

test('Route /register', async (t) => {
  const context = {};
  const { html } = await nuxt.renderRoute('/register', context);
  t.true(isIncludeAll(html, ['LikeCoin', 'Create Account', 'Wallet']));
});

test('Route /redeem', async (t) => {
  const context = {};
  const { html } = await nuxt.renderRoute('/redeem', context);
  t.true(isIncludeAll(html, ['LikeCoin', 'Create Account', 'Wallet', 'Coupon Code']));
});

test('Route /edit', async (t) => {
  const context = {};
  const { html } = await nuxt.renderRoute('/edit', context);
  t.true(isIncludeAll(html, ['LikeCoin']));
});

test('Route /tx', async (t) => {
  const context = {};
  const { html } = await nuxt.renderRoute('/tx', context);
  t.true(isIncludeAll(html, ['LikeCoin', 'Sending', 'Recipient Address', 'Sender Address']));
});

test('Route /verify', async (t) => {
  const context = {};
  const { html } = await nuxt.renderRoute('/verify', context);
  t.true(isIncludeAll(html, ['LikeCoin', 'Verifying']));
});


// Close the Nuxt server
test.after('Closing server', () => {
  nuxt.close();
});
