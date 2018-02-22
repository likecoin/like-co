<template>
  <like-register-form :isEdit="isEdit"/>
</template>

<script>
import * as types from '@/store/mutation-types';
import LikeRegisterForm from '~/components/LikeRegisterForm';
import { mapGetters } from 'vuex';
import { apiGetUserById } from '@/util/api/api';

export default {
  name: 'Register',
  layout: 'register',
  components: {
    LikeRegisterForm,
  },
  data() {
    return {
      referrer: '',
    };
  },
  asyncData({ query, store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect({ name: 'edit' });
      return {};
    }
    const title = 'Register.header.title';
    const subtitle = 'Register.label.register';
    store.commit(types.UI_HEADER_UPDATE, {
      title,
      subtitle,
      icon: '',
    });
    const referrer = '';
    const referrerId = query.from;
    if (referrerId) {
      return apiGetUserById(referrerId)
        .then((res) => {
          const { displayName } = res.data;
          return { referrer: displayName || referrerId };
        })
        .catch(() => ({ referrer }));
    }
    return { referrer };
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.title,
        },
      ],
    };
  },
  computed: {
    title() {
      return this.referrer ? this.$t('Register.header.titleReferral', { name: this.referrer }) : this.$t('Register.header.title');
    },
    ...mapGetters({
      isEdit: 'getUserIsRegistered',
    }),
  },
};
</script>
