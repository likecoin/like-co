<template>
  <md-dialog :md-active.sync="show"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <img class="foxy" :src="icon" />
    <div class="title-bar"></div>
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
  </md-dialog>
</template>

<script>
import chromeIcon from '../assets/icons/chrome.png';

export default {
  name: 'ChromeDialog',
  data() {
    return {
      show: false,
      icon: chromeIcon,
    };
  },
  methods: {
    checkIsDesktopChrome() {
      const ua = window.navigator.userAgent;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        return false;
      }
      return (/Chrome/i.test(ua));
    },
  },
  mounted() {
    this.show = !this.checkIsDesktopChrome();
  },
};
</script>

<style scoped>

.md-dialog {
  position: absolute;
  min-width: 450px;
  max-width: 500px;
  min-height: 188px;
  border-radius: 6px;
  overflow: visible;
}

.md-dialog-container {
  overflow: hidden;
  border-radius: 6px;
}

.title-bar {
  border-radius: 6px 6px 0 0;
  position: absolute;
  top: 0px;
  width: 100%;
  height: 48px;
  background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  display: flex;
}

.foxy {
  position: fixed;
  top: -50px;
  z-index: 999;
  left: calc(50% - 55px);
}

.md-dialog-title {
  padding-top: 70px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 32px;
}

.md-dialog-content {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 16px;
}

.md-button {
  height: 40px;
  margin-left: 20%;
  margin-right: 20%;
  font-size: 20px;
}

a {
  display: flex;
  flex-direction: column;
  flex: 1;
}

</style>
