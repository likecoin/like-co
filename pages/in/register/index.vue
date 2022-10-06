<template>
  <AuthDialogV2 />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { tryPostLoginRedirect, isIOS } from '~/util/client';

import { logTrackerEvent, logTimingEvent } from '@/util/EventLogger';

import AuthDialogV2 from '~/components/v2/dialogs/AuthDialogV2';

export default {
  name: 'auth-api-view',
  layout: 'register',
  components: {
    AuthDialogV2,
  },
  head() {
    return {
      title: this.$t('Register.label.register'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Register.label.register'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Register.header.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Register.header.title'),
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
    ]),
    unloadEventName() {
      return isIOS() ? 'pagehide' : 'beforeunload';
    },
  },
  created() {
    this.setAuthDialog({ isShow: true });
  },
  mounted() {
    const { redirect_sign_in: isRedirectSignIn } = this.$route.query;
    if (this.getUserIsRegistered) {
      logTrackerEvent(this, 'RegFlow', 'AlreadyRegistered', 'AlreadyRegistered', 1);
      const router = this.$router;
      const route = this.$route;
      if (!isRedirectSignIn && !tryPostLoginRedirect({ route })) {
        this.doPostAuthRedirect({ router, route });
      }
    } else {
      window.addEventListener(this.unloadEventName, this.logPageUnload, false);
      this.logPageload();
    }
  },
  beforeDestroy() {
    this.setAuthDialog({ isShow: false });
    window.removeEventListener(this.unloadEventName, this.logPageUnload, false);
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
      'doPostAuthRedirect',
    ]),
    logPageUnload() {
      let value = 1;
      if (window.performance) {
        value = Math.round(performance.now());
      }
      logTimingEvent(this, 'RegFlow', 'CloseRegisterPageTiming', 'CloseRegisterPageTiming', value);
      logTrackerEvent(this, 'RegFlow', 'CloseRegisterPage', 'CloseRegisterPage', value);
    },
    logPageload() {
      let value = 1;
      if (window.performance) {
        value = Math.round(performance.now());
      }
      logTimingEvent(this, 'RegFlow', 'RedirectSignUpTiming', 'RedirectSignUpTiming', value);
      logTrackerEvent(this, 'RegFlow', 'RedirectSignUp', 'RedirectSignUp', value);
    },
  },
};
</script>
