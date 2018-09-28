import {
  GETTING_STARTED_TASKS,
  DISPLAY_SOCIAL_MEDIA_OPTIONS,
} from '../constant';

export const ValidationHelper = {
  checkAddressValid(addr) {
    return addr.length === 42 && addr.substr(0, 2) === '0x';
  },
  filterUserData(u) {
    const {
      user,
      bonusCooldown,
      displayName,
      avatar,
      wallet,
      referrer,
      isEmailVerified,
      isEmailEnabled,
      isSubscribed = false,
      email,
      read = {},
    } = u;
    return {
      user,
      bonusCooldown: bonusCooldown > Date.now() ? bonusCooldown : undefined,
      displayName,
      email,
      avatar,
      wallet,
      referrer: !!referrer,
      isEmailVerified,
      isEmailEnabled,
      isSubscribed,
      read,
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
    httpReferrer,
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
      httpReferrer,
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
      hide,
      staying,
    } = m;
    const misc = {};
    GETTING_STARTED_TASKS.forEach((task) => {
      if (m[task]) misc[task] = m[task];
    });
    const isHidable = m.isHidable || (m.isHidableAfterDone && m.done);
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
      isHidable,
      hide,
      staying,
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
  filterSocialPlatformPersonal({
    userId,
    pages,
    displayName,
    url,
    isPublic,
  }) {
    const data = {
      displayName,
      id: userId,
      isPublic: isPublic !== false,
      url,
    };
    if (pages) data.pages = pages;
    return data;
  },
  filterSocialLinksPersonal({
    iconType,
    isPublic = true,
    order,
    siteDisplayName,
    url,
  }) {
    return {
      iconType,
      isPublic,
      order,
      siteDisplayName,
      url,
    };
  },
  filterSocialPlatformPublic({
    displayName,
    iconType,
    isExternalLink,
    order,
    siteDisplayName,
    url,
  }) {
    return {
      displayName,
      iconType,
      isExternalLink,
      order,
      siteDisplayName,
      url,
    };
  },
  filterSocialLinksMeta({
    displaySocialMediaOption = DISPLAY_SOCIAL_MEDIA_OPTIONS[0],
  }) {
    return {
      displaySocialMediaOption,
    };
  },
  filterUserSubscriptionInfo({
    subscriptionId,
    currentPeriodEnd,
    currentPeriodStart,
    isCanceled,
    isSubscribed,
  }) {
    return {
      subscriptionId,
      currentPeriodEnd,
      currentPeriodStart,
      isCanceled,
      isSubscribed,
    };
  },
};

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export default ValidationHelper;
