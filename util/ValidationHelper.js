import { GETTING_STARTED_TASKS } from '../constant';

const ValidationHelper = {
  checkAddressValid(addr) {
    return addr.length === 42 && addr.substr(0, 2) === '0x';
  },
  filterUserData(u) {
    const {
      user,
      displayName,
      avatar,
      wallet,
      referrer,
      KYC,
      pendingKYC,
      isEmailVerified,
    } = u;
    let {
      email,
    } = u;
    if (isEmailVerified) email = 'verified';
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
  filterUserDataMin({
    user,
    displayName,
    avatar,
    wallet,
  }) {
    return {
      user,
      displayName,
      avatar,
      wallet,
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
    remarks,
    completeTs,
    ts,
  }) {
    return {
      from,
      fromId,
      to,
      toId,
      value,
      status,
      type,
      remarks,
      completeTs,
      ts,
    };
  },
  filterMissionData(m) {
    const {
      id,
      reward,
      refereeReward,
      refereeExtraReward,
      referralReward,
      referralPayoutType,
      targetPayoutType,
      done,
      seen,
      status,
      bonusId,
      isProxy,
      upcoming,
      endTs,
      isDesktopOnly,
      isMobileOnly,
    } = m;
    const misc = {};
    GETTING_STARTED_TASKS.forEach((task) => {
      if (m[task]) misc[task] = m[task];
    });
    return {
      id,
      reward,
      refereeReward,
      refereeExtraReward,
      referralReward,
      referralPayoutType,
      targetPayoutType,
      done,
      seen,
      status,
      isProxy,
      isClaimed: !!bonusId,
      upcoming,
      endTs,
      isDesktopOnly,
      isMobileOnly,
      ...misc,
    };
  },
  filterPayoutData({
    id,
    type,
    referrer,
    referee,
    waitForClaim,
    value,
  }) {
    return {
      id,
      type,
      referrer,
      referee,
      waitForClaim,
      value,
    };
  },
};

export default ValidationHelper;
