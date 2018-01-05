const admin = require('firebase-admin');

const config = require('../config/config.js');
const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collection = db.collection(config.FIRESTORE_ROOT);

module.exports = collection;
