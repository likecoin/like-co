<template>
  <div class="auth-api-view" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { tryPostLoginRedirect } from '~/util/client';
import { EXTERNAL_HOSTNAME } from '~/constant';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'auth-api-view',
  layout: 'register',
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
      link: [
        { rel: 'prefetch', href: `https://firebase.${EXTERNAL_HOSTNAME}/__/auth/handler.js` },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
    ]),
  },
  created() {
    this.setAuthDialog({ isShow: !this.getUserIsRegistered });
  },
  mounted() {
    if (this.getUserIsRegistered) {
      logTrackerEvent(this, 'RegFlow', 'AlreadyRegistered', 'AlreadyRegistered', 1);
      const router = this.$router;
      const route = this.$route;
      if (!tryPostLoginRedirect({ route })) {
        this.doPostAuthRedirect({ router, route });
      }
    } else {
      window.addEventListener('beforeunload', this.logPageUnload, false);
      logTrackerEvent(this, 'RegFlow', 'RedirectSignUp', 'RedirectSignUp', 1);
    }
  },
  beforeDestroy() {
    this.setAuthDialog({ isShow: false });
    window.removeEventListener('beforeunload', this.logPageUnload, false);
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
      'doPostAuthRedirect',
    ]),
    logPageUnload() {
      logTrackerEvent(this, 'RegFlow', 'CloseRegisterPage', 'CloseRegisterPage', 1);
    },
  },
};
</script>
