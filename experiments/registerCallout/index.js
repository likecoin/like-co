export default {
  name: 'signin-portal',
  experimentID: 'C0smGzhoSiqacpB8lUhiJg',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'small', weight: 1 },
  ],
};
