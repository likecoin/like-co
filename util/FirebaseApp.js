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
    case 'google': {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      return provider;
    }
    case 'facebook': {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('public_profile');
      provider.addScope('pages_show_list');
      provider.addScope('user_link');
      return provider;
    }
    case 'twitter':
      return new firebase.auth.TwitterAuthProvider();
    case 'github': {
      const provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('read:user');
      return provider;
    }
    default:
      throw new Error('Platform not exist');
  }
}

export async function firebasePlatformSignIn(platform) {
  const provider = getFirebaseProvider(platform);
  const result = await firebase.auth().signInWithPopup(provider);
  const {
    displayName,
    email,
    emailVerified: isEmailVerified = false,
  } = result.user;
  const { accessToken, secret } = result.credential;
  const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
  return {
    displayName,
    email,
    isEmailVerified,

    accessToken,
    secret,

    firebaseIdToken,
  };
}

export async function firebasePlatformLinkUser(platform) {
  const provider = getFirebaseProvider(platform);
  const result = await firebase.auth().currentUser.linkWithPopup(provider);
  const { accessToken, secret } = result.credential;
  const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
  return { accessToken, secret, firebaseIdToken };
}

export async function firebaseEmailLinkUser(email) {
  const credential = firebase.auth.EmailAuthProvider.credentialWithLink(
    email,
    window.location.href,
  );
  return firebase.auth()
    .currentUser.linkAndRetrieveDataWithCredential(credential);
}

export async function firebaseSendSignInEmail(email) {
  const actionCodeSettings = {
    url: window.location.href,
    handleCodeInApp: true,
  };
  await firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
  window.localStorage.setItem(
    'emailForSignIn',
    JSON.stringify({ email }),
  );
}

export function firebaseIsSignInEmailLink() {
  return firebase.auth().isSignInWithEmailLink(window.location.href);
}

export async function firebaseHandleSignInEmailLink() {
  let email;
  try {
    ({ email } = JSON.parse(window.localStorage.getItem('emailForSignIn')));
  } catch (err) {
    return null;
  }

  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again.
    // TODO
    return null;
  }

  await firebase.auth()
    .signInWithEmailLink(email, window.location.href)
    .catch((err) => {
      console.error(err);
      // TODO: Handle error
    });
  const firebaseIdToken = await firebase.auth().currentUser.getIdToken();

  // Clear email from storage.
  window.localStorage.removeItem('emailForSignIn');

  return { email, firebaseIdToken };
}

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
