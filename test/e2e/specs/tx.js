const { initBrowser } = require('../util/index.js');

module.exports = {
  beforeEach: (browser) => {
    initBrowser(browser);
    browser.pause(1000);
    browser.page.metamask().acceptTerms();
  },

  /* eslint quote-props: "off" */
  'Tx status': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testTx = '0xe8d6792a60aab25caf23c75b58b53d47175386aa335156627faf1c7246360ae9';

    browser
      .url(`${devServer}/in/tx/${testTx}`)
      .waitForElementVisible('.transaction-container', 2000)
      .pause(2000)
      .verify.containsText('.transaction-container', 'Transaction Completed')
      .waitForElementVisible('#view-etherscan', 2000)
      .pause(5000)
      .verify.containsText('#view-etherscan', 'View on Etherscan')
      .verify.attributeContains('#view-etherscan .view-url', 'href', `etherscan.io/tx/${testTx}`)
      .end();
  },

  'Payment submit': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';

    browser
      .url(`${devServer}/${testUser}`)
      .waitForElementVisible('.payment-container', 2000)
      .verify.containsText('.payment-container', testUser)
      .click('#paymentInfo')
      .clearValue('#paymentInfo input[type=text]')
      .setValue('#paymentInfo input[type=text]', 2)
      .click('#paymentInfo button:nth-child(3)')
      .submitForm('#paymentInfo')
      .end();
  },
};
