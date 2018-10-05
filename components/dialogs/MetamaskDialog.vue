<template>
  <div class="metamask-dialog">
    <base-dialog
      :is-show="!!this.case"
      :md-props="{
        mdClickOutsideToClose: false,
        mdCloseOnEsc: false,
        mdFullscreen: false,
      }"
    >
      <div slot="header-left">
        <md-button
          v-if="shouldShowReturnButton"
          class="md-icon-button md-dense"
          @click="handleReturnButtonClick"
        >
          <simple-svg
            :filepath="ArrowLeftIcon"
            width="18px"
            height="18px"
            fill="white"
            stroke="transparent"
          />
        </md-button>
      </div>

      <div
        slot="header-center"
        class="lc-section-header-icon lc-dialog-icon"
      >
        <img :src="icon">
      </div>

      <div slot="header-right">
        <language-switch color="white" />
      </div>

      <div class="metamask-dialog__content">
        <div class="lc-dialog-container-1">
          <h1
            class="lc-font-size-32 lc-color-like-dark-brown-2 lc-margin-top-16 lc-margin-bottom-8"
            v-html="title"
          />

          <p class="lc-margin-bottom-8 lc-color-like-gray-4 lc-font-size-16 lc-font-weight-300">
            <span v-html="content" />
          </p>

          <img
            v-if="image"
            :src="image"
          >

          <section v-if="isInstallMetamask">
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener"
            >
              <md-button
                class="primary md-likecoin"
                @click="onInstallClick"
              >
                {{ $t('Dialog.metamask.button.install') }}
              </md-button>
            </a>
            <md-button
              class="md-likecoin"
              @click="refreshPage"
            >
              {{ $t('Dialog.metamask.button.doneInstalled') }}
            </md-button>
          </section>

          <section
            v-if="isNotSign"
            class="lc-font-size-12 lc-margin-top-8"
          >
            <!-- Only support ledger for now -->
            <!--    <div v-if="isHardware">
            </div>
            <a href="#" v-else @click.prevent="isHardware=true">
              {{ $t('Dialog.metamask.label.hardwareWallet') }}
            </a>
          -->
            <div
              v-if="isMetamask"
              class="lc-text-align-center"
            >
              <a
                href="#"
                @click.prevent="onLedger"
              >{{ $t('Dialog.metamask.label.ledger') }}</a>
            </div>
            <div v-else>
              <md-button
                class="md-likecoin"
                @click="onCancel"
              >
                {{ $t('General.button.cancel') }}
              </md-button>
            </div>
          </section>
        </div>

        <section
          v-if="getSignPayloadObject.action === 'sendLIKE'"
        >
          <div class="lc-bg-gray-1 lc-margin-top-16 lc-padding-vertical-16">
            <div class="lc-dialog-container-1">
              <div class="metamask-dialog__send-message">
                <span class="lc-font-size-12 lc-color-like-gray-5">
                  {{ $t('Dialog.metamask.label.sending') }}
                </span>
                <simple-svg
                  :filepath="ArrowRightIcon"
                  width="20px"
                  height="16px"
                  fill="#9b9b9b"
                  stroke="transparent"
                />
                <span class="lc-color-like-green lc-font-weight-600 lc-font-size-16">
                  {{ this.$route.params.id }}
                </span>
                <span class="lc-color-gray-9b lc-font-size-16">
                  &#160;({{ maskWallet(getSignPayloadObject.payload.to) }})
                </span>
              </div>
            </div>

            <hr class="lc-margin-vertical-12">

            <div class="lc-dialog-container-1">
              <div
                class="lc-dialog-container-2 lc-font-weight-300 lc-text-align-center"
                v-html="getFormattedLikeValue(likeTransferValue)"
              />
              <div
                :class="[
                  'metamask-dialog__send-currency',
                  'lc-font-weight-600',
                  'lc-color-like-green',
                  'lc-font-size-14',
                ]"
              >
                LIKE
              </div>
            </div>
          </div>

          <p class="lc-margin-top-12 lc-text-align-center lc-color-gray-9b">
            (${{ usdTransferStrValue }} USD)
          </p>
        </section>

      </div>
    </base-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import BaseDialog from '~/components/dialogs/BaseDialog';
import LanguageSwitch from '@/components/LanguageSwitch';

