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
    email: {
      type: String,
      default: undefined,
    },
    language: {
      type: String,
      default: 'en',
    },
    isFixContact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    SignInWidget() {
      // return this.isSignIn ? AuthCoreWidgets.Login : AuthCoreWidgets.Register;
      return AuthCoreWidgets.Login; // always use Login since have oauths
    },
    authCoreLanguage() {
      const lowerCase = this.language.toLowerCase();
      /* authcore only have zh-hk for now, cast chinese into zh-HK */
      if (lowerCase.includes('zh') || lowerCase.includes('cn')) {
        return 'zh-hk';
      }
      return 'en';
    },
  },
  async mounted() {
    this.widgetInstance = new this.SignInWidget({
      ...config,
      container: 'authcore-register-container',
      root: `${AUTHCORE_API_HOST}/widgets`,
      initialScreen: this.isSignIn ? 'signin' : 'register',
      contact: this.email,
      language: this.authCoreLanguage,
      onSuccess: async (data) => {
        const { access_token: accessToken, current_user: currentUser, id_token: idToken } = data;
        this.$emit('success', {
          accessToken,
          currentUser,
          idToken,
        });
      },
      fixedContact: this.email && this.isFixContact,
      onLoaded: () => this.$emit('loaded'),
      unauthenticated: (err) => {
        this.$emit('unauthenticated', err);
      },
    });
  },
};
</script>

<style lang="scss">
#authcore-register-container {
  > iframe {
    @media screen and (max-width: 536px) {
      width: 100vw !important;
    }
  }
}
</style>
