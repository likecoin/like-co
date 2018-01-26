import EthHelper from '@/util/EthHelper';
import FileHelper from '@/util/FileHelper';

const User = {
  async submitUserInfo(avatarFile, user, displayName, wallet, email, actionFn) {
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
      });
      const sign = await EthHelper.signNewUser(payload);
      const data = {
        avatar: avatarFile,
        payload,
        sign,
        from: wallet,
      };
      await actionFn(data);
    } catch (err) {
      throw err;
    }
  },
};

export default User;
