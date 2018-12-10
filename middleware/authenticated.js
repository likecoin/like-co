import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';

export default function ({ store, route, redirect }) {
  if (!store.getters.getUserIsRegistered) {
    if (!process.server) store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    redirect('/in/register');
  }
}
