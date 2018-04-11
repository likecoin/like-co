const LIKE_AMOUNT = 8;

const getLikePlatformToObject = (id, amount = LIKE_AMOUNT) => ({
  name: 'id-amount',
  params: {
    id,
    amount,
  },
});

const teamMembers = [
  {
    key: 'kin',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('ckxpress'),
        isInternal: true,
      },
      {
        key: 'telegram',
        to: 'https://t.me/ckxpress',
      },
      {
        key: 'twitter',
        to: 'https://twitter.com/ckxpress',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/ckxpress',
      },
    ],
  },
  {
    key: 'aludirk',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('aludirk'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/Aludirk',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/aludirk/',
      },
    ],
  },
  {
    key: 'jacky',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('jackyko'),
        isInternal: true,
      },
      {
        key: 'telegram',
        to: 'https://t.me/JackyLikeCoin',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/jacky-ko-777848b0/',
      },
    ],
  },
  {
    key: 'edmond',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('edmondyu'),
        isInternal: true,
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/edmond-kcyu',
      },
    ],
  },
  {
    key: 'simonb',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('simonbut'),
        isInternal: true,
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/ka-ho-but-0b7825161/',
      },
    ],
  },
  {
    key: 'chung',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('chungwu'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/nnkken',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/chun-chung-wu-371766100/',
      },
    ],
  },
  {
    key: 'william',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('williamchong007'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/williamchong007',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/william-chong-01511a69/',
      },
    ],
  },
  {
    key: 'david',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('ngwingtat'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/nwingt',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/ngwingtat',
      },
    ],
  },
  {
    key: 'miles',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('mileswong'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/mileswong',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/miles-wong-5b3456150/',
      },
    ],
  },
  {
    key: 'michael',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('michaelcheung'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/mckingho',
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/king-ho-cheung-a94907a1/',
      },
    ],
  },
  {
    key: 'joshua',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('joshkiu'),
        isInternal: true,
      },
    ],
  },
];

export default teamMembers;
