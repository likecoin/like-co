export default {
  name: 'register-callout',
  experimentID: 'ilEHNDPSR2-HoEo-yvLgdw',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
