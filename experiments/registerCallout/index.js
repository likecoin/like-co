export default {
  name: 'register-callout',
  experimentID: 's9KAskicTKqQpenKOk8D0g',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
