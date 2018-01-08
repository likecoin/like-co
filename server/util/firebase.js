const admin = require('firebase-admin');

const config = require('../config/config.js');
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const collection = db.collection(config.FIRESTORE_ROOT);

const bucket = admin.storage().bucket();

module.exports = { collection, bucket };
