import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';

export default function ({ store, route, redirect }) {
  if (!store.getters.getUserIsRegistered) {
    let redirectPath = '/in/register';
    if (!process.server) {
      store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    } else if (/^in-/.test(route.name) && (!route.params || !Object.keys(route.params).length)) {
      redirectPath = `${redirectPath}?ref=${route.name}`;
    }
    redirect(redirectPath);
  }
}
