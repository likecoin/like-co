export default {
  name: 'signin-portal',
  experimentID: '',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
