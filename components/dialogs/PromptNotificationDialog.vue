<template>
  <base-dialog
    :is-show="getIsShowingPromptNotificationDialog"
    :md-props="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: false,
    }"
    class="prompt-email-dialog"
  >

    <div class="lc-dialog-container-1 lc-margin-bottom-16">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('Dialog.emailNotification.title') }}
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4">
        {{ $t('Dialog.emailNotification.content') }}
      </p>
    </div>

    <div class="lc-dialog-container-1">
      <div class="lc-button-group">
        <md-button
          class="md-likecoin"
          @click="onEnableEmail"
        >
          {{ $t('Dialog.emailNotification.button') }}
        </md-button>
      </div>
    </div>
    <div class="lc-text-align-center">
      <a
        class="lc-font-size-14 lc-underline"
        @click="onDismiss"
      >
        {{ $t('Dialog.emailNotification.label') }}
      </a>
    </div>
  </base-dialog>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import BaseDialog from '~/components/dialogs/BaseDialog';

export default {
  name: 'prompt-notification-dialog',
  components: {
    BaseDialog,
  },
  computed: {
    ...mapGetters([
      'getIsShowingPromptNotificationDialog',
      'getUserInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'setPromptNotificationDialog',
      'setNotification',
    ]),
    onEnableEmail() {
      const {
        user: id,
      } = this.getUserInfo;
      const user = this.getUserInfo;
      this.setNotification({ id, isEmailEnabled: true, user });
    },
    onDismiss() {
      this.setPromptNotificationDialog(false);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/mixin";

</style>
