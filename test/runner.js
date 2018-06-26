/* eslint no-console: "off" */
const { execSync } = require('child_process');

function setStub() {
  console.log('Setting Stub');
  execSync('cp ./server/util/firebase.js ./server/util/firebase.js.bak');
  execSync('cp ./server/util/ses.js ./server/util/ses.js.bak');
  execSync('cp ./test/stub/server/util/* ./server/util/');
  execSync('cp ./server/config/accounts.js ./server/config/accounts.js.bak');
  execSync('cp ./test/stub/server/config/accounts.js ./server/config/accounts.js');
  execSync('sed -i.bak "s/0xB97Df12b24C119A052EE0D4Ba97bAc59Da86AB4B/0x2fDF85d31b023c471a7F54cF2E67bA5767ADaECa/" ./constant/contract/likecoin.js');
}

function unsetStub() {
  console.log('Unsetting Stub');
  execSync('mv ./server/util/firebase.js.bak ./server/util/firebase.js');
  execSync('mv ./server/util/ses.js.bak ./server/util/ses.js');
  execSync('mv ./constant/contract/likecoin.js.bak ./constant/contract/likecoin.js');
  execSync('mv ./server/config/accounts.js.bak ./server/config/accounts.js');
}

function IsPortUsing() {
  const ret = execSync('netstat -aln');
  return ret.toString('utf8').includes('127.0.0.1.3000');
}

// Check port 3000 is using
if (IsPortUsing()) {
  console.error('Error: Server port is being used.');
  process.exit(1);
}

// Start testing server...
// spawn as new group of processes
const testEnv = Object.create(process.env);
testEnv.CI = true; // unit test env
testEnv.NODE_ENV = 'production';
testEnv.IS_TESTNET = true;
testEnv.DISABLE_SERVER = 'TRUE';
if (!process.env.CI) {
  setStub();
  console.log('Building for unit test');
  execSync('npm run build', { env: testEnv, stdio: 'inherit' });
}
console.log('Running API test');
try {
  execSync('nyc npm run test:api', { env: testEnv, stdio: 'inherit' });
} catch (e) {
  console.error(e);
}
execSync('rm -rf ./.nyc_output_merge && cp -R ./.nyc_output ./.nyc_output_merge');
try {
  console.log('Running E2E test');
  execSync('npm run test:e2e', { env: testEnv, stdio: 'inherit' });
} catch (e) {
  console.error(e);
}
execSync('cp -a ./.nyc_output_merge/. ./.nyc_output');
unsetStub();
console.log('Done');

process.on('SIGINT', () => {
  // catch SIGINT
  unsetStub();
});
