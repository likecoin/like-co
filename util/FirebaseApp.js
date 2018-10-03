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

export function getFirebaseProvider(platform) {
  switch (platform) {
    case 'google':
      return new firebase.auth.GoogleAuthProvider();
    case 'facebook': {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile');
      provider.addScope('pages_show_list');
      provider.addScope('user_link');
      return provider;
    }
    case 'twitter':
      return new firebase.auth.TwitterAuthProvider();
    case 'github':
      return new firebase.auth.GithubAuthProvider();
    default:
      throw new Error('Platform not exist');
  }
}

export async function firebasePlatformSignIn(platform) {
  const provider = getFirebaseProvider(platform);
  const result = await firebase.auth().signInWithPopup(provider);
  const { accessToken } = result.credential;
  const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
  return { accessToken, firebaseIdToken };
}

export async function firebaseSendSignInEmail(email, payload) {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
  window.localStorage.setItem(
    'emailSignInPayload',
    JSON.Stringify({ ...payload, email }),
  );
}

export function firebaseIsSignInEmailLink() {
  return firebase.auth().isSignInWithEmailLink(window.location.href);
}

export async function firebaseHandleSignInEmailLink() {
  const payload = window.localStorage.getItem('emailForSignIn');
  if (payload && payload.email) {
    await firebase.auth().signInWithEmailLink(payload.email, window.location.href);
    const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
    window.localStorage.removeItem('emailForSignIn');
    return { ...payload, firebaseIdToken };
  }
  return null;
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
