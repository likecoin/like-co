<template>
  <div>
    <no-ssr>
      <div class="toolbars">

        <AuthDialogV2
          v-if="!isAuthDialogDisabled"
          :is-overlay="true"
        />
        <re-auth-dialog v-if="getIsShowReAuthDialog" />
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

        <blocker-dialog :show="getIsPopupBlocking" />

        <tx-dialog
          :show="getIsShowingTxPopup"
          :type="getTxDialogType"
          :txId="getPendingTx"
          :txInfo="getPendingTxInfo"
          :isNewUser="!getUserIsRegistered"
          :txDialogHideAction="getTxDialogHideAction"
          :txDialogActionRoute="getTxDialogActionRoute"
          :txDialogActionText="getTxDialogActionText"
          @onClose="closeTxDialog"
        />

        <loading-toolbar
          :isLoading="getIsLoading"
          :isInTransaction="getIsInTransaction"
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
          <md-button
            class="md-icon-button"
            @click="closeInfoToolbar"
          >
            <md-icon>close</md-icon>
          </md-button>
        </md-snackbar>

        <popup-dialog
          :is-show="isChainUpgrading"
          :allow-close="true"
          :message="$t('ChainUpgradingAlertMessage')"
        />

      </div>
    </no-ssr>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import {
  checkIsMobileClient,
} from '@/util/client';

import { IS_CHAIN_UPGRADING } from '~/constant';

import BlockerDialog from '~/components/dialogs/BlockerDialog';
import ReAuthDialog from '~/components/dialogs/ReAuthDialog';
import PopupDialog from '~/components/dialogs/PopupDialog';
import TxDialog from '~/components/dialogs/TxDialog';

import InfoToolbar from '~/components/toolbars/InfoToolbar';
import LoadingToolbar from '~/components/toolbars/LoadingToolbar';
import AuthDialogV2 from '~/components/v2/dialogs/AuthDialogV2';

export default {
  name: 'tool-bars',
  components: {
    BlockerDialog,
    AuthDialogV2,
    ReAuthDialog,
    PopupDialog,
    TxDialog,

    InfoToolbar,
    LoadingToolbar,
  },
  props: {
    disableError: {
      type: [Boolean, Array],
      default: false,
    },
    isAuthDialogDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isChainUpgrading() {
      return IS_CHAIN_UPGRADING;
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
      'getTxDialogType',
      'getTxDialogActionRoute',
      'getTxDialogActionText',
      'getTxDialogHideAction',
      'getPendingTxInfo',
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
      'closeInfoToolbar',
      'openPopupDialog',
      'closePopupDialog',
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
