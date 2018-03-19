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
      .url(`${devServer}/tx/${testTx}`)
      .waitForElementVisible('.transaction-container', 2000)
      .pause(2000)
      .verify.containsText('.transaction-container', 'Transaction Completed')
      .click('#view-etherscan')
      .pause(1000)
      .windowHandles(function func(res) {
        const etherscan = res.value[1];
        this.switchWindow(etherscan);
      })
      .pause(1000)
      .verify.containsText('body', 'Success')
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
