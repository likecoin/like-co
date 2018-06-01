const jwt = require('jsonwebtoken');

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

function jwtSign(user, wallet) {
  return jwt.sign({ user, wallet }, 'likecoin', { expiresIn: '7d' });
}

function setAuthLocalStorage(browser, url, user, wallet) {
  const auth = jwtSign(user, wallet);
  browser
    .url(url)
    .execute(`localStorage.auth = '${auth}';`)
    .pause(2000);
}

module.exports = { initBrowser, setAuthLocalStorage };
