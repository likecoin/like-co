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
      <div
        v-if="isWait"
        class="header-icon activity-indicator-wrapper lc-color-gray-9b"
      >
        <div>
          <ActivityIndicator />
        </div>
      </div>
      <check-icon
        v-else
        class="header-icon"
        state="completed"
        layout="large"
      />
    </template>

    <div class="lc-dialog-container-1 lc-margin-bottom-16">
      <h1
        class="lc-font-size-32 lc-margin-top-0 lc-color-like-gray-5 lc-font-weight-300"
      >
        {{ title }}
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4">
        {{ message }}
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
      v-else-if="!txDialogHideAction && !isWait"
      class="lc-dialog-container-1"
    >
      <div class="lc-button-group">
        <!-- <md-button
          :href="PURCHASE_LIKE_URL"
          class="md-likecoin"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t('Dialog.transaction.button.trade') }}
        </md-button> -->
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
import ActivityIndicator from '~/components/ActivityIndicator';
import BaseDialog from '~/components/dialogs/BaseDialog';
import CheckIcon from '~/components/Mission/StateIcon';

import { PURCHASE_LIKE_URL } from '@/constant';

export default {
  name: 'tx-dialog',
  components: {
    ActivityIndicator,
    BaseDialog,
    CheckIcon,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'default',
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
    txDialogHideAction: {
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
      PURCHASE_LIKE_URL,
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
    isWait() {
      return this.type === 'wait';
    },
    title() {
      return this.$t(`Transaction.header.label.${this.isWait ? 'waiting' : 'pending'}`);
    },
    message() {
      return this.$t(`Dialog.transaction.label.${this.isWait ? 'waiting' : 'pending'}`);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.tx-dialog {
  .header-icon {
    margin-top: 24px;
  }

  .activity-indicator-wrapper {
    z-index: 1;

    padding: 2px;

    border-radius: 50%;

    background-image: linear-gradient(to left, $like-light-blue, $like-gradient-1);

    > div {
      padding: 4px;

      border-radius: inherit;
      background-color: white;
    }

    svg {
      display: block;
    }
  }
}
</style>
