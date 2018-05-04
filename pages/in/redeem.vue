<template>
  <like-register-form :isRedeem="true" />
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
};
</script>
