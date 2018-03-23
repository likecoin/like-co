const serverPath = require('selenium-server').path;
const chromeDriver = require('chromedriver').path;
const fs = require('fs');

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

  selenium: {
    start_process: true,
    server_path: serverPath,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': chromeDriver,
    },
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost',
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:3000',
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
