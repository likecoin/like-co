export default {
  name: 'register-callout',
  experimentID: '0UL9jCitQF-3wbrVyQSnpg',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
