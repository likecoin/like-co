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
    redirectUrl: {
      type: String,
      default: undefined,
    },
    isFixContact: {
      type: Boolean,
      default: false,
    },
    socialLoginPaneStyle: {
      type: String,
      default: 'top',
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
    this.initWidget();
  },
  methods: {
    initWidget() {
      this.widgetInstance = new this.SignInWidget({
        ...config,
        container: 'authcore-register-container',
        root: `${AUTHCORE_API_HOST}/widgets`,
        initialScreen: this.isSignIn ? 'signin' : 'register',
        socialLoginPaneStyle: this.socialLoginPaneStyle,
        internal: true,
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
        successRedirectUrl: this.redirectUrl,
        onLoaded: () => this.$emit('loaded'),
        analyticsHook: (type, data) => {
          let payload;
          const actualType = type.replace('Authcore_', '');
          switch (actualType) {
            case 'registerStarted': payload = data.method; break;
            case 'loginStarted': payload = data.method; break;
            case 'oauthStarted': payload = data.service; break;
            case 'navigation': payload = data.to; break;
            default: break;
          }
          this.$emit(actualType, payload);
        },
        unauthenticated: (err) => {
          this.$emit('unauthenticated', err);
        },
      });
    },
  },
  watch: {
    redirectUrl() {
      this.widgetInstance.destroy();
      this.initWidget();
    },
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
