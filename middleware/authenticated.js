import querystring from 'querystring';
import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';

import {
  TEST_MODE,
} from '@/constant';

function setRouteToLocalStorage(route) {
  if (window.sessionStorage) {
    if (route) {
      const {
        name,
        params,
        query,
        hash,
      } = route;
      window.sessionStorage.setItem(
        'USER_POST_AUTH_ROUTE',
        JSON.stringify({
          name,
          params,
          query,
          hash,
        }),
      );
    } else {
      window.sessionStorage.removeItem('USER_POST_AUTH_ROUTE');
    }
  }
}

export default function ({
  req,
  res,
  store,
  route,
  query,
  redirect,
}) {
  if (process.server) {
    res.set('Cache-Control', 'private');
    res.set('Vary', 'Cookie');
  }
  if (!store.getters.getUserIsRegistered) {
    let redirectPath = '/in/register';
    const { register, from, referrer } = query;
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
      setRouteToLocalStorage(route);
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
  } else if (!store.getters.getUserIsAuthCore && route.name !== 'in-migration-authcore') {
    let redirectPath = '/in/migration/authcore';
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
      setRouteToLocalStorage(route);
    } else {
      const qsPayload = {
        redirect: `${TEST_MODE ? 'http' : 'https'}://${req.headers.host}${route.fullPath}`,
      };
      redirectPath = `${redirectPath}?${querystring.stringify(qsPayload)}`;
    }
    redirect(redirectPath);
  }
}
