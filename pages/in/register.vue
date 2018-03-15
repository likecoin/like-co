<template>
  <like-register-form :isEdit="isEdit" :redirect="redirect"/>
</template>

<script>
import * as types from '@/store/mutation-types';
import LikeRegisterForm from '~/components/LikeRegisterForm';
import { mapGetters } from 'vuex';
import { apiGetUserById } from '@/util/api/api';
import { REDIRECT_WHITE_LIST } from '@/constant';

const URL = require('url-parse');

export default {
  name: 'Register',
  layout: 'register',
  components: {
    LikeRegisterForm,
  },
  data() {
    return {
      referrer: '',
      redirect: '',
    };
  },
  asyncData({ query, store, redirect }) {
    if (store.getters.getUserIsRegistered) {
      redirect({ name: 'in-edit' });
      return {};
    }
    let queryRedirect = '';
    if (query.redirect) {
      try {
        const url = new URL(query.redirect);
        if (!url.host || REDIRECT_WHITE_LIST.indexOf(url.host) === -1) {
          throw new Error(`${url.host} Not whitelisted`);
        }
        queryRedirect = query.redirect;
      } catch (err) {
        console.error(err);
      }
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
          return { referrer: displayName || referrerId, redirect: queryRedirect };
        })
        .catch(() => ({ referrer }));
    }
    return { referrer, redirect: queryRedirect };
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
