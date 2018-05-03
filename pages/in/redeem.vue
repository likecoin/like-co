<template>
  <like-register-form :isRedeem="true" @registered="onSubmit"/>
</template>

<script>
import LikeRegisterForm from '~/components/LikeRegisterForm';

import * as types from '@/store/mutation-types';


export default {
  name: 'Redeem',
  layout: 'register',
  components: {
    LikeRegisterForm,
  },
  fetch({ store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect({ name: 'in' });
      return;
    }
    const title = 'Register.header.title';
    const subtitle = 'Register.label.registerRedeem';
    store.commit(types.UI_HEADER_UPDATE, {
      title,
      subtitle,
      icon: '',
    });
  },
  head() {
    return {
      title: this.$t('Register.header.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Register.header.title'),
        },
      ],
    };
  },
  methods: {
    onSubmit() {
      const { query } = this.$route;
      if (query.ref) {
        const newQuery = Object.assign({}, query);
        delete newQuery.ref;
        if (newQuery.from) delete newQuery.from;
        this.$router.push({ name: query.ref, query: newQuery });
      } else {
        const { hash } = document.location;
        this.$router.replace({
          hash,
          name: 'in',
          query,
        });
      }
    },
  },
};
</script>
