<template>
  <base-dialog
    ref="base"
    :mdProps="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: isFullscreen,
    }"
    class="with-icon"
  >

    <!-- START - Header Section -->
    <div
      slot="header-center"
      class="lc-section-header-icon lc-dialog-icon"
    >
      <img :src="TrustIcon">
    </div>
    <template slot="header-right">
      <language-switch color="white" />
    </template>
    <!-- END - Header Section -->


    <div class="lc-dialog-container-1">
      <div class="trust-dialog-content lc-color-like-gray-4">

        <h1
          v-if="title"
          class="title-label lc-font-size-32 lc-font-weight-300 lc-mobile"
        >
          {{ title }}
        </h1>

        <div
          v-if="description"
          class="description lc-margin-vertical-12 lc-mobile"
          v-html="description"
        />

        <figure v-if="image">
          <img :src="image">
          <figcaption
            v-if="imageCaption"
            class="lc-color-like-green lc-padding-top-16"
            v-html="imageCaption"
          />
        </figure>

        <div
          v-if="!isTrust"
          class="open-trust-container"
        >
          <div class="link-wrapper lc-margin-top-24 lc-margin-bottom-12 lc-mobile">
            <p
              class="lc-font-size-16 lc-mobile"
              v-html="$t('Dialog.trust.label.useTrustBrowser')"
            />
            <span class="lc-font-size-12">
              ({{ $t(`Dialog.trust.label.${isCopied ? 'copied' : 'clickToCopy'}`) }})
            </span>
            <br>
            <img
              v-clipboard:copy="COPY_URL"
              v-clipboard:success="handleClipboardCopySucceed"
              :src="InLinkIcon"
              class="lc-margin-top-12"
            >
          </div>

          <div class="lc-button-group">
            <md-button
              v-if="buttonText"
              class="md-likecoin trust"
              @click="openTrust"
            >
              {{ buttonText }}
            </md-button>
            <div class="lc-font-size-12 lc-margin-top-12">
              <a :href="getHelpLink">
                {{ $t('Dialog.trust.label.help') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </base-dialog>
</template>


<script>
import InLinkIcon from '@/assets/icons/trust/in-link.svg';
import TrustIcon from '@/assets/icons/trust/trust.svg';
import TrustMainImage from '@/assets/icons/trust/trust_main.png';
import TrustRinkebyImage from '@/assets/icons/trust/trust_rinkeby.jpg';

import LanguageSwitch from '@/components/LanguageSwitch';
import MaterialButton from '@/components/MaterialButton';
import { IS_TESTNET, TRUST_URL } from '@/constant';
import BaseDialog from './BaseDialog';

// const URL = require('url-parse');

export default {
  name: 'trust-dialog',
  components: {
    BaseDialog,
    LanguageSwitch,
    MaterialButton,
  },
  props: {
    case: {
      type: String,
      default: '',
    },
    webThreeType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      InLinkIcon,
      TrustIcon,
      COPY_URL: 'https://like.co/in',
      trustNetImg: IS_TESTNET ? TrustRinkebyImage : TrustMainImage,
      isCopied: false,
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
    isNotSign() {
      return this.case !== 'sign' && this.case !== 'login';
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
    getHelpLink() {
      return this.$t('Dialog.trust.label.registerMobileLink');
    },
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
  mounted() {
    if (this.case && this.isNotSign) {
      this.$nextTick(() => {
        this.$refs.base.show();
        this.tryTrustInstalled();
      });
    } else {
      this.$nextTick(() => this.$refs.base.hide());
    }
  },
  methods: {
    handleClipboardCopySucceed() {
      this.isCopied = true;
    },
    openTrust() {
      const { window } = global;
      const currentURI = window.location.href;
      const url = `${TRUST_URL}${encodeURIComponent(currentURI)}`;
      window.open(url);
    },
    tryTrustInstalled() {
      /* DISABLE DUE TO TRUST CRASHING */
      // if (this.$route.query.notrust) return;
      // if (this.isIOS) {
      //   const currentURI = window.location.href;
      //   window.location.href = `trust://browser?target=${currentURI}`;
      //   setTimeout(() => {
      //     try {
      //       const url = new URL(currentURI, true);
      //       url.query.notrust = 'true';
      //       url.set('query', url.query);
      //       window.location.href = url.toString();
      //     } catch (err) {
      //       // invalid URL;
      //     }
      //   }, 100);
      // }
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

  .open-trust-container {
    text-align: center;

    .md-button.trust {
      margin: 0;

      background-color: #3375bb;
    }
    a:not(.md-button) {
      text-decoration: underline;
    }
  }
}

</style>
