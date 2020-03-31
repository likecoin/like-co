export default {
  name: 'signin-portal',
  experimentID: '9v7OW7X8QYiJOLJtjwguuw',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'list', weight: 1 },
  ],
};
