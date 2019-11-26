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
    const { register, from, referrer } = query;
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
      if (register === '1') redirectPath = `${redirectPath}?register=1`;
    } else {
      const qsPayload = {
        redirect: `${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`,
      };
      if (from) qsPayload.from = from;
      if (referrer) qsPayload.referrer = referrer;
      if (register === '1') qsPayload.register = '1';
      redirectPath = `${redirectPath}?${querystring.stringify(qsPayload)}`;
    }
    redirect(redirectPath);
  } else if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  } else if (!store.getters.getUserIsAuthCore && route.name !== 'in-migration-authcore') {
    let redirectPath = '/in/migration/authcore';
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    } else {
      const qsPayload = {
        redirect: `${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`,
      };
      redirectPath = `${redirectPath}?${querystring.stringify(qsPayload)}`;
    }
    redirect(redirectPath);
  }
}
