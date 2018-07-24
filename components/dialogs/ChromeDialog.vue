<template>
  <md-dialog
    :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false"
  >

    <img
      :src="icon"
      class="foxy"
    >
    <div class="title-bar" />

    <div class="dialog-content">
      <md-dialog-title>
        {{ $t('Dialog.chrome.title') }}
      </md-dialog-title>

      <md-dialog-content>
        <div v-html="$t('Dialog.chrome.content')" />
      </md-dialog-content>

      <a
        href="https://www.google.com/chrome/browser/desktop/index.html"
        target="_blank"
        rel="noopener"
      >
        <material-button class="md-primary md-raised">
          {{ $t('Dialog.chrome.button.install') }}
        </material-button>
      </a>
    </div>

  </md-dialog>
</template>

<script>
import MaterialButton from '@/components/MaterialButton';

import chromeIcon from '@/assets/icons/chrome.png';

export default {
  name: 'chrome-dialog',
  components: {
    MaterialButton,
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

<style lang="scss" scoped>
@import "~assets/dialog";

.title-bar {
  background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);
}
</style>
