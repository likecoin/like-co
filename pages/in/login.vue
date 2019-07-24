<template>
  <div class="auth-api-view" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { tryPostLoginRedirect, isIOS } from '~/util/client';
import { EXTERNAL_HOSTNAME } from '~/constant';

import { logTrackerEvent, logTimingEvent } from '@/util/EventLogger';

export default {
  name: 'login-page',
  layout: 'register',
  head() {
    return {
      title: this.$t('Login.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Login.title'),
        },
      ],
      link: [
        { rel: 'prefetch', href: `https://firebase.${EXTERNAL_HOSTNAME}/__/auth/handler.js` },
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
  mounted() {
    const router = this.$router;
    const route = this.$route;
    const { register: registerQs, ...query } = route.query;
    if (route.name === 'in-login' && registerQs === '1') {
      router.replace({ name: 'in-register', query });
    } else {
      this.setAuthDialog({ isShow: !this.getUserIsRegistered, isSignIn: true });
      if (this.getUserIsRegistered) {
        logTrackerEvent(this, 'RegFlow', 'AlreadyLoggedIn', 'AlreadyLoggedIn', 1);
        if (!tryPostLoginRedirect({ route })) {
          this.doPostAuthRedirect({ router, route });
        }
      } else {
        window.addEventListener(this.unloadEventName, this.logPageUnload, false);
        this.logPageload();
      }
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
      logTimingEvent(this, 'RegFlow', 'CloseLoginPageTiming', 'CloseLoginPageTiming', value);
      logTrackerEvent(this, 'RegFlow', 'CloseLoginPage', 'CloseLoginPage', value);
    },
    logPageload() {
      let value = 1;
      if (window.performance) {
        value = Math.round(performance.now());
      }
      logTimingEvent(this, 'RegFlow', 'RedirectSignInTiming', 'RedirectSignInTiming', value);
      logTrackerEvent(this, 'RegFlow', 'RedirectSignIn', 'RedirectSignIn', value);
    },
  },
};
</script>
