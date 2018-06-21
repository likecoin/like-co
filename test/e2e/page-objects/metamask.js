module.exports = {
  elements: {},
  commands: [{
    goToMetamask() {
      const url = 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/popup.html';
      this.navigate(url).waitForElementPresent('body', 20000);
    },
    acceptTerms(accountId = 'testacct') {
      this.goToMetamask();

      // terms
      this.click('div.app-primary button');
      this.api.execute("document.querySelector('.markdown').scrollTo(0, 999999)");
      this.click('div.app-primary button');

      this.restoreAccount(accountId);
    },
    restoreAccount(accountId) {
      const seedPhrase = this.getAccountSeedPhase(accountId);

      // restore testing account
      this.click('p.pointer');
      this.setValue('textarea.twelve-word-phrase', seedPhrase);
      this.setValue('#password-box', '12345678');
      this.setValue('#password-box-confirm', '12345678');
      this.click('div.initialize-screen button:nth-child(2)');

      // switch to rinkeby
      this.click('#network_component');
      this.api.pause(1000);
      this.click('div.menu-droppo li:nth-child(5)');
      this.api.pause(1000);
    },
    getAccountSeedPhase(accountId = 'testacct') {
      const seedPhase = {
        testacct: 'census shock indoor dance coffee ball survey assume guide economy enlist exhaust',
        testacctreferee: 'else kitten frozen tissue sunset maple rich talk ability rough income guard',
        testacctreferrer: 'topic all orchard flight innocent reform letter input crush impose human prefer',
      };
      return seedPhase[accountId];
    },
    switchAccount(accountId) {
      this.goToMetamask();

      // logout
      this.click('.sandwich-expando');
      this.api.pause(1000);
      this.click('.menu-droppo li:nth-child(3)');
      this.api.pause(2000);

      this.restoreAccount(accountId);
    },
  }],
};
