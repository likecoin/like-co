import firebase from 'firebase/app';
import 'firebase/auth';

const URL = require('url-parse');

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

export { firebase };

export function isFirebasePlatform(platform) {
  return [
    'google',
    'facebook',
    'twitter',
    'github',
  ].includes(platform);
}

export function getFirebaseProvider(platform) {
  switch (platform) {
    case 'google': {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      provider.setCustomParameters({
        // Force user to select Google account
        prompt: 'select_account',
      });
      return provider;
    }
    case 'facebook': {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');
      // provider.addScope('pages_show_list');
      // provider.addScope('user_link');
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

export function getFirebaseProviderId(platform) {
  switch (platform) {
    case 'facebook':
      return firebase.auth.FacebookAuthProvider.PROVIDER_ID;
    case 'github':
      return firebase.auth.GithubAuthProvider.PROVIDER_ID;
    case 'google':
      return firebase.auth.GoogleAuthProvider.PROVIDER_ID;
    case 'twitter':
      return firebase.auth.TwitterAuthProvider.PROVIDER_ID;
    default:
      throw new Error('Platform not exist');
  }
}

export function getPlatformFromProviderId(providerId) {
  switch (providerId) {
    case firebase.auth.FacebookAuthProvider.PROVIDER_ID:
      return 'facebook';
    case firebase.auth.GithubAuthProvider.PROVIDER_ID:
      return 'github';
    case firebase.auth.GoogleAuthProvider.PROVIDER_ID:
      return 'google';
    case firebase.auth.TwitterAuthProvider.PROVIDER_ID:
      return 'twitter';
    default:
      throw new Error('Provider ID not support');
  }
}

export function getFirebaseUserProviderUserInfo(firebaseUser, platform) {
  const providerId = getFirebaseProviderId(platform);
  return firebaseUser.providerData.find(p => (p.providerId === providerId));
}

export async function getSignInPayloadFromSignInResult(result) {
  const {
    displayName,
    email,
    emailVerified: isEmailVerified = false,
    photoURL: avatarURL = false,
  } = result.user;
  const { accessToken, secret } = result.credential;
  const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
  return {
    displayName,
    email,
    isEmailVerified,
    avatarURL,

    accessToken,
    secret,

    firebaseIdToken,
  };
}

export async function firebasePlatformSignIn(platform, options = {}) {
  const provider = getFirebaseProvider(platform);
  if (options.isRedirect) {
    await firebase.auth().signInWithRedirect(provider);
    return null;
  }
  const result = await firebase.auth().signInWithPopup(provider);
  return getSignInPayloadFromSignInResult(result);
}

export async function firebaseGetRedirectCredential() {
  const result = await firebase.auth().getRedirectResult();
  return result;
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

export async function firebaseSendSignInEmail(email, { referrer = null, sourceURL = null }) {
  const url = new URL(window.location.href, true);
  if (referrer) {
    url.query.referrer = referrer;
  }
  if (sourceURL) {
    url.query.sourceURL = sourceURL;
  }
  url.set('query', url.query);
  const actionCodeSettings = {
    url: url.toString(),
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

export async function firebaseHandleSignInEmailLink(providedEmail) {
  let email;

  if (providedEmail) {
    email = providedEmail;
  } else {
    try {
      ({ email } = JSON.parse(window.localStorage.getItem('emailForSignIn')));
    } catch (err) {
      // Do nothing
    }
  }

  if (!email) {
    throw new Error('FIREBASE_EMAIL_LINK_AUTH_NO_EMAIL');
  }

  await firebase.auth().signInWithEmailLink(email, window.location.href);
  const firebaseIdToken = await firebase.auth().currentUser.getIdToken();

  if (!providedEmail) {
    // Clear email from storage.
    window.localStorage.removeItem('emailForSignIn');
  }

  return { email, firebaseIdToken };
}

function getInstance() {
  try {
    return !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
  } catch (err) {
    console.error(err);
    return {};
  }
}

export default getInstance();
