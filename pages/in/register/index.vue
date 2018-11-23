<template>
  <div class="auth-api-view" />
</template>

<script>
import { mapActions } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'auth-api-view',
  layout: 'blank',
  mounted() {
    logTrackerEvent(this, 'RegFlow', 'RedirectSignUp', 'RedirectSignUp', 1);
    this.setAuthDialog({ isShow: true });
  },
  beforeDestroy() {
    this.setAuthDialog({ isShow: false });
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
      'setUserNeedAuth',
      'refreshUser',
      'showLoginWindow',
    ]),
  },
};
</script>
