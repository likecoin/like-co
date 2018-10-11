import {
  USER_SET_AFTER_AUTH_ROUTE,
} from '@/store/mutation-types';

export default function ({ store, route, redirect }) {
  if (!store.getters.getUserIsRegistered) {
    store.commit(USER_SET_AFTER_AUTH_ROUTE, route);
    redirect('/?show_login=true');
  }
}
