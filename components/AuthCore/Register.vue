<template>
  <div id="authcore-register-container" />
</template>

<script>
import {
  AuthCoreWidgets,
} from 'authcore-js';
import config from './config';
import { AUTHCORE_API_HOST } from '@/constant';

export default {
  name: 'auth-core-register',
  data() {
    return {
      widgetInstance: null,
    };
  },
  props: {
    isSignIn: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    SignInWidget() {
      return this.isSignIn ? AuthCoreWidgets.Login : AuthCoreWidgets.Register;
    },
  },
  async mounted() {
    this.widgetInstance = new this.SignInWidget({
      ...config,
      container: 'authcore-register-container',
      root: `${AUTHCORE_API_HOST}/widgets`,
      callbacks: {
        onSuccess: async (data) => {
          const { access_token: accessToken, current_user: currentUser, id_token: idToken } = data;
          this.$emit('success', {
            accessToken,
            currentUser,
            idToken,
          });
        },
        onLoaded: () => this.$emit('loaded'),
        unauthenticated: (err) => {
          this.$emit('unauthenticated', err);
        },
      },
    });
  },
};
</script>
