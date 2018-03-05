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
    try {
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
      const sign = await EthHelper.signNewUser(payload);
      const data = {
        avatar: avatarFile,
        payload,
        sign,
        from: wallet,
      };
      return data;
    } catch (err) {
      throw err;
    }
  },
};

export default User;
