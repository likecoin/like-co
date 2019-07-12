import querystring from 'querystring';
import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';

import {
  TEST_MODE,
} from '@/constant';

export default function ({
  req,
  res,
  store,
  route,
  query,
  redirect,
}) {
  if (!store.getters.getUserIsRegistered) {
    let redirectPath = '/in/register';
    const { login, from, referrer } = query;
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
      if (login === '1') redirectPath = `${redirectPath}?login=1`;
    } else {
      const qsPayload = {
        redirect: `${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`,
        from,
        referrer,
      };
      if (login === '1') qsPayload.login = '1';
      redirectPath = `${redirectPath}?${querystring.stringify(qsPayload)}`;
    }
    redirect(redirectPath);
  } else if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  }
}
