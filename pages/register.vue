<template>
  <like-register-form :isEdit="isEdit"/>
</template>

<script>
import * as types from '@/store/mutation-types';
import LikeRegisterForm from '~/components/LikeRegisterForm';
import { mapGetters } from 'vuex';

export default {
  name: 'Register',
  layout: 'register',
  components: {
    LikeRegisterForm,
  },
  fetch({ store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect({ name: 'edit' });
      return;
    }
    const title = 'Register.header.title';
    const subtitle = 'Register.label.register';
    store.commit(types.UI_HEADER_UPDATE, {
      title,
      subtitle,
      icon: '',
    });
  },
  computed: {
    ...mapGetters({
      isEdit: 'getUserIsRegistered',
    }),
  },
};
</script>
