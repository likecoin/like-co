<template>
  <like-register-form :isEdit="isEdit" :isRedeem="true"/>
</template>

<script>
import * as types from '@/store/mutation-types';
import LikeRegisterForm from '~/components/LikeRegisterForm';
import { mapGetters } from 'vuex';

export default {
  name: 'Redeem',
  layout: 'register',
  components: {
    LikeRegisterForm,
  },
  fetch({ store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect({ name: 'in-edit' });
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
  computed: {
    ...mapGetters({
      isEdit: 'getUserIsRegistered',
    }),
  },
};
</script>
