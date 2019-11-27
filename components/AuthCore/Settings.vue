<template>
  <div id="authcore-settings-container" />
</template>

<script>
import { AuthCoreWidgets } from 'authcore-js';
import config from './config';
import { AUTHCORE_API_HOST } from '@/constant';

export default {
  name: 'auth-core-settings',
  data() {
    return {
      widgetInstance: null,
    };
  },
  props: {
    isProfile: {
      type: Boolean,
      default: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    SettingsWidget() {
      return this.isProfile ? AuthCoreWidgets.Profile : AuthCoreWidgets.Settings;
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
      this.widgetInstance = new this.SettingsWidget({
        ...config,
        container: 'authcore-settings-container',
        accessToken: this.accessToken,
        language: this.authCoreLanguage,
        root: `${AUTHCORE_API_HOST}/widgets`,
        onSuccess: (data) => {
          const { action, ...payload } = data;
          let output;
          switch (action) {
            case 'profile_updated': {
              const {
                username: suggestedUserId,
                display_name: displayName,
                primary_email: email,
                primary_email_verified: isEmailVerified,
              } = payload.current_user;
              output = {
                suggestedUserId,
                displayName,
                email,
                isEmailVerified,
              };
              break;
            }
            default:
          }
          this.$emit(action.replace(/_/g, '-'), output);
        },
        onLoaded: () => {
          this.$emit('loaded');
        },
        unauthenticated: (err) => {
          console.error(err);
          this.$emit('unauthenticated', err);
        },
        ...this.options,
      });
    },
  },
  watch: {
    isProfile() {
      this.widgetInstance.destroy();
      this.initWidget();
    },
  },
};
</script>
