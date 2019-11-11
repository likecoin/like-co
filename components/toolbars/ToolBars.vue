<template>
  <div>
    <no-ssr>
      <div class="toolbars">

        <auth-dialog />
        <re-auth-dialog v-if="getIsShowReAuthDialog" />

        <wallet-notice-dialog
          :is-show="getIsShowWalletNoticeDialog"
          :cancel-title="getWalletNoticeDialogCancelTitle"
          @update:is-show="setWalletNoticeDialog({ isShow: $event })"
          @cancel="getWalletNoticeDialogCancelCallback()"
          @confirm="getWalletNoticeDialogConfirmCallback()"
        />

        <popup-dialog
          v-for="d in getPopupDialogs"
          :key="d.uuid"
          :is-show="d.isShow"
          :allow-close="d.allowClose"
          :header="d.header"
          :message="d.message"
          :cancel-text="d.cancelText"
          :confirm-text="d.confirmText"
          @closed="closePopupDialog(d.uuid)"
          @cancel="d.onCancel"
          @confirm="d.onConfirm"
        />

        <div v-if="checkShouldShowError(getMetamaskError)">
          <div v-if="checkIsMobileClient()">
            <trust-dialog
              v-if="!!getMetamaskError"
              :case="getMetamaskError"
              :webThreeType="getWeb3Type"
            />
          </div>
          <div v-else>
            <chrome-dialog
              v-if="shouldShowChromeDialog"
              :show="shouldShowChromeDialog"
            />
            <metamask-dialog
              v-else-if="!!getMetamaskError"
              :case="getMetamaskError"
              :webThreeType="getWeb3Type"
            />
          </div>
        </div>

        <blocker-dialog :show="getIsPopupBlocking" />

        <tx-dialog
          :show="getIsShowingTxPopup"
          :txId="getPendingTx"
          :txInfo="getPendingTxInfo"
          :isNewUser="!getUserIsRegistered"
          :txDialogActionRoute="getTxDialogActionRoute"
          :txDialogActionText="getTxDialogActionText"
          @onClose="closeTxDialog"
        />

        <loading-toolbar
          :isLoading="getIsLoading"
          :isInTransaction="getIsInTransaction"
        />

        <tx-toolbar
          v-if="getPendingTx"
          :txHash="getPendingTx"
          :txInfo="getPendingTxInfo"
          :isInTx="getIsInTransaction"
          @onClose="closeTxToolbar"
        />

        <info-toolbar
          v-if="getInfoMsg"
          :isError="getInfoIsError"
          @onClose="closeInfoToolbar"
        >
          <span v-if="getInfoIsError">
            {{ $i18n.te(`Error.${getInfoMsg}`) ? $t(`Error.${getInfoMsg}`) : getInfoMsg }}
          </span>
          <span
            v-else
            v-html="getInfoMsg"
          />
          <nuxt-link
            v-if="getInfoMsg === $t('Transaction.error.likecoinInsufficient')"
            :to="{ name: 'in-redeem' }"
          >
            {{ $t('Edit.label.redeemCoin') }}
          </nuxt-link>
        </info-toolbar>

        <md-snackbar
          v-if="getInfoMsg"
          :md-active="!!getInfoMsg"
          md-position="center"
          md-persistent
        >
          <span v-if="getInfoIsError">
            {{ $i18n.te(`Error.${getInfoMsg}`) ? $t(`Error.${getInfoMsg}`) : getInfoMsg }}
          </span>
          <span
            v-else
            v-html="getInfoMsg"
          />
          <nuxt-link
            v-if="getInfoMsg === $t('Transaction.error.likecoinInsufficient')"
            :to="{ name: 'in-redeem' }"
          >
            {{ $t('Edit.label.redeemCoin') }}
          </nuxt-link>
          <md-button
            class="md-icon-button"
            @click="closeInfoToolbar"
          >
            <md-icon>close</md-icon>
          </md-button>
        </md-snackbar>

      </div>
    </no-ssr>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import {
  checkIsMobileClient,
  checkIsDesktopChrome,
} from '@/util/client';

