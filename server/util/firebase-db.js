const admin = require('firebase-admin');

const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collection = db.collection('likecoin-store-user');

module.exports = collection;
