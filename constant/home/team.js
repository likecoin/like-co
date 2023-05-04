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
        key: 'matters',
        to: 'https://matters.town/@ckxpress',
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
    key: 'phoebe',
    platforms: [
      {
        key: 'like',
        to: getLikePlatformToObject('phoebe_fb'),
        isInternal: true,
      },
      {
        key: 'linkedin',
        to: 'https://www.linkedin.com/in/poonphoebe',
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
        to: getLikePlatformToObject('williamchong'),
        isInternal: true,
      },
      {
        key: 'github',
        to: 'https://github.com/williamchong',
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
