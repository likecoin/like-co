export default {
  name: 'register-callout',
  experimentID: 'YS8iov0eTKGQaaNt2CGykQ',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
