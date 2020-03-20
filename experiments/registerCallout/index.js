export default {
  name: 'signin-portal',
  experimentID: 'i5vK4nqKSamlfl0StUVCIA',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'list', weight: 1 },
  ],
};
