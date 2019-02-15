export default {
  name: 'register-callout',
  experimentID: 'dyCoY-tcRbSlBY5SWqZIWQ',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
