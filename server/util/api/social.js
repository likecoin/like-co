import { fetchFacebookUser } from '../../oauth/facebook';
import { fetchTwitterUser, fetchTwitterUserByAccessToken } from '../../oauth/twitter';
import { tryToLinkOAuthLogin } from './users';
import { ValidationError } from '../../../util/ValidationHelper';

const {
  userCollection: dbRef,
  FieldValue,
} = require('../firebase');

export async function checkPlatformAlreadyLinked(user, platform) {
  const doc = await dbRef.doc(user).collection('social').doc(platform).get();
  return doc.data() && doc.data().isLinked;
}

export async function socialLinkFacebook(user, accessToken, tryToOAuth = true) {
  const {
    displayName,
    link,
    userId,
    appId,
    pages,
  } = await fetchFacebookUser(accessToken);

  if (tryToOAuth) {
    const success = await tryToLinkOAuthLogin({
      likeCoinId: user,
      platform: 'facebook',
      platformUserId: userId,
    });

    if (!success) throw new ValidationError('USER_ALREADY_EXIST');
  }

  await dbRef.doc(user).collection('social').doc('facebook').create({
    displayName,
    userId,
    appId,
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
  tryToOAuth = true,
) {
  const {
    userId,
    displayName,
    oAuthToken,
    oAuthTokenSecret,
  } = isAccessToken
    ? await fetchTwitterUserByAccessToken(token, secret)
    : await fetchTwitterUser(token, secret, oAuthVerifier);

  if (tryToOAuth) {
    const success = await tryToLinkOAuthLogin({
      likeCoinId: user,
      platform: 'twitter',
      platformUserId: userId,
    });

    if (!success) throw new ValidationError('USER_ALREADY_EXIST');
  }

  const url = `https://twitter.com/intent/user?user_id=${userId}`;
  await dbRef.doc(user).collection('social').doc('twitter').set({
    displayName,
    userId,
    url,
    oAuthToken: FieldValue.delete(),
    oAuthTokenSecret: FieldValue.delete(),
    isLinked: true,
    ts: Date.now(),
  }, { merge: true });
  return {
    userId,
    displayName,
    url,
    oAuthToken,
    oAuthTokenSecret,
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
        } = await socialLinkFacebook(user, accessToken, false);
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
        } = await socialLinkTwitter(user, { token: accessToken, secret }, true, false);
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
