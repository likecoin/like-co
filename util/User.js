import stringify from 'fast-json-stable-stringify';
import { checkUserNameValid } from '@/util/ValidationHelper';
import {
  MIN_USER_ID_LENGTH,
  MAX_USER_ID_LENGTH,
  LOGIN_MESSAGE,
  DELETE_MESSAGE,
} from '@/constant';
import {
  apiGetUserMinById,
} from '@/util/api/api';

function getRandomPaddedDigits(length) {
  return String(Math.floor(Math.random() * (10 ** length))).padStart(length, '0');
}
const User = {
  async signCosmosDelete(inputWallet, signer, message = DELETE_MESSAGE) {
    if (!inputWallet) return null;
    const ts = Date.now();
    let payload = JSON.stringify({
      action: 'user_delete',
      likeWallet: inputWallet,
      ts,
    });
    payload = [`${message}:`, payload].join(' ');
    const {
      signed: signedMessage,
      signature: { signature, pub_key: publicKey },
    } = await signer(payload);
    const data = {
      signature,
      publicKey: publicKey.value,
      message: stringify(signedMessage),
      from: inputWallet,
    };
    return data;
  },

  async signCosmosLogin(inputWallet, signer, platform = 'cosmosWallet', loginMessage = LOGIN_MESSAGE) {
    if (!inputWallet) return null;
    if (!['likeWallet', 'cosmosWallet'].includes(platform)) {
      throw new Error('SIGN_COSMOS_LOGIN_INVALID_PLATFORM');
    }
    const ts = Date.now();
    let payload = JSON.stringify({
      ts,
      [platform]: inputWallet,
    });
    payload = [`${loginMessage}:`, payload].join(' ');
    const {
      signed: message,
      signature: { signature, pub_key: publicKey },
    } = await signer(payload);
    const data = {
      signature,
      publicKey: publicKey.value,
      message: stringify(message),
      from: inputWallet,
      platform,
    };
    return data;
  },

  getAvatarHaloType(user = {}) {
    if (user.isCivicLikerTrial || user.isSubscribedCivicLiker) {
      return 'civic-liker';
    }
    return 'none';
  },

  async prepareSuggestedUserName(signInPayload) {
    const RANDOM_DIGIT_LENGTH = 5;
    const MAX_SUGGEST_TRY = 5;
    let { user: suggestedName } = signInPayload;
    if (!suggestedName) {
      [suggestedName] = signInPayload.email.split('@');
    }
    suggestedName = suggestedName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    suggestedName = suggestedName.substring(0, MAX_USER_ID_LENGTH - RANDOM_DIGIT_LENGTH);
    let isIDAvailable = false;
    let tries = 0;
    let tryName = suggestedName;
    if (suggestedName.length < MIN_USER_ID_LENGTH) {
      tryName = `${suggestedName}${getRandomPaddedDigits(RANDOM_DIGIT_LENGTH)}`;
    }
    while (!isIDAvailable && tries < MAX_SUGGEST_TRY) {
      try {
        await apiGetUserMinById(tryName); // eslint-disable-line no-await-in-loop
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            isIDAvailable = true;
            break;
          }
        }
      }
      tryName = `${suggestedName}${getRandomPaddedDigits(RANDOM_DIGIT_LENGTH)}`;
      tries += 1;
    }
    if (isIDAvailable && tryName && checkUserNameValid(tryName)) {
      return tryName;
    }
    return '';
  },

  isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp < currentTime;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to decode JWT', error);
      return true;
    }
  },
};

export default User;
