export default {
  name: 'register-callout',
  experimentID: 'sNGEfeXpSPeRe1Bh7pYVcw',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
