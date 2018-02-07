<template>
  <md-dialog :md-active.sync="!!this.case"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <img class="foxy" :src="icon" />
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title>
        {{ title }}
      </md-dialog-title>
      <md-dialog-content>{{ content }}</md-dialog-content>
      <img v-if="image" :src="image" />
      <section v-if="isInstallMetamask">
        <a href="https://metamask.io/" target="_blank">
          <md-button class="primary md-primary md-raised">
            Install Metamask
          </md-button>
        </a>
        <md-button class="secondary md-primary md-raised" @click="refreshPage">
          Done! Installed
        </md-button>
      </section>
    </div>
  </md-dialog>
</template>

<script>
import { IS_TESTNET } from '@/constant';
import metamaskIcon from '../assets/icons/metamask.svg';
import metamaskNetImg from '../assets/img/meta_net.png';
import metamaskTestNetImg from '../assets/img/meta_testnet.png';
import metamaskUnlockImg from '../assets/img/meta_unlock.png';

export default {
  name: 'MetamaskDialog',
  props: ['case'],
  data() {
    return {
      icon: metamaskIcon,
      metamaskNetImg: IS_TESTNET ? metamaskTestNetImg : metamaskNetImg,
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
          text = 'Plugin required';
          break;
        case 'testnet':
          text = `Please switch to ${IS_TESTNET ? 'Rinkeby' : 'Main'} network`;
          break;
        case 'locked':
          text = 'Please unlock Metamask';
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
          text = 'likecoin.store requires Metamask to work. Please switch to Chrome and install Metamask extension.';
          break;
        case 'testnet':
          text = `likecoin.store requires ${IS_TESTNET ? 'Rinkeby' : 'Main'} to work. Please switch to the correct network.`;
          break;
        case 'locked':
          text = 'likecoin.store requires Metamask to work. Please unlock your Metamask.';
          break;
        case 'sign':
          text = 'Please click Sign on Metamask to continue.';
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

<style lang="scss" scoped>
@import "../assets/dialog";

.title-bar {
  background-image: linear-gradient(252deg, #ed8526, #eebe78);
}

.md-button.primary {
  background-color: #ed8526 !important;
}

.md-button.secondary {
  background-color: #28646e !important;
}
</style>
