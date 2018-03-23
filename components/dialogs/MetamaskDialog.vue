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
        <a href="#" @click.prevent="onLedger">ledger</a>
      </section>
      <section v-if="isNotSign" class="hw-wallet">
        <!-- Only support ledger for now -->
<!--    <div v-if="isHardware">
        </div>
        <a href="#" v-else @click.prevent="isHardware=true">{{ $t('Dialog.metamask.label.hardwareWallet') }}</a>
      -->
        <div v-if="isMetamask">
          <a href="#" @click.prevent="onLedger">{{ $t('Dialog.metamask.label.ledger') }}</a>
        </div>
        <div v-else>
          <md-button class="secondary md-primary md-raised" @click="onCancel">
          {{ $t('General.button.cancel') }}
          </md-button>
        </div>
      </section>
    </div>
  </md-dialog>
</template>

<script>
import { IS_TESTNET } from '@/constant';
import { logTrackerEvent } from '@/util/EventLogger';
import EthHelper from '@/util/EthHelper';
import metamaskIcon from '@/assets/icons/metamask.svg';
import ledgerIcon from '@/assets/icons/ledger.svg';
import metamaskNetImg from '@/assets/img/meta_net.png';
import metamaskTestNetImg from '@/assets/img/meta_testnet.png';
import metamaskUnlockImg from '@/assets/img/meta_unlock.png';

export default {
  name: 'MetamaskDialog',
  props: ['case', 'webThreeType'],
  data() {
    return {
      metamaskNetImg: IS_TESTNET ? metamaskTestNetImg : metamaskNetImg,
      isHardware: false,
    };
  },
  computed: {
    icon() {
      if (this.webThreeType === 'ledger') return ledgerIcon;
      return metamaskIcon;
    },
    isInstallMetamask() {
      return this.case === 'web3';
    },
    isNotSign() {
      return this.case !== 'sign';
    },
    isMetamask() {
      return this.webThreeType === 'window' || this.webThreeType === 'infura';
    },
    title() {
      if (!this.isMetamask) {
        if (this.case === 'sign') {
          return this.$t(`Dialog.metamask.title.sign${this.webThreeType}`);
        }
        return this.$t(`Dialog.metamask.title.connect${this.webThreeType}`);
      }
      if (this.case === 'testnet') {
        return this.$t(`Dialog.metamask.title.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}`);
      }
      return this.$t(`Dialog.metamask.title.${this.case}`);
    },
    content() {
      if (!this.isMetamask) {
        if (this.case === 'sign') {
          return this.$t(`Dialog.metamask.content.sign${this.webThreeType}`);
        }
        return this.$t(`Dialog.metamask.content.connect${this.webThreeType}`);
      }
      if (this.case === 'testnet') {
        return this.$t(`Dialog.metamask.content.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}`);
      }
      return this.$t(`Dialog.metamask.content.${this.case}`);
    },
    image() {
      if (!this.isMetamask) return '';
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
      logTrackerEvent(this, 'RegFlow', 'InstallMetamaskSuccessfull', 'click install metamask complete and the metamask CTA disappear', 1);
      window.location.reload();
    },
    onInstallClick() {
      logTrackerEvent(this, 'RegFlow', 'ClickInstallMetamask', 'click install metamask', 1);
    },
    onLedger() {
      EthHelper.setLedgerOn();
    },
    onCancel() {
      EthHelper.resetWeb3();
    },
  },
  mounted() {
    if (this.isInstallMetamask) {
      logTrackerEvent(this, 'RegFlow', 'AppearMetamaskCTA', 'metamask install cta appear', 1);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/dialog";

.title-bar {
  background-image: linear-gradient(252deg, #ed8526, #eebe78);
}

.md-button.primary {
  background-color: #ed8526 !important;
}

.md-button.secondary {
  background-color: #28646e !important;
}

.md-dialog {
  > .md-dialog-container {
    .dialog-content {
      section.hw-wallet {
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
}

</style>
