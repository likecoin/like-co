const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin').firestore;

const config = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies
const serviceAccount = require('@ServerConfig/serviceAccountKey.json'); // eslint-disable-line import/no-extraneous-dependencies

if (process.env.CI) {
  module.exports = {
    db: {},
    userCollection: {},
    txCollection: {},
    iapCollection: {},
    missionCollection: {},
    payoutCollection: {},
    configCollection: {},
    bucket: {},
    FieldValue,
  };
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
  });

  const db = admin.firestore();
  const userCollection = db.collection(config.FIRESTORE_USER_ROOT);
  const txCollection = db.collection(config.FIRESTORE_TX_ROOT);
  const iapCollection = db.collection(config.FIRESTORE_IAP_ROOT);
  const missionCollection = db.collection(config.FIRESTORE_MISSION_ROOT);
  const payoutCollection = db.collection(config.FIRESTORE_PAYOUT_ROOT);
  const configCollection = db.collection(config.FIRESTORE_CONFIG_ROOT);
  const bucket = admin.storage().bucket();

  module.exports = {
    db,
    userCollection,
    txCollection,
    iapCollection,
    missionCollection,
    payoutCollection,
    configCollection,
    bucket,
    FieldValue,
  };
}
