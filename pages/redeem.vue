<template>
  <like-register-form :isEdit="isEdit" :isRedeem="true"/>
</template>

<script>
import * as types from '@/store/mutation-types';
import LikeRegisterForm from '~/components/LikeRegisterForm';
import { mapGetters } from 'vuex';

export default {
  name: 'Redeem',
  components: {
    LikeRegisterForm,
  },
  fetch({ store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect('/edit');
      return;
    }
    const title = 'Create a LikeCoin ID to receive and send LikeCoin';
    const subtitle = 'Create Account and Redeem';
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
  watch: {
    isEdit(e) {
      if (e) {
        this.$router.replace({ name: 'edit' });
      }
    },
  },
};
</script>