import BlockerDialog from '~/components/dialogs/BlockerDialog';
import ChromeDialog from '~/components/dialogs/ChromeDialog';
import MetamaskDialog from '~/components/dialogs/MetamaskDialog';
import AuthDialog from '~/components/dialogs/AuthDialog';
import ReAuthDialog from '~/components/dialogs/ReAuthDialog';
import WalletNoticeDialog from '~/components/dialogs/WalletNoticeDialog';
import PopupDialog from '~/components/dialogs/PopupDialog';
import TrustDialog from '~/components/dialogs/TrustDialog';
import TxDialog from '~/components/dialogs/TxDialog';

import InfoToolbar from '~/components/toolbars/InfoToolbar';
import LoadingToolbar from '~/components/toolbars/LoadingToolbar';
import TxToolbar from '~/components/toolbars/TxToolbar';

export default {
  name: 'tool-bars',
  components: {
    BlockerDialog,
    ChromeDialog,
    MetamaskDialog,
    AuthDialog,
    ReAuthDialog,
    WalletNoticeDialog,
    PopupDialog,
    TrustDialog,
    TxDialog,

    InfoToolbar,
    LoadingToolbar,
    TxToolbar,
  },
  props: {
    disableError: {
      type: [Boolean, Array],
      default: false,
    },
  },
  computed: {
    shouldShowChromeDialog() {
      return this.getMetamaskError === 'web3' && !checkIsDesktopChrome();
    },
    ...mapGetters([
      'getInfoIsError',
      'getInfoMsg',
      'getIsErrorDisabled',
      'getIsLoginOverride',
      'getPopupError',
      'getPopupInfo',
      'getPopupDialogs',
      'getIsLoading',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getIsShowingTxPopup',
      'getIsShowReAuthDialog',
      'getUserIsRegistered',
      'getPendingTx',
      'getMetamaskError',
      'getWeb3Type',
      'getTxDialogActionRoute',
      'getTxDialogActionText',
      'getPendingTxInfo',
      'getIsShowWalletNoticeDialog',
      'getWalletNoticeDialogCancelTitle',
      'getWalletNoticeDialogCancelCallback',
      'getWalletNoticeDialogConfirmCallback',
    ]),
  },
  watch: {
    getPopupError(msg) {
      if (msg && this.checkShouldShowError(msg)) {
        this.openPopupDialog({
          header: this.$t('General.label.error'),
          message: msg,
          confirmText: this.$t('General.button.confirm'),
        });
      }
    },
    getPopupInfo(msg) {
      if (msg) {
        this.openPopupDialog({
          allowClose: true,
          header: this.$t('General.label.info'),
          message: msg,
          confirmText: this.$t('General.button.confirm'),
        });
      }
    },
  },
  methods: {
    ...mapActions([
      'closeTxDialog',
      'closeTxToolbar',
      'closeInfoToolbar',
      'openPopupDialog',
      'closePopupDialog',
      'setWalletNoticeDialog',
    ]),
    checkIsMobileClient,
    checkShouldShowError(err) {
      if (this.getIsErrorDisabled) return false;
      if (this.getIsLoginOverride) return true;
      if (this.disableError === true) return false;
      if (this.disableError === err) return false;
      if (Array.isArray(this.disableError)) return !this.disableError.includes(err);
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~assets/variables";

.toolbars {
  position: relative;
  z-index: 999;
  top: 0px;

  width: 100%;
}

.md-toolbar {
  min-height: 40px;
  padding: 0 24px;

  border-bottom: 1px solid $like-gray-1;

  font-size: 20px;

  @media (max-width: 600px) {
    padding: 8px 12px;

    font-size: 18px;
  }

  button.md-button {
    width: 20px;
    min-width: 20px;
    height: 20px;
  }
}

.md-snackbar {
  background-color: $like-green;

  /deep/ .md-icon {
    color: $like-white;
  }
}
</style>
