module.exports = {
  elements: {},
  commands: [{
    acceptTerms() {
      const url = 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/popup.html';
      this.navigate(url).waitForElementPresent('body', 20000);

      // terms
      this.click('div.app-primary button');
      this.api.execute("document.querySelector('.markdown').scrollTo(0, 999999)");
      this.click('div.app-primary button');

      // restore testing account
      this.click('p.pointer');
      this.setValue('textarea.twelve-word-phrase', 'census shock indoor dance coffee ball survey assume guide economy enlist exhaust');
      this.setValue('#password-box', '12345678');
      this.setValue('#password-box-confirm', '12345678');
      this.click('div.initialize-screen button:nth-child(2)');

      // switch to rinkeby
      this.click('#network_component');
      this.api.pause(1000);
      this.click('div.menu-droppo li:nth-child(5)');
    },
  }],
};
