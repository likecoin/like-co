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
  filterTxData({
    from,
    fromId,
    to,
    toId,
    value,
    status,
    type,
  }) {
    return {
      from,
      fromId,
      to,
      toId,
      value,
      status,
      type,
    };
  },
};

export default ValidationHelper;
