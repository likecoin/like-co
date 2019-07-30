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
    key: 'tomlam',
    platforms: [
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/chungsang-tom-lam-586014158/',
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
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/joshua-lo-1662a3190/',
      },
    ],
  },
];

export default teamMembers;
