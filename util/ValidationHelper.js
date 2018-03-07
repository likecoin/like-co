const ValidationHelper = {
  checkAddressValid(addr) {
    return addr.length === 42 && addr.substr(0, 2) === '0x';
  },
  filterUserData({
    user,
    displayName,
    email,
    avatar,
    wallet,
    referrer,
    KYC,
    pendingKYC,
    isEmailVerified,
  }) {
    return {
      user,
      displayName,
      email,
      avatar,
      wallet,
      referrer: !!referrer,
      KYC,
      pendingKYC,
      isEmailVerified,
    };
  },
};

export default ValidationHelper;
