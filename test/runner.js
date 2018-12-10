/* eslint no-console: "off" */
const { execSync, spawn } = require('child_process');

function killServer(pid, sig) {
  // kill whole group of processes
  process.kill(pid, sig);
}

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

let server;
let curlCount = 0;

function waitServerReady() {
  if (curlCount > 10) {
    killServer(-server.pid, 'SIGINT');
    return;
  }
  curlCount += 1;

  // curl for server ready
  const serverReady = spawn('curl', ['-s', '-o', '/dev/null', 'http://localhost:3000/'], { stdio: 'inherit' });
  serverReady.on('exit', (code) => {
    if (code !== 0) {
      console.log(`Waiting server ready. curl retry. Code: ${code}`);
      setTimeout(waitServerReady, 5000);
    } else {
      // run tests
      console.log('Server ready. Run test in new window e.g. \'npm run test\'.');
    }
  });
}

// Start testing server...
// spawn as new group of processes
if (!process.env.CI) {
  setStub();
  process.on('SIGINT', () => {
    // catch SIGINT
    if (server) killServer(-server.pid, 'SIGINT');
    unsetStub();
  });
}

if (!process.env.IS_STANDALONE_TEST) {
  server = spawn('npm', ['run', 'dev'], { detached: true, stdio: 'inherit' });
  setTimeout(waitServerReady, 5000);
} else {
  const testEnv = Object.create(process.env);
  testEnv.CI = 'TRUE'; // unit test env
  testEnv.NODE_ENV = 'production';
  testEnv.IS_TESTNET = 'TRUE';
  try {
    execSync('npm run test:api', { env: testEnv, stdio: 'inherit' });
  } catch (e) {
    if (!process.env.CI) unsetStub();
    process.exit(1);
  }
  try {
    if (!process.env.CI) {
      const buildEnv = Object.create(process.env);
      buildEnv.IS_TESTNET = 'TRUE';
      console.log('Building for E2E test');
      execSync('npm run build', { env: buildEnv, stdio: 'inherit' });
    }
    execSync('npm run test:e2e', { env: testEnv, stdio: 'inherit' });
  } catch (e) {
    if (!process.env.CI) unsetStub();
    process.exit(1);
  }
  console.log('Done');
  if (!process.env.CI) unsetStub();
}
