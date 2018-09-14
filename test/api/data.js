const userData = require('../data/user.json');
const txData = require('../data/tx.json');

//
// test data
//
export const {
  id: testingUser1,
  displayName: testingDisplayName1,
  email: testingEmail1,
  wallet: testingWallet1,
  merchantId: testingMerchantId1,
} = userData.users[0];
export const {
  id: testingUser2,
  email: testingEmail2,
  wallet: testingWallet2,
} = userData.users[1];
export const invalidWallet = '4b25758E41f9240C8EB8831cEc7F1a02686387fa';
export const testingWallet3 = '0x9113EC0624802E6BB2b13d7e123C91Aa5D130314'; // wallet that is not used

export const {
  id: txHash,
  from: txFrom,
  to: txTo,
  value: txValue,
} = txData.tx[0];

// confidential
export const privateKey1 = '0x3b298aeb848c19257e334160b52aae9790fbae9607bd68aea8cfcfc89572cb15';
export const privateKey2 = '0x8163e9a0e9ec131844c520d292380bd93f39fd45d1bbce5c8ae3d2a4ef0a702b';
export const privateKey3 = '0xd9d199217049b92cb321d3e636b1d6642d89af0cef08b56d61bf04467b4d3862';
