<template>
  <md-dialog
    class="metamask-dialog"
    :md-active.sync="!!this.case"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">

    <img class="foxy" :src="icon" />

    <div class="title-bar">
      <div class="left">
        <md-button
          v-if="shouldShowReturnButton"
          class="md-icon-button md-dense"
          @click="handleReturnButtonClick">
          <simple-svg
            :filepath="ArrowIcon"
            width="18px"
            height="18px"
            fill="white"
            stroke="transparent"
            />
        </md-button>
      </div>
      <div class="right">
        <language-switch color="white" />
      </div>
    </div>

    <div class="dialog-content">
      <md-dialog-title>
        {{ title }}
      </md-dialog-title>

      <md-dialog-content>
        <span v-html="content" />
      </md-dialog-content>

      <img v-if="image" :src="image" />

      <section v-if="isInstallMetamask">
        <a href="https://metamask.io/" target="_blank" rel="noopener">
          <material-button class="primary" @click="onInstallClick">
            {{ $t('Dialog.metamask.button.install') }}
          </material-button>
        </a>
        <material-button @click="refreshPage">
          {{ $t('Dialog.metamask.button.doneInstalled') }}
        </material-button>
      </section>

      <section v-if="isNotSign" class="lc-font-size-12 lc-margin-top-8">
        <!-- Only support ledger for now -->
<!--    <div v-if="isHardware">
        </div>
        <a href="#" v-else @click.prevent="isHardware=true">{{ $t('Dialog.metamask.label.hardwareWallet') }}</a>
      -->
        <div v-if="isMetamask">
          <a href="#" @click.prevent="onLedger">{{ $t('Dialog.metamask.label.ledger') }}</a>
        </div>
        <div v-else>
          <material-button @click="onCancel">
            {{ $t('General.button.cancel') }}
          </material-button>
        </div>
      </section>
    </div>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';

import LanguageSwitch from '@/components/LanguageSwitch';
import MaterialButton from '@/components/MaterialButton';

import { IS_TESTNET } from '@/constant';
import { logTrackerEvent } from '@/util/EventLogger';
import EthHelper from '@/util/EthHelper';
import ArrowIcon from '@/assets/icons/arrow-left.svg';
import metamaskIcon from '@/assets/icons/metamask.svg';
import ledgerIcon from '@/assets/icons/ledger.svg';
import metamaskNetImg from '@/assets/img/meta_net.png';
import metamaskTestNetImg from '@/assets/img/meta_testnet.png';
import metamaskUnlockImg from '@/assets/img/meta_unlock.png';

export default {
  name: 'MetamaskDialog',
  props: ['case', 'webThreeType'],
  components: {
    LanguageSwitch,
    MaterialButton,
  },
  data() {
    return {
      ArrowIcon,
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
    shouldShowReturnButton() {
      return this.case === 'locked';
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
    ...mapActions([
      'hideLoginWindow',
    ]),
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
    handleReturnButtonClick() {
      const { name, query } = this.$route;
      if (query.ref !== undefined) {
        this.$router.go(-1);
      } else if (name !== 'in-register') {
        this.hideLoginWindow();
        EthHelper.clearErrCb();
      } else {
        this.$router.push({ name: 'index' });
      }
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

.metamask-dialog {
  .title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    background-image: linear-gradient(252deg, #ed8526, #eebe78);

    > div {
      position: relative;

      padding: 0 8px;
    }
  }

  .dialog-content {
    .md-button.primary {
      background-color: #ed8526;
    }
  }
}

</style>
