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
      <md-dialog-content><span v-html="content" /></md-dialog-content>
      <img v-if="image" :src="image" />
      <section v-if="isInstallMetamask">
        <a href="https://metamask.io/" target="_blank" rel="noopener">
          <md-button class="primary md-primary md-raised" @click="onInstallClick">
            {{ $t('Dialog.metamask.button.install') }}
          </md-button>
        </a>
        <md-button class="secondary md-primary md-raised" @click="refreshPage">
          {{ $t('Dialog.metamask.button.doneInstalled') }}
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
      if (this.case === 'testnet') {
        return this.$t(`Dialog.metamask.title.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}`);
      }
      return this.$t(`Dialog.metamask.title.${this.case}`);
    },
    content() {
      if (this.case === 'testnet') {
        return this.$t(`Dialog.metamask.content.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}`);
      }
      return this.$t(`Dialog.metamask.content.${this.case}`);
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
      if (this.$ga) this.$ga.event('RegFlow', 'InstallMetamaskSuccessfull', 'click install metamask complete and the metamask CTA disappear', 1);
      window.location.reload();
    },
    onInstallClick() {
      if (this.$ga) this.$ga.event('RegFlow', 'ClickInstallMetamask', 'click install metamask', 1);
    },
  },
  mounted() {
    if (this.isInstallMetamask) {
      if (this.$ga) this.$ga.event('RegFlow', 'AppearMetamaskCTA', 'metamask install cta appear', 1);
    }
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
