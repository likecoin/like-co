
module.exports = {
  elements: {},
  commands: [
    {
      goToAndSignInWithWallet(path) {
        return this.api.url(path)
          // Redirect to sign in page
          .waitForElementVisible('[lc-test=AuthDialog]', 3000)
          .waitForElementVisible('[lc-test=ToggleSignInButton]', 2000)
          .click('[lc-test=ToggleSignInButton]')
          // Click 'Sign in with wallet' button
          .waitForElementVisible('[lc-test=SignInWithWalletButton]', 2000)
          .click('[lc-test=SignInWithWalletButton]')
          // Wait for wallet notice to appear
          .waitForElementVisible('[lc-test=WalletNoticeDialog]', 5000)
          .waitForElementVisible('[lc-test=ProceedWalletNoticeButton]', 3000)
          .click('[lc-test=ProceedWalletNoticeButton]')
          .click('[lc-test=ProceedWalletNoticeButton]')
          .click('[lc-test=ProceedWalletNoticeButton]')
          .waitForElementVisible('[lc-test=MetaMaskDialog]', 5000)
          // Sign on MetaMask to sign in
          .windowHandles(function func(res) {
            const metamaskPopup = res.value[1];
            this.switchWindow(metamaskPopup);
          })
          .waitForElementVisible('#app-content button:nth-child(2)', 5000)
          .click('#app-content button:nth-child(2)')
          // Redirect back to bonus page
          .windowHandles(function func(res) {
            const originalWindow = res.value[0];
            this.switchWindow(originalWindow);
          });
      },
    },
  ],
};
