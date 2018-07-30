<template>
  <base-dialog
    :is-show="show"
    :md-props="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: false,
    }"
    class="tx-dialog"
  >

    <template slot="header-center">
      <check-icon
        class="check-icon"
        state="completed"
        layout="large"
      />
    </template>

    <div class="lc-dialog-container-1 lc-margin-bottom-16">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('Transaction.header.label.pending') }}
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4">
        {{ $t('Dialog.transaction.label.waiting') }}
      </p>
    </div>

    <div
      v-if="isNewUser"
      class="lc-dialog-container-1"
    >
      <p class="lc-color-like-green lc-font-weight-600 lc-margin-bottom-16">
        {{ $t('Dialog.transaction.label.newUser') }}
      </p>
      <div class="lc-button-group">
        <nuxt-link :to="{ name: 'in-register', query: $route.query }">
          <md-button
            class="md-likecoin"
            @click="$emit('onClose')"
          >
            {{ $t('Dialog.transaction.button.createID') }}
          </md-button>
        </nuxt-link>
      </div>
    </div>

    <div
      v-else
      class="lc-dialog-container-1"
    >
      <div class="lc-button-group">
        <md-button
          :href="QRYPTOS_LIKEETH_URL"
          class="md-likecoin"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('Dialog.transaction.button.trade') }}
        </md-button>
        <nuxt-link :to="actionRoute">
          <md-button
            class="md-likecoin lc-secondary"
            @click="$emit('onClose')"
          >
            {{ actionText }}
          </md-button>
        </nuxt-link>
      </div>
    </div>

  </base-dialog>
</template>


<script>
import BaseDialog from '~/components/dialogs/BaseDialog';
import CheckIcon from '~/components/Mission/StateIcon';

import { QRYPTOS_LIKEETH_URL } from '@/constant';

export default {
  name: 'tx-dialog',
  components: {
    BaseDialog,
    CheckIcon,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    txId: {
      type: String,
      default: '',
    },
    txInfo: {
      type: Object,
      default: () => ({}),
    },
    isNewUser: {
      type: Boolean,
      default: false,
    },
    txDialogActionRoute: {
      type: Object,
      default: () => ({}),
    },
    txDialogActionText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      QRYPTOS_LIKEETH_URL,
    };
  },
  computed: {
    defaultActionRoute() {
      return { name: 'in-tx-id', params: { id: this.txId, tx: this.txInfo } };
    },
    actionRoute() {
      return this.txDialogActionRoute || this.defaultActionRoute;
    },
    actionText() {
      return this.txDialogActionText || this.$t('Transaction.label.viewTx');
    },
  },
};
</script>


<style lang="scss" scoped>
.tx-dialog {
  .check-icon {
    margin-top: 24px;
  }
}
</style>
