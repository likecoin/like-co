import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';
import {
  LOGIN_MESSAGE,
} from '@/constant';

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

  getAvatarHaloType(user = {}) {
    if (user.isCivicLikerTrial || user.isSubscribedCivicLiker) {
      return 'civic-liker';
    }
    return 'none';
  },
};

export default User;
