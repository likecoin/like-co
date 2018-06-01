const { initBrowser } = require('../util/index.js');

module.exports = {
  /* eslint prefer-arrow-callback: "off" */
  beforeEach: (browser) => {
    initBrowser(browser);
    browser.pause(1000);
  },
  'New User Missions': (browser) => {
    const devServer = browser.globals.devServerURL;

    browser.page.metamask().acceptTerms('testacctreferee');
    browser
      .url(`${devServer}/in/bonus`)
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .pause(2000)
      .verify.title('MetaMask Notification')
      .click('#app-content button:nth-child(2)')
      .pause(2000)
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .pause(3000)
      // check `new` verify email mission exists for just registered user
      .waitForElementVisible('#my-mission .mission-item.verifyEmail', 5000)
      .verify.elementPresent('#my-mission .mission-item.verifyEmail .item-label.new')
      .click('#my-mission .mission-item.verifyEmail')
      .pause(3000)
      .verify.elementNotPresent('#my-mission .mission-item.verifyEmail .item-label.new')
      .verify.elementPresent('.mission-dialog-content .description')
      .refresh()
      .pause(3000)

      // `new` does not re-appear after seen
      .verify.elementNotPresent('#my-mission .mission-list .mission-item-list-wrapper .mission-item.verifyEmail .item-label.new')

      // verify user email
      .url(`${devServer}/verify/00000000-0000-0000-0000-000000000001`)
      .pause(3000)
      .url(`${devServer}/in/bonus`)
      .pause(3000)
      .verify.elementPresent('#my-mission .mission-item.verifyEmail.completed')
      .verify.containsText(
        '#my-mission .mission-item.verifyEmail .reward-label',
        '8 LIKE',
      )

      // new mission appear after email verification
      .verify.elementPresent('#my-mission .mission-item.gettingStart')
      .verify.elementPresent('#my-mission .mission-item.inviteFriend')
      .verify.elementPresent('#my-mission .mission-item.joinTokenSale')

      // // getting start
      .click('#my-mission .mission-item.gettingStart .mission-card')
      .waitForElementVisible('.getting-start-form ul li:nth-child(4)', 2000) // 4 items in task list
      .execute(function func() {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach((task) => {
          task.click();
        });
        return true;
      })
      .click('.getting-start-form .md-button')
      .windowHandles(function func(result) {
        this.verify.equal(result.value.length, 5, 'There should be 5 windows open');
        const newWindow = result.value[0];
        this.switchWindow(newWindow);
        this.verify.elementPresent('#my-mission .mission-list .mission-item-list-wrapper .mission-item.gettingStart.completed');
      })

      // invite friend popup
      .pause(3000)
      .click('#my-mission .mission-item.inviteFriend .mission-card')
      .pause(2000)
      .verify.elementPresent('.mission-dialog-content .invite-friend-form')
      .end();
  },
  'Old User With Verified Email and Referee': (browser) => {
    const devServer = browser.globals.devServerURL;

    browser.page.metamask().acceptTerms('testacctreferrer');
    browser
      .url(`${devServer}/in/bonus`)
      .pause(2000)
      .windowHandles(function func(res) {
        const metamaskPopup = res.value[1];
        this.switchWindow(metamaskPopup);
      })
      .pause(2000)
      .verify.title('MetaMask Notification')
      .click('#app-content button:nth-child(2)')
      .pause(2000)
      .windowHandles(function func(res) {
        const originalWindow = res.value[0];
        this.switchWindow(originalWindow);
      })
      .pause(3000)
      .verify.elementNotPresent('#my-mission .mission-item.verifyEmail')
      .waitForElementVisible('#invitee-mission .invitee-mission-grid-list', 5000)
      .verify.containsText(
        '.invitee-mission-list .username-label',
        'testacctreferee',
      )
      .verify.elementPresent('.invitee-mission-list .user-profile .new-label')
      .click('#invitee-mission .mission-item.active .mission-card')
      .waitForElementVisible('.mission-dialog-content .md-button', 2000)
      .click('.mission-dialog-content .md-button')
      .pause(2000)
      .click('.md-tabs-navigation a[href*="history"]')
      .pause(5000)
      .verify.elementPresent('.history-tab .mission-item.verifyEmail.claimed')
      .end();
  },
};
