import * as firebase from 'firebase';
import 'firebase/auth';

/* TODO: remove */
process.env.FIREBASE_API_KEY = 'AIzaSyC-3elXTGa2y4u-Ng7qNFJYdYC2A6i2YBg';
process.env.FIREBASE_PROJECT_ID = 'likecoin-develop';

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

export { firebase };

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
