<template>
  <div class="toolbars">
    <popup-dialog v-if="!disableError" :allowClose="false" header="Error" :message="getPopupError"/>
    <popup-dialog :allowClose="true" header="Info" :message="getPopupInfo"/>
    <no-ssr><blocker-dialog :show="getIsPopupBlocking"/></no-ssr>
    <no-ssr><tx-dialog :show="getIsShowingTxPopup" :txId="getPendingTx" :isNewUser="!getUserIsRegistered" @onClose="closedTxDialog"/></no-ssr>
    <loading-toolbar :isLoading="getIsLoading" :isInTransaction="getIsInTransaction"/>
    <tx-toolbar :txHash="getPendingTx" :isInTx="getIsInTransaction" @onClose="closeTxToolbar"/>
    <info-toolbar :message="getErrorMsg" :icon="getErrorIcon" @onClose="closeInfoToolbar"/>
  </div>
</template>
<script>
import InfoToolbar from '~/components/InfoToolbar';
import TxToolbar from '~/components/TxToolbar';
import LoadingToolbar from '~/components/LoadingToolbar';
import PopupDialog from '~/components/PopupDialog';
import BlockerDialog from '~/components/BlockerDialog';
import TxDialog from '~/components/TxDialog';
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
    TxDialog,
  },
  computed: {
    ...mapGetters([
      'getErrorIcon',
      'getErrorMsg',
      'getPopupError',
      'getPopupInfo',
      'getIsLoading',
      'getIsInTransaction',
      'getIsPopupBlocking',
      'getIsShowingTxPopup',
      'getUserIsRegistered',
      'getPendingTx',
    ]),
  },
  methods: {
    ...mapActions([
      'closedTxDialog',
      'closeTxToolbar',
      'closeInfoToolbar',
    ]),
  },
};
</script>
<style scoped>
.toolbars {
  top: 0px;
  width: 100%;
  position: relative;
  z-index: 999;
}
</style>