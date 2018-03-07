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
      passportName,
      country,
      documentFile0,
      documentFile1,
    } = userInfo;
    const ts = Date.now();
    let document0SHA256;
    let document1SHA256;
    if (documentFile0) {
      const buf = await FileHelper.blobToArrayBuffer(documentFile0);
      document0SHA256 = await FileHelper.arrayBufferToSha256(buf);
    }
    if (documentFile1) {
      const buf = await FileHelper.blobToArrayBuffer(documentFile1);
      document1SHA256 = await FileHelper.arrayBufferToSha256(buf);
    }
    const payload = JSON.stringify({
      user,
      ts,
      notPRC,
      notUSA,
      isBelowThersold,
      passportName,
      country,
      document0SHA256,
      document1SHA256,
    });
    const sign = await EthHelper.signUserPayload(payload);
    const data = {
      payload,
      sign,
      from: wallet,
    };
    if (documentFile0 && documentFile1) {
      data.documents = [documentFile0, documentFile1];
    }
    return data;
  },
};

export default User;
