<template>
  <section class="container">
    <nuxt-link :to="{ name: 'pay-id', params: { id: 'ckxpress' } }">
      <md-button>Pay ckxpress</md-button>
    </nuxt-link>
    <nuxt-link :to="{ name: 'pay-id', params: { id: 'williamchong007' } }">
      <md-button>Pay williamchong007</md-button>
    </nuxt-link>
    <nuxt-link :to="{ name: 'register' }">
      <md-button>Make new account</md-button>
    </nuxt-link>
  </section>
</template>

<script>
import * as types from '@/store/mutation-types';

export default {
  fetch({ store }) {
    store.commit(types.UI_HEADER_UPDATE, {
      title: 'Welcome to LikeCoin.store',
      subtitle: 'Likestore (WIP)',
      icon: '',
    });
  },
  head() {
    return {
      title: 'Landing - In progress',
    };
  },
};
</script>

<style scoped>
.title
{
  margin: 30px 0;
}
.users
{
  list-style: none;
  margin: 0;
  padding: 0;
}
.user
{
  margin: 10px 0;
}
</style>
