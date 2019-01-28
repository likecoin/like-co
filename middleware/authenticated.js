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
  redirect,
}) {
  if (!store.getters.getUserIsRegistered) {
    let redirectPath = '/in/register';
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    } else {
      const targeturl = encodeURIComponent(`${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`);
      redirectPath = `${redirectPath}?redirect=${targeturl}`;
    }
    redirect(redirectPath);
  }
}
