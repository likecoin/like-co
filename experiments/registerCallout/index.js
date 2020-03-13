export default {
  name: 'signin-portal',
  experimentID: 'gaPNkOqMSnK0MTR02B8XjA',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'bottom', weight: 1 },
  ],
};
