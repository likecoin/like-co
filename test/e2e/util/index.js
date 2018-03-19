function initBrowser(browser) {
  browser
    .pause(5000)
    .windowHandles(function func(res) {
      res.value.forEach((val, i) => {
        this.switchWindow(val);
        if (i !== res.value.length - 1) {
          this.closeWindow();
        }
      });
    });
}

module.exports = { initBrowser };
