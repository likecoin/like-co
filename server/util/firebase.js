const admin = require('firebase-admin');

const serviceAccount = require('../config/serviceAccountKey.json');

if (process.env.CI) {
  module.exports = { collection: {}, bucket: {} };
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'likecoin-foundation.appspot.com',
  });

  const db = admin.firestore();
  const collection = db.collection('likecoin-store-user');

  const bucket = admin.storage().bucket();

  module.exports = { collection, bucket };
}
