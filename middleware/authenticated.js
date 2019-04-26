import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';

import {
  TEST_MODE,
} from '@/constant';

export default function ({
  req,
  store,
  route,
  query,
  redirect,
}) {
  if (!store.getters.getUserIsRegistered) {
    let redirectPath = '/in/register';
    const { login } = query;
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
      if (login === '1') redirectPath = `${redirectPath}?login=1`;
    } else {
      const targeturl = encodeURIComponent(`${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`);
      redirectPath = `${redirectPath}?redirect=${targeturl}`;
      if (login === '1') redirectPath = `${redirectPath}&login=1`;
    }
    redirect(redirectPath);
  }
}
