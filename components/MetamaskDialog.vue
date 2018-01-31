<template>
  <md-dialog :md-active.sync="!!this.case"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <img class="foxy" :src="icon" />
    <div class="title-bar"></div>
    <md-dialog-title>
      {{ title }}
    </md-dialog-title>
    <md-dialog-content>{{ content }}</md-dialog-content>
    <img v-if="image" :src="image" />
    <section v-if="isInstallMetamask">
      <a href="https://metamask.io/" target="_blank">
        <md-button class="primary md-primary md-raised">Install Metamask</md-button>
      </a>
      <md-button class="secondary md-primary md-raised" @click="refreshPage">Done! Installed</md-button>
    </section>
  </md-dialog>
</template>

<script>
import metamaskIcon from '../assets/icons/metamask.svg';
import metamaskNetImg from '../assets/img/meta_net.png';
import metamaskTestNetImg from '../assets/img/meta_testnet.png';
import metamaskUnlockImg from '../assets/img/meta_unlock.png';

const isTestNet = process.env.IS_TESTNET;

export default {
  name: 'MetamaskDialog',
  props: ['case'],
  data() {
    return {
      icon: metamaskIcon,
      metamaskNetImg: isTestNet ? metamaskTestNetImg : metamaskNetImg,
    };
  },
  computed: {
    isInstallMetamask() {
      return this.case === 'web3';
    },
    title() {
      let text;
      switch (this.case) {
        case 'web3':
          text = 'Plugin require';
          break;
        case 'testnet':
          text = `Please switch back to ${isTestNet ? 'Rinkeby' : 'Main'} network`;
          break;
        case 'locked':
          text = 'Please Unlock MetaMask';
          break;
        case 'sign':
          text = 'Sign on Metamask';
          break;
        default:
          text = '';
      }
      return text;
    },
    content() {
      let text;
      switch (this.case) {
        case 'web3':
          text = 'likecoin.store require ETH wallet MetaMask to work. Please switch to Chrome and install MetaMask plugin.';
          break;
        case 'testnet':
          text = 'likecoin.store require ETH wallet MetaMask to work. Please switch to the correct network.';
          break;
        case 'locked':
          text = 'likecoin.store require ETH wallet MetaMask to work. Please unlock your metamask wallet.';
          break;
        case 'sign':
          text = 'Please press Sign on metamask to continue';
          break;
        default:
          text = '';
      }
      return text;
    },
    image() {
      switch (this.case) {
        case 'testnet':
          return this.metamaskNetImg;
        case 'locked':
          return metamaskUnlockImg;
        default:
          return '';
      }
    },
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
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
  background-image: linear-gradient(252deg, #ed8526, #eebe78);
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

section, a {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.md-button.primary {
  background-color: #ed8526 !important;
}

.md-button.secondary {
  background-color: #28646e !important;
}
</style>