import { IS_TESTNET, ONE_LIKE } from '@/constant';
import { logTrackerEvent } from '@/util/EventLogger';
import EthHelper from '@/util/EthHelper';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import metamaskIcon from '@/assets/icons/metamask.svg';
import ledgerIcon from '@/assets/icons/ledger.svg';
import metamaskNetImg from '@/assets/img/meta_net.png';
import metamaskTestNetImg from '@/assets/img/meta_testnet.png';
import metamaskUnlockImg from '@/assets/img/meta_unlock.png';

function formatAmount(stringValue) {
  const valueParts = stringValue.split('.');
  return `
    <span class="lc-font-size-56 lc-color-like-gray-5">${valueParts[0]}</span>
    <span class="lc-font-size-56 lc-color-like-gray-3">.${valueParts[1]}</span>
  `;
}

export default {
  name: 'metamask-dialog',
  components: {
    BaseDialog,
    LanguageSwitch,
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
      ArrowLeftIcon,
      ArrowRightIcon,
      metamaskNetImg: IS_TESTNET ? metamaskTestNetImg : metamaskNetImg,
      isHardware: false,
    };
  },
  computed: {
    ...mapGetters([
      'getSignPayloadObject',
      'getLikeCoinUsdNumericPrice',
    ]),
    icon() {
      if (this.webThreeType === 'ledger') return ledgerIcon;
      return metamaskIcon;
    },
    isInstallMetamask() {
      return this.case === 'web3';
    },
    isNotSign() {
      return this.case !== 'sign' && this.case !== 'login';
    },
    isMetamask() {
      return this.webThreeType === 'window' || this.webThreeType === 'infura';
    },
    shouldShowReturnButton() {
      return this.case === 'locked' || this.case === 'web3';
    },
    title() {
      if (!this.isMetamask) {
        if (this.$i18n.te(`Dialog.metamask.title.${this.case}${this.webThreeType}`)) {
          return this.$t(`Dialog.metamask.title.${this.case}${this.webThreeType}`);
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
        if (this.$i18n.te(`Dialog.metamask.content.${this.case}${this.webThreeType}`)) {
          return this.$t(`Dialog.metamask.content.${this.case}${this.webThreeType}`);
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
    likeTransferValue() {
      return this.getSignPayloadObject
        ? this.getSignPayloadObject.payload.value.dividedBy(ONE_LIKE)
        : 0;
    },
    usdTransferStrValue() {
      if (this.getLikeCoinUsdNumericPrice && this.likeTransferValue) {
        const usdValue = this.likeTransferValue.times(this.getLikeCoinUsdNumericPrice);
        let decimalPlace = 2;
        if (usdValue.lt(0.01)) decimalPlace = 4;
        return this.likeTransferValue.times(this.getLikeCoinUsdNumericPrice).toFixed(decimalPlace);
      }
      return null;
    },
  },
  mounted() {
    if (this.isInstallMetamask) {
      logTrackerEvent(this, 'RegFlow', 'AppearMetamaskCTA', 'metamask install cta appear', 1);
    }
    if (!this.getLikeCoinUsdNumericPrice) {
      this.queryLikeCoinUsdPrice();
    }
  },
  methods: {
    ...mapActions([
      'hideLoginWindow',
      'queryLikeCoinUsdPrice',
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
    maskWallet(wallet) {
      return wallet.replace(/(0x.{4}).*(.{4})/, '$1...$2');
    },
    getFormattedLikeValue(value) {
      const decimalPlace = value.dp();
      // show 2-4 decimal places
      return formatAmount(value.toFixed(Math.min(4, Math.max(2, decimalPlace))));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/variables';

.md-dialog :global(.lc-section-header:before) {
  background-image: linear-gradient(252deg, #ed8526, #eebe78);
}

.metamask-dialog {
  &__content {
    .md-button {
      width: 100%;
      margin: 6px 0;

      &.primary {
        background-color: #ed8526;
      }
    }
  }

  &__send {
    &-message {
      display: flex;
      align-items: center;
      flex-direction: row;

      .simple-svg-wrapper {
        margin: 0 24px;
      }
    }

    &-currency {
      position: absolute;
      top: 50%;
      right: 40px;

      transform: translateY(-50%);
    }
  }
}

hr {
  border: none;
  border-top: 1px solid #e6e6e6;
}
</style>
