export default {
  name: 'signin-portal',
  experimentID: 'ex_s8iMBRQulAAWRftMAXQ',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'bottom', weight: 1 },
  ],
};
