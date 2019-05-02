<template>
  <base-dialog
    :is-show="show"
    :md-props="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: false,
    }"
    class="chrome-dialog with-icon"
  >
    <div
      slot="header-center"
      class="lc-dialog-icon"
    >
      <img :src="icon">
    </div>

    <div class="lc-dialog-container-1">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('Dialog.chrome.title') }}
      </h1>
      <p
        class="lc-font-size-16 lc-color-like-gray-4"
        v-html="$t('Dialog.chrome.content')"
      />

      <div class="lc-button-group lc-margin-top-24">
        <md-button
          class="md-likecoin"
          href="https://www.google.com/chrome/browser/desktop/index.html"
          target="_blank"
          rel="noopener"
        >
          {{ $t('Dialog.chrome.button.install') }}
        </md-button>
      </div>
    </div>
  </base-dialog>
</template>

<script>
import BaseDialog from '~/components/dialogs/BaseDialog';

import chromeIcon from '@/assets/icons/chrome.png';

export default {
  name: 'chrome-dialog',
  components: {
    BaseDialog,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icon: chromeIcon,
    };
  },
};
</script>
