export const getUserInfo = state => state.user;

export const getUserIsFetching = state => state.isFetching;

export const getUserIsRegistered = state => !!state.user.wallet;

export const getLocalWallet = state => state.wallet;
