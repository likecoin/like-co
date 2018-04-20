<template>
  <base-dialog
    ref="base"
    :mdProps="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: isFullscreen,
    }"
    class="with-icon">

      <!-- START - Header Section -->
      <div slot="header-center" class="lc-dialog-icon">
        <img :src="TrustIcon" />
      </div>
      <template slot="header-right">
        <language-switch color="white" />
      </template>
      <!-- END - Header Section -->


      <div class="lc-dialog-container-1">
        <div class="trust-dialog-content">

          <h1 v-if="title" class="title-label lc-font-size-32 lc-font-weight-300 lc-mobile">
            {{ title }}
          </h1>

          <div
            class="description lc-margin-vertical-12 lc-color-like-gray-4"
            v-if="description"
            v-html="description" />

          <figure v-if="image">
            <img :src="image" />
            <figcaption
              class="lc-color-like-green lc-padding-top-16"
              v-if="imageCaption"
              v-html="imageCaption" />
          </figure>

          <div v-if="!isTrust" class="lc-button-group lc-margin-top-24">
            <md-button class="md-likecoin trust" v-if="buttonText" @click="openTrust">
              {{ buttonText }}
            </md-button>
          </div>
        </div>
      </div>

  </base-dialog>
</template>


<script>
import TrustIcon from '@/assets/icons/trust/trust.svg';
import TrustMainImage from '@/assets/icons/trust/trust_main.png';
import TrustRinkebyImage from '@/assets/icons/trust/trust_rinkeby.jpg';

import LanguageSwitch from '@/components/LanguageSwitch';
import { IS_TESTNET, TRUST_URL } from '@/constant';
import BaseDialog from './BaseDialog';

const URL = require('url-parse');

export default {
  name: 'TrustDialog',
  props: ['case', 'webThreeType'],
  components: {
    BaseDialog,
    LanguageSwitch,
  },
  data() {
    return {
      TrustIcon,
      trustNetImg: IS_TESTNET ? TrustRinkebyImage : TrustMainImage,
      isShowDialog: true,
    };
  },
  computed: {
    isTrust() {
      return this.webThreeType === 'window';
    },
    title() {
      switch (this.case) {
        case 'web3':
          return this.$t('Dialog.trust.title.switchTrust');
        case 'testnet':
          return this.$t(`Dialog.trust.title.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}`);
        default:
          return '';
      }
    },
    description() {
      switch (this.case) {
        case 'web3':
          return this.$t('Dialog.trust.description.switchTrust');
        case 'testnet':
          return this.$t(`Dialog.trust.description.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}`);
        default:
          return '';
      }
    },
    isFullscreen() {
      switch (this.case) {
        case 'web3':
          return false;
        default:
          return true;
      }
    },
    image() {
      switch (this.case) {
        case 'testnet':
          return this.trustNetImg;
        case 'sign':
        case 'locked':
        default:
          return '';
      }
    },
    imageCaption() {
      switch (this.case) {
        case 'testnet':
          return this.$t(`Dialog.trust.description.switch${IS_TESTNET ? 'Rinkeby' : 'Main'}Caption`);
        default:
          return '';
      }
    },
    buttonText() {
      if (!this.isTrust) {
        return this.$t('Dialog.trust.button.openWithTrust');
      }
      return null;
    },
    isAndroid() {
      return /(android)/i.test(navigator.userAgent);
    },
    isIOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
  },
  methods: {
    openTrust() {
      const { window } = global;
      const currentURI = window.location.href;
      const url = `${TRUST_URL}${encodeURIComponent(currentURI)}`;
      if (this.isAndroid) {
        window.open(`intent://browser?target=${currentURI}/#Intent;scheme=trust;package=com.wallet.crypto.trustapp;S.browser_fallback_url=;end`);
      } else {
        window.open(url);
      }
    },
    tryTrustInstalled() {
      if (this.$route.query.notrust) return;
      if (this.isIOS) {
        const currentURI = window.location.href;
        window.location.href = `trust://browser?target=${currentURI}`;
        setTimeout(() => {
          try {
            const url = new URL(currentURI, true);
            url.query.notrust = 'true';
            url.set('query', url.query);
            window.location.href = url.toString();
          } catch (err) {
            // invalid URL;
          }
        }, 100);
      }
    },
  },
  mounted() {
    if (this.case && this.case !== 'sign') {
      this.$nextTick(() => {
        this.$refs.base.show();
        this.tryTrustInstalled();
      });
    } else {
      this.$nextTick(() => this.$refs.base.hide());
    }
  },
  watch: {
    case(c) {
      if (c && c !== 'sign') {
        this.$refs.base.show();
      } else {
        this.$refs.base.hide();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';

.lc-dialog {
  :global(.lc-dialog-header::before) {
    background-image: linear-gradient(263deg, #468cd5, #78bfee);
  }
}

.trust-dialog-content {
  @media (min-width: #{600px + 1px}) {
    padding-left: 16px;
    padding-right: 16px;
  }

  .title-label {
    color: $like-dark-brown-2;
  }

  figure {
    text-align: center;

    img {
      width: 248px;
      height: auto;
    }
  }

  .lc-button-group {
    text-align: center;

    .md-button.trust {
      background-color: #3375bb;

      /* styles to be removed after commit about .md-likecoin is merged */
      min-width: 256px;
      min-height: 40px;
      font-size: 24px;
      color: $like-white;
      border-radius: 0;
    }
  }
}

</style>
