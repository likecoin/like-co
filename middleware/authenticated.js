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
    let redirectPath = '/in/login';
    const { register, from, referrer } = query;
    if (register === '1') redirectPath = '/in/register';
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    } else {
      const qsPayload = {
        redirect: `${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`,
      };
      if (from) qsPayload.from = from;
      if (referrer) qsPayload.referrer = referrer;
      redirectPath = `${redirectPath}?${querystring.stringify(qsPayload)}`;
    }
    redirect(redirectPath);
  } else if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  }
}
