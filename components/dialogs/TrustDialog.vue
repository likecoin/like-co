<template>
  <base-dialog
    ref="base"
    :mdProps="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: false,
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

  </base-dialog>
</template>


<script>
import TrustIcon from '@/assets/icons/trust/trust.svg';
import TrustMainImage from '@/assets/icons/trust/trust_main.png';
import TrustRinkebyImage from '@/assets/icons/trust/trust_rinkeby.jpg';

import LanguageSwitch from '@/components/LanguageSwitch';
import { TRUST_URL } from '@/constant';
import BaseDialog from './BaseDialog';

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
      isShowDialog: true,
    };
  },
  computed: {
    isMain() {
      return this.case !== 'testnet';
    },
    isTrust() {
      return this.webThreeType === 'window';
    },
    title() {
      if (!this.isTrust) return this.$t('Dialog.trust.title.switchTrust');
      return this.$t(`Dialog.trust.title.switch${this.isMain ? 'Main' : 'Rinkeby'}`);
    },
    description() {
      if (!this.isTrust) {
        return this.$t('Dialog.trust.description.switchTrust');
      }
      return this.$t(`Dialog.trust.description.switch${this.isMain ? 'Main' : 'Rinkeby'}`);
    },
    image() {
      let image = null;
      if (this.isTrust) {
        image = this.isMain ? TrustMainImage : TrustRinkebyImage;
      }
      return image;
    },
    imageCaption() {
      let caption = null;
      if (this.isTrust) {
        caption = this.$t(`Dialog.trust.description.switch${this.isMain ? 'Main' : 'Rinkeby'}Caption`);
      }
      return caption;
    },
    buttonText() {
      if (!this.isTrust) {
        return this.$t('Dialog.trust.button.openWithTrust');
      }
      return null;
    },
  },
  methods: {
    openTrust() {
      global.window.open(TRUST_URL);
    },
  },
  mounted() {
    this.$nextTick(() => this.$refs.base.show());
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
