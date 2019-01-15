<template>
  <div class="auth-api-view" />
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'auth-api-view',
  layout: 'blank',
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
  },
  mounted() {
    if (this.getUserIsRegistered) {
      const router = this.$router;
      const route = this.$route;
      this.doPostAuthRedirect({ router, route });
    } else {
      logTrackerEvent(this, 'RegFlow', 'RedirectSignUp', 'RedirectSignUp', 1);
      this.setAuthDialog({ isShow: true });
      window.addEventListener('beforeunload', this.logPageUnload, false);
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
