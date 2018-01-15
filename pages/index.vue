<template>
  <section class="container">
    <nuxt-link :to="{ name: 'pay-id', params: { id: 'ckxpress' } }">
      <md-button>Pay ckxpress</md-button>
    </nuxt-link>
    <nuxt-link :to="{ name: 'pay-id', params: { id: 'williamchong007' } }">
      <md-button>Pay williamchong007</md-button>
    </nuxt-link>
    <nuxt-link :to="{ name: 'register' }">
      <md-button v-if="isEdit">Edit your current page</md-button>
      <md-button v-else>Make new account</md-button>
    </nuxt-link>
  </section>
</template>

<script>
import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters({
      isEdit: 'getUserIsRegistered',
    }),
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
