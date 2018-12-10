export default {
  name: 'register-icon',

  experimentID: 'J6x_3gBySQa-AgPgpvtEyg',
  isEligible: ({ route }) => {
    const hasFromUser = !!route.query.from;
    return (route.name === 'in-register' && hasFromUser);
  },
  variants: [
    { weight: 1, name: 'likecoin' },
    { weight: 1, name: 'from-user-avatar' },
  ],
};
