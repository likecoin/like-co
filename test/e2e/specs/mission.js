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
    browser.page.common().goToAndSignInWithWallet(`${devServer}/in/bonus`);
    browser
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
      .waitForElementPresent('#my-mission .mission-item.verifyEmail.completed', 3000)
      .verify.containsText(
        '#my-mission .mission-item.verifyEmail .reward-label',
        '8 LIKE',
      )

      // new mission appear after email verification
      .verify.elementPresent('#my-mission .mission-item.gettingStart')
      .verify.elementPresent('#my-mission .mission-item.inviteFriend')
      .verify.elementPresent('#my-mission .mission-item.joinTokenSale')

      // // getting start
      .waitForElementPresent('#my-mission .mission-item.gettingStart .mission-card', 3000)
      .click('#my-mission .mission-item.gettingStart .mission-card')
      .waitForElementVisible('.getting-start-form ul li:nth-child(4)', 2000) // 4 items in task list
      .execute(function func() {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach((task, index) => {
          setTimeout(() => task.click(), 1000 * index);
        });
        return true;
      })
      .pause(6000)
      .waitForElementVisible('.getting-start-form .md-button', 3000)
      .click('.getting-start-form .md-button')
      .windowHandles(function func(result) {
        this.verify.equal(result.value.length, 5, 'There should be 5 windows open');
        const newWindow = result.value[0];
        this.switchWindow(newWindow);
        this.waitForElementVisible('#my-mission .mission-list .mission-item-list-wrapper .mission-item.gettingStart.completed', 1000);
      })

      // invite friend popup
      .waitForElementVisible('#my-mission .mission-item.inviteFriend .mission-card', 3000)
      .pause(2000) // sometime it cannot switch window quick enough
      .click('#my-mission .mission-item.inviteFriend .mission-card')
      .waitForElementPresent('.mission-dialog-content .invite-friend-form', 3000)
      .end();
  },
  'Old User With Verified Email and Referee': (browser) => {
    const devServer = browser.globals.devServerURL;

    browser.page.metamask().acceptTerms('testacctreferrer');
    browser.page.common().goToAndSignInWithWallet(`${devServer}/in/bonus`);
    browser
      .pause(3000)
      .verify.elementNotPresent('#my-mission .mission-item.verifyEmail')
      .waitForElementVisible('#invitee-mission .invitee-mission-grid-list', 5000)
      .verify.containsText(
        '.invitee-mission-list .username-label',
        'testacctReferee', // display name
      )
      .verify.elementPresent('.invitee-mission-list .user-profile .new-label')
      .getLocationInView('#invitee-mission')
      .waitForElementVisible('#invitee-mission .mission-item.active .mission-card', 3000)
      .click('#invitee-mission .mission-item.active .mission-card')
      .waitForElementVisible('.mission-dialog-content .md-button', 2000)
      .click('.mission-dialog-content .md-button')
      .pause(2000)
      .waitForElementPresent('.mission-item.verifyEmail.claimed', 5000)
      .end();
  },
};
