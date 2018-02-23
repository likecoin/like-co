<template>
  <div class="toolbars">
    <popup-dialog v-if="!disableError" :allowClose="false" header="Error" :message="getPopupError" />
    <popup-dialog :allowClose="true" header="Info" :message="getPopupInfo"/>
    <no-ssr v-if="!(disableError && getMetamaskError !== 'testnet')">
      <chrome-dialog v-if="showShowChromeDialog" :show="showShowChromeDialog"/>
      <metamask-dialog v-else-if="!!getMetamaskError" :case="getMetamaskError"/>
    </no-ssr>
    <no-ssr><blocker-dialog :show="getIsPopupBlocking"/></no-ssr>
    <no-ssr>
      <tx-dialog
        :show="getIsShowingTxPopup"
        :txId="getPendingTx"
        :txInfo="getPendingTxInfo"
        :isNewUser="!getUserIsRegistered"
        :txDialogActionRoute="getTxDialogActionRoute"
        :txDialogActionText="getTxDialogActionText"
        @onClose="closeTxDialog" />
    </no-ssr>
    <loading-toolbar :isLoading="getIsLoading" :isInTransaction="getIsInTransaction"/>
    <tx-toolbar
      v-if="getPendingTx"
      :txHash="getPendingTx"
      :txInfo="getPendingTxInfo"
      :isInTx="getIsInTransaction"
      @onClose="closeTxToolbar" />
    <info-toolbar
      v-if="getInfoMsg"
      :isError="getInfoIsError"
      @onClose="closeInfoToolbar">
      <span v-if="getInfoIsError">{{ getInfoMsg }}</span>
      <span v-else v-html="getInfoMsg" />
      <nuxt-link
        :to="{ name: 'redeem' }"
        v-if="getInfoMsg === $t('Transaction.error.likecoinInsufficient')">
        {{ $t('Edit.label.redeemCoin') }}
      </nuxt-link>
    </info-toolbar>
  </div>
</template>
<script>
import InfoToolbar from '~/components/toolbars/InfoToolbar';
import TxToolbar from '~/components/toolbars/TxToolbar';
import LoadingToolbar from '~/components/toolbars/LoadingToolbar';
import PopupDialog from '~/components/dialogs/PopupDialog';
import BlockerDialog from '~/components/dialogs/BlockerDialog';
import MetamaskDialog from '~/components/dialogs/MetamaskDialog';
import ChromeDialog from '~/components/dialogs/ChromeDialog';
import TxDialog from '~/components/dialogs/TxDialog';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ToolBars',
  props: ['disableError'],
  components: {
    LoadingToolbar,
    InfoToolbar,
    TxToolbar,
    PopupDialog,
    BlockerDialog,
    MetamaskDialog,
    ChromeDialog,
    TxDialog,
  },
  computed: {
    showShowChromeDialog() {
      return this.getMetamaskError === 'web3' && !this.checkIsDesktopChrome();
    },
    ...mapGetters([
      'getInfoIsError',
      'getInfoMsg',
      'getPopupError',
      'getPopupInfo',
      'getIsLoading',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getIsShowingTxPopup',
      'getUserIsRegistered',
      'getPendingTx',
      'getMetamaskError',
      'getTxDialogActionRoute',
      'getTxDialogActionText',
      'getPendingTxInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'closeTxDialog',
      'closeTxToolbar',
      'closeInfoToolbar',
    ]),
    checkIsDesktopChrome() {
      const ua = window.navigator.userAgent;
      const uv = window.navigator.vendor;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
        return false;
      }
      return (/Chrome/i.test(ua) && /Google/i.test(uv));
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~assets/index";

.toolbars {
  position: relative;
  z-index: 999;
  top: 0px;

  width: 100%;
}

.md-toolbar {
  height: 40px;
  min-height: unset;
  padding: 0 24px;

  font-size: 20px;

  border-bottom: 1px solid $like-gray-1;

  button.md-button {
    width: 20px;
    min-width: 20px;
    height: 20px;
  }
}
</style>
