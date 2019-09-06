import { AuthCoreAuthClient } from 'authcore-js';

import { AUTHCORE_API_HOST } from '@/constant';

export default async ({ store }) => {
  if (window && window.localStorage) {
    const accessToken = window.localStorage.getItem('authcore.accessToken');
    if (accessToken) {
      store.dispatch('setAuthCoreToken', accessToken);
      await new AuthCoreAuthClient({
        apiBaseURL: AUTHCORE_API_HOST,
        callbacks: {
          unauthenticated: () => {
            store.dispatch('setAuthCoreToken', '');
          },
        },
        accessToken,
      });
    }
  }
};
