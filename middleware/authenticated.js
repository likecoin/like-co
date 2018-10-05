export default function ({ store, route, redirect }) {
  console.log(store.getters);
  if (!store.getters.getUserIsRegistered) {
    store.commit('USER_SET_AFTER_AUTH_ROUTE', route);
    redirect('/in/register/login');
  }
}
