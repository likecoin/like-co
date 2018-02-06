<template>
  <md-dialog :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <img class="foxy" :src="icon" />
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title>
        Desktop Chrome required
      </md-dialog-title>
      <md-dialog-content>
        likecoin.store require a browser that support ETH wallet extension MetaMask.<br />
        Please switch to desktop Chrome then install MetaMask plugin.
      </md-dialog-content>
      <a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank">
        <md-button class="primary md-primary md-raised">Install Chrome</md-button>
      </a>
    </div>
  </md-dialog>
</template>

<script>
import chromeIcon from '../assets/icons/chrome.png';

export default {
  name: 'ChromeDialog',
  props: ['show'],
  data() {
    return {
      icon: chromeIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/dialog";

.title-bar {
  background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);
}

@media (max-width: 768px) {
  .md-dialog {
    position: absolute;
    min-width: 350px;
  }
}
</style>
