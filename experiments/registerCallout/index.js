export default {
  name: 'register-callout',
  experimentID: 'tEAYzZ9rQGKDk83xnvDXCw',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 9 },
    { name: 'alternative', weight: 1 },
  ],
};
