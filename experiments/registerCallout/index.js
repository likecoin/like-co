export default {
  name: 'register-callout',
  experimentID: '0fcAjfIyTrWZd5iWol_avA',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
