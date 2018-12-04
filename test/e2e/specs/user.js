const { initBrowser, setAuthCookie } = require('../util/index.js');

module.exports = {
  beforeEach: (browser) => {
    initBrowser(browser);
    browser.pause(1000);
    browser.page.metamask().acceptTerms();
  },

  /* eslint quote-props: "off" */
  'Register': (browser) => {
    const devServer = browser.globals.devServerURL;
    const newId = 'testacct';
    const newIdEmail = 'testacct_@like.co';

    browser
      .url(devServer)
      // Click sign in or sign up button
      .waitForElementVisible('[lc-test=homeHeader-registerButton]', 5000)
      .click('[lc-test=homeHeader-registerButton]')
      // Wait for AuthDialog to appear
      .waitForElementVisible('[lc-test=AuthDialog]', 1000)
      // Click 'Sign in with wallet' button
      .click('[lc-test=SignInWithWalletButton]')
      // Wait for wallet notice to appear
      .waitForElementVisible('[lc-test=WalletNoticeDialog]', 1000)
      .click('[lc-test=ProceedWalletNoticeButton]')
      .click('[lc-test=ProceedWalletNoticeButton]')
      .click('[lc-test=ProceedWalletNoticeButton]')
      // Fill registration form
      .waitForElementVisible('[lc-test=RegisterForm]', 5000)
      .setValue('[lc-test=RegisterForm-LikeCoinIdField]', newId)
      .setValue('[lc-test=RegisterForm-EmailField]', newIdEmail)
      .click('[lc-test=RegisterForm-AgreePolicyCheckBox]')
      .submitForm('[lc-test=RegisterForm]')
      // Sign signature request in MetaMask
      .waitForElementVisible('[lc-test=MetaMaskDialog]', 2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .waitForElementVisible('#app-content button:nth-child(2)', 3000)
      .click('#app-content button:nth-child(2)')
      /* Redirect to account page */
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .waitForElementVisible('[lc-test=VerifyEmailCTA]', 5000)
      .verify.containsText('[lc-test=UserInfoForm-LikeCoinId]', newId)
      .end();
  },

  // Prerequisite: user registered
  'Edit': (browser) => {
    const devServer = browser.globals.devServerURL;
    const inputSequence = [];
    for (let i = 0; i < 100; i += 1) {
      inputSequence.push(browser.Keys.BACK_SPACE);
    }
    inputSequence.push('Test Name');

    setAuthCookie(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/in`)
      .waitForElementVisible('#user-info-form', 2000)
      .waitForElementVisible('[lc-test=UserInfoForm-DisplayName]', 2000)
      .click('[lc-test=UserInfoForm-DisplayName]')
      .waitForElementVisible('form[lc-test=inSettings-accountSettingForm]', 2000)
      .setValue('input[lc-test=inSettings-userDisplayName]', inputSequence)
      .click('button[lc-test=inSettings-submitButton]')
      .waitForElementVisible('form[lc-test=inSettings-accountSettingForm]', 5000)
      .waitForElementVisible('.toolbars', 3000)
      .pause(1000)
      .verify.containsText('.toolbars > div > div > span', 'View your page')
      .end();
  },

  // Prerequisite: user registered
  'Claim coupon test and error dialog': (browser) => {
    const devServer = browser.globals.devServerURL;
    setAuthCookie(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/in/settings`)
      .waitForElementVisible('input[lc-test=inSettings-redeemFormInput]', 2000)
      .click('input[lc-test=inSettings-redeemFormInput]')
      .setValue('input[lc-test=inSettings-redeemFormInput]', '22223333')
      .pause(1000)
      .click('button[lc-test=inSettings-redeemFormConfirmBtn]')
      .pause(1000)
      .waitForElementVisible('.md-dialog', 2000)
      .verify.containsText('.md-dialog', 'Claim coupon')
      .click('.md-dialog #btn-cancel')
      .end();
  },

  // Prerequisite: user registered
  'Embed widget': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';

    browser
      .url(`${devServer}/in/embed/${testUser}`)
      .waitForElementVisible('.text-content__title--display-name > a', 5000)
      .verify.containsText('.text-content__title--display-name > a', testUser)
      .end();
  },

  // Prerequisite: user registered
  'Payment send LIKE': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';
    const amount = 0.0001;
    setAuthCookie(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/${testUser}/${amount}?referrer=https%3A%2F%2Fmedium.com%2Fmedia%2Fe6e99507986506dc7b413b8968912977%3FpostId%3Ddf585d37b43a`)
      .waitForElementVisible('.address-container', 5000)
      .verify.containsText('.address-container', testUser)
      .submitForm('#paymentInfo')
      .waitForElementVisible('[lc-test=MetaMaskDialog]', 5000)
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .waitForElementVisible('div.font-small', 5000)
      .verify.containsText('div.font-small', '0x4b25758E41f9240C8EB8831cEc7F1a02686387fa')
      .verify.containsText('div.font-small', '100 000 000 000 000')
      .waitForElementVisible('div.flex-row.flex-space-around > button:nth-child(2)', 3000)
      .click('div.flex-row.flex-space-around > button:nth-child(2)')
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .waitForElementVisible('.tx-dialog', 10000)
      .waitForElementVisible('button.md-button.md-likecoin.lc-secondary', 5000)
      .click('button.md-button.md-likecoin.lc-secondary')
      .pause(3000)
      .refresh()
      .waitForElementVisible('div.remark', 5000)
      .verify.containsText('div.remark', '@LikeCoin Widget: https://medium.com/p/df585d37b43a')
      .waitForElementVisible('div.source-url > a', 5000)
      .verify.containsText('div.source-url > a', 'https://medium.com/p/df585d37b43a')
      .end();
  },

  // Prerequisite: user registered
  'Payment send ETH': (browser) => {
    const devServer = browser.globals.devServerURL;
    const testUser = 'testing';
    const amount = 0.000001;
    setAuthCookie(browser, devServer, 'testacct', '0x7FCE12d55AcA8a55471CEd6cFd4548b49b0d1AB5');

    browser
      .url(`${devServer}/${testUser}/eth/${amount}`)
      .waitForElementVisible('.address-container', 5000)
      .verify.containsText('.address-container', testUser)
      .submitForm('#paymentInfo')
      .waitForElementVisible('[lc-test=MetaMaskDialog]', 5000)
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .waitForElementVisible('#pending-tx-form', 5000)
      .submitForm('#pending-tx-form')
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .waitForElementVisible('.tx-dialog', 5000)
      .end();
  },
};
