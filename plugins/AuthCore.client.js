import { AuthCoreAuthClient } from 'authcore-js';

import { AUTHCORE_API_HOST } from '@/constant';
import * as types from '@/store/mutation-types';

export default async ({ store }) => {
  if (window && window.localStorage) {
    const accessToken = window.localStorage.getItem('authcore.accessToken');
    if (accessToken) {
      const authClient = await new AuthCoreAuthClient({
        apiBaseURL: AUTHCORE_API_HOST,
        callbacks: {
          unauthenticated: () => {
            store.dispatch('setAuthCoreToken', '');
          },
        },
        accessToken,
      });
      try {
        const user = await authClient.getCurrentUser();
        if (!user) throw new Error('NO_USER');
        store.commit(types.AUTHCORE_SET_AUTH_CLIENT, authClient);
        await store.dispatch('setAuthCoreToken', accessToken);
      } catch (err) {
        console.error(err);
      }
    }
  }
};
