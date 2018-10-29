import { fetchFacebookUser } from '../../oauth/facebook';
import { fetchTwitterUser, fetchTwitterUserByAccessToken } from '../../oauth/twitter';

const { userCollection: dbRef } = require('../firebase');

export async function checkPlatformAlreadyLinked(user, platform) {
  const doc = await dbRef.doc(user).collection('social').doc(platform).get();
  return doc.data() && doc.data().isLinked;
}

export async function socialLinkFacebook(user, accessToken) {
  const {
    displayName,
    link,
    userId,
    appId,
    pages,
  } = await fetchFacebookUser(accessToken);
  await dbRef.doc(user).collection('social').doc('facebook').create({
    displayName,
    userId,
    appId,
    accessToken,
    url: link,
    userLink: link,
    pages,
    isLinked: true,
    ts: Date.now(),
  });
  return {
    displayName,
    link,
    userId,
    appId,
    pages,
  };
}

export async function socialLinkTwitter(
  user,
  { token, secret, oAuthVerifier },
  isAccessToken = false,
) {
  const {
    userId,
    displayName,
    oAuthToken: newOAuthToken,
    oAuthTokenSecret: newOAuthSecret,
  } = isAccessToken
    ? await fetchTwitterUserByAccessToken(token, secret)
    : await fetchTwitterUser(token, secret, oAuthVerifier);
  const url = `https://twitter.com/intent/user?user_id=${userId}`;
  await dbRef.doc(user).collection('social').doc('twitter').set({
    displayName,
    userId,
    url,
    oAuthToken: newOAuthToken,
    oAuthTokenSecret: newOAuthSecret,
    isLinked: true,
    ts: Date.now(),
  }, { merge: true });
  return {
    userId,
    displayName,
    url,
    oAuthToken: newOAuthToken,
    oAuthTokenSecret: newOAuthSecret,
  };
}

export async function tryToLinkSocialPlatform(user, platform, { accessToken, secret }) {
  try {
    if (await checkPlatformAlreadyLinked(user, platform)) return null;

    let platformPayload;

    switch (platform) {
      case 'facebook': {
        const {
          displayName: facebookName,
          userId: facebookID,
          appId: facebookAppId,
          link: facebookURL,
        } = await socialLinkFacebook(user, accessToken);
        platformPayload = {
          facebookName,
          facebookID,
          facebookAppId,
          facebookURL,
        };
        break;
      }
      case 'twitter': {
        const {
          displayName: twiiterUserName,
          userId: twitterID,
          url: twitterURL,
        } = await socialLinkTwitter(user, { token: accessToken, secret }, true);
        platformPayload = {
          twiiterUserName,
          twitterID,
          twitterURL,
        };
        break;
      }
      default: break;
    }
    return platformPayload;
  } catch (err) {
    console.error(err);
    return null;
  }
}
