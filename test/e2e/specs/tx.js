const { initBrowser, setAuthCookie } = require('../util/index.js');

module.exports = {
  beforeEach: (browser) => {
    initBrowser(browser);
    browser.pause(1000);
    browser.page.metamask().acceptTerms();
    setAuthCookie(browser, browser.globals.devServerURL, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');
  },

  /* eslint quote-props: "off" */
  'Tx status': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testTx = '0x2078e69500882193834e3d54243878a29ed45ba9e144f493bc6486f20f00aff8';

    browser
      .url(`${devServer}/in/tx/${testTx}`)
      .waitForElementVisible('.transaction-container', 2000)
      .pause(2000)
      .verify.elementNotPresent('.transaction-container .failed')
      .waitForElementVisible('#view-etherscan', 2000)
      .pause(5000)
      .verify.containsText('#view-etherscan', 'View on Etherscan')
      .verify.attributeContains('#view-etherscan .view-url', 'href', `rinkeby.etherscan.io/tx/${testTx}`)
      .end();
  },

  'Payment submit': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';

    browser
      .url(`${devServer}/${testUser}`)
      .waitForElementVisible('.address-container', 2000)
      .verify.containsText('.address-container', testUser)
      .click('#paymentInfo')
      .clearValue('#paymentInfo input[type=text]')
      .setValue('#paymentInfo input[type=text]', 2)
      .click('#paymentInfo button:nth-child(3)')
      .submitForm('#paymentInfo')
      .end();
  },
};
