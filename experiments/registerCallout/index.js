export default {
  name: 'signin-portal',
  experimentID: 'woKU6_1STkWqyFTOsCGWlg',
  isEligible: ({ route, query }) => route.path.includes('register') && query.from,
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
