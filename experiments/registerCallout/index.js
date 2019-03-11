export default {
  name: 'register-callout',
  experimentID: 'inzcmx_8SyO9bISwnjEo2w',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
