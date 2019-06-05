export default {
  name: 'register-callout',
  experimentID: 'yjaEjDRCTUKzWgSAy63mdA',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
