export default {
  name: 'register-form',
  experimentID: 'xv-Zi0_kTua3YKvpAbJORQ',
  isEligible: ({ route }) => route.path.includes('register'),
  variants: [
    { name: 'original', weight: 1 },
    { name: 'alternative', weight: 1 },
  ],
};
