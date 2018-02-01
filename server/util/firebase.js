const admin = require('firebase-admin');

const config = require('@ServerConfig/config.js'); // eslint-disable-line import/no-extraneous-dependencies
const serviceAccount = require('@ServerConfig/serviceAccountKey.json'); // eslint-disable-line import/no-extraneous-dependencies

if (process.env.CI) {
  module.exports = { collection: {}, bucket: {} };
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: config.FIREBASE_STORAGE_BUCKET,
  });

  const db = admin.firestore();
  const collection = db.collection(config.FIRESTORE_ROOT);
  const bucket = admin.storage().bucket();

  module.exports = { collection, bucket };
}
