import { GETTING_STARTED_TASKS } from '../constant';

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
      referralReward,
      referralPayoutType,
      targetPayoutType,
      done,
      seen,
      bonusId,
      isProxy,
    } = m;
    const misc = {};
    GETTING_STARTED_TASKS.forEach((task) => {
      if (m[task]) misc[task] = m[task];
    });
    return {
      id,
      reward,
      refereeReward,
      referralReward,
      referralPayoutType,
      targetPayoutType,
      done,
      seen,
      isProxy,
      isClaimed: !!bonusId,
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
