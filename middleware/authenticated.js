import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';
import { EXTERNAL_HOSTNAME } from '@/constant';

export default function ({ store, route, redirect }) {
  if (!store.getters.getUserIsRegistered) {
    let redirectPath = '/in/register';
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    } else {
      const targeturl = encodeURIComponent(`https://${EXTERNAL_HOSTNAME}${route.fullPath}`);
      redirectPath = `${redirectPath}?redirect=${targeturl}`;
    }
    redirect(redirectPath);
  }
}
