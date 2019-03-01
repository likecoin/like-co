export default {
  name: 'register-callout',
  experimentID: 'C2y4FL-nT_eCJBDYcaEc4g',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
