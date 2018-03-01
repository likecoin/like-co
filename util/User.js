import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';

const User = {
  async formatAndSignUserInfo(userInfo) {
    const {
      avatarFile,
      user,
      displayName,
      wallet,
      email,
      referrer,
      locale,
    } = userInfo;
    const ts = Date.now();
    let avatarSHA256;
    if (avatarFile) {
      const avatarBuf = await FileHelper.blobToArrayBuffer(avatarFile);
      avatarSHA256 = await FileHelper.arrayBufferToSha256(avatarBuf);
    }
    const payload = JSON.stringify({
      user,
      displayName: displayName || user,
      ts,
      avatarSHA256,
      wallet,
      email,
      referrer,
      locale,
    });
    const sign = await EthHelper.signUserPayload(payload);
    const data = {
      avatar: avatarFile,
      payload,
      sign,
      from: wallet,
    };
    return data;
  },
  async formatAndSignKYC(userInfo) {
    const {
      user,
      wallet,
      notPRC,
      notUSA,
      isBelowThersold,
    } = userInfo;
    const ts = Date.now();
    const payload = JSON.stringify({
      user,
      ts,
      notPRC,
      notUSA,
      isBelowThersold,
    });
    const sign = await EthHelper.signUserPayload(payload);
    const data = {
      payload,
      sign,
      from: wallet,
    };
    return data;
  },
};

export default User;
