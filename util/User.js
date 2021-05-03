import stringify from 'fast-json-stable-stringify';
import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';
import { checkUserNameValid } from '@/util/ValidationHelper';
import {
  MIN_USER_ID_LENGTH,
  MAX_USER_ID_LENGTH,
  LOGIN_MESSAGE,
} from '@/constant';
import {
  apiGetUserMinById,
} from '@/util/api/api';
import Keplr from '@/util/Keplr';

function getRandomPaddedDigits(length) {
  return String(Math.floor(Math.random() * (10 ** length))).padStart(length, '0');
}
const User = {
  async formatAndSignUserInfo(userInfo, signMessage) {
    const {
      avatarFile,
      user,
      displayName,
      wallet,
      email,
      referrer,
      locale,
      isEmailEnabled,
    } = userInfo;
    const ts = Date.now();
    let avatarSHA256;
    if (avatarFile) {
      const avatarBuf = await FileHelper.blobToArrayBuffer(avatarFile);
      avatarSHA256 = await FileHelper.arrayBufferToSha256(avatarBuf);
    }
    let payload = JSON.stringify({
      user,
      displayName: displayName || user,
      ts,
      avatarSHA256,
      wallet,
      email,
      isEmailEnabled,
      referrer,
      locale,
    }, null, 2);
    if (signMessage) payload = [`${signMessage}:`, payload].join('\n');
    const sign = await EthHelper.signUserPayload(payload);
    const data = {
      avatarFile,
      payload: await EthHelper.utf8ToHex(payload),
      sign,
      from: wallet,
      platform: 'wallet',
    };
    return data;
  },

  async signLogin(wallet, loginMessage = LOGIN_MESSAGE) {
    if (!wallet) return null;
    const ts = Date.now();
    let payload = JSON.stringify({
      ts,
      wallet,
    }, null, 2);
    payload = [`${loginMessage}:`, payload].join('\n');
    const sign = await EthHelper.signLogin(payload);
    const data = {
      sign,
      payload: await EthHelper.utf8ToHex(payload),
      from: wallet,
      platform: 'wallet',
    };
    return data;
  },

  async signCosmosLogin(cosmosWallet, loginMessage = LOGIN_MESSAGE) {
    if (!cosmosWallet) return null;
    const ts = Date.now();
    let payload = JSON.stringify({
      ts,
      cosmosWallet,
    });
    payload = [`${loginMessage}:`, payload].join(' ');
    const {
      signed: message,
      signature: { signature, pub_key: publicKey },
    } = await Keplr.signLogin(payload);
    const data = {
      signature,
      publicKey: publicKey.value,
      message: stringify(message),
      from: cosmosWallet,
      platform: 'cosmosWallet',
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
    let { suggestedName } = signInPayload;
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
};

export default User;
