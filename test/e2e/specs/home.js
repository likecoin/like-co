// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

const { initBrowser } = require('../util/index.js');

module.exports = {
  beforeEach: (browser) => {
    initBrowser(browser);
  },

  /* eslint quote-props: "off" */
  'Route /. Whitepaper exists.': function test(browser) {
    const devServer = browser.globals.devServerURL;

    browser
      .url(devServer)
      .waitForElementVisible('.links', 5000)
      .verify.elementPresent('.links')
      .verify.containsText('.links', 'White Paper')
      .click('.links > a[href*="/whitepaper"]')
      .pause(1000)
      .click('ul > li:nth-child(2) > div > ul > li > button')
      .pause(1000)
      .windowHandles(function func(result) {
        this.verify.equal(result.value.length, 2, 'There should be 2 windows open');
        const newWindow = result.value[1];
        this.switchWindow(newWindow);
        this.verify.urlContains('likecoin-whitepaper-en.pdf');
      })
      .end();
  },

};
