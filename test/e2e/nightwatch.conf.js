const chromeDriver = require('chromedriver').path;
const fs = require('fs');
const http = require('http');

let httpServer;
if (process.env.IS_STANDALONE_TEST) {
  /* AUTO_TEST ran build already */
  const app = require('../../build/main.js').default; // eslint-disable-line import/no-unresolved, global-require
  httpServer = http.createServer(app);
}

// https://sqa.stackexchange.com/questions/22374/error-trying-to-add-chrome-extension-in-nightwatchjs
function encode(file) {
  const stream = fs.readFileSync(file);
  return Buffer.from(stream).toString('base64');
}

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['test/e2e/specs/'],
  output_folder: 'test/e2e/reports',
  page_objects_path: 'test/e2e/page-objects',

  webdriver: {
    start_process: true,
    server_path: chromeDriver,
    port: 9515,
    cli_args: {
      'webdriver.chrome.driver': chromeDriver,
    },
  },

  test_settings: {
    default: {
      silent: true,
      globals: {
        devServerURL: 'http://localhost:3000',
        before: (done) => {
          if (httpServer) httpServer.listen('3000');
          done();
        },
        after: () => {
          if (httpServer) httpServer.close();
        },
      },
      screenshots: {
        enabled: true,
        path: './screenshots',
        on_failure: true,
        on_error: true,
      },
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          extensions: [encode('test/extension/MetaMask_v4.2.0.crx')],
          args: ['--no-sandbox'],
        },
      },
    },
  },
};
