<template>
  <base-dialog
    :is-show="show"
    :md-props="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: false,
    }"
    class="tx-dialog">

    <div class="lc-dialog-container-1 lc-margin-bottom-16">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('Transaction.header.label.pending')}}...
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4">
        {{ $t('Dialog.transaction.label.waiting') }}
      </p>
    </div>

    <div v-if="isNewUser" class="lc-dialog-container-1">
      <p class="lc-color-like-green lc-font-weight-600 lc-margin-bottom-16">
        {{ $t('Dialog.transaction.label.newUser') }}
      </p>
      <div class="lc-button-group">
        <nuxt-link :to="{ name: 'in-register', query: $route.query }">
          <md-button class="md-likecoin" @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.createID') }}
          </md-button>
        </nuxt-link>
      </div>
    </div>

    <div v-else class="lc-dialog-container-1">
      <div class="lc-button-group">
        <nuxt-link 
          v-if="!isICOEnded && $route.name !== 'in-tokensale'"
          :to="{ name: 'in-tokensale' }">
          <md-button class="md-likecoin" @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.buyCoin') }}
          </md-button>
        </nuxt-link>
        <nuxt-link v-else :to="{ name: 'in' }">
          <md-button class="md-likecoin" @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.myAccount') }}
          </md-button>
        </nuxt-link>
        <nuxt-link :to="actionRoute">
          <md-button class="md-likecoin lc-secondary" @click="$emit('onClose')">
            {{ actionText }}
          </md-button>
        </nuxt-link>
      </div>
    </div>

  </base-dialog>
</template>


<script>
import postICOMixin from '@/util/mixin/postICO';

import BaseDialog from '~/components/dialogs/BaseDialog';

export default {
  name: 'txDialog',
  props: ['show', 'txId', 'txInfo', 'isNewUser', 'txDialogActionRoute', 'txDialogActionText'],
  components: {
    BaseDialog,
  },
  mixins: [postICOMixin],
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
@import "~assets/mixin";

.tx-dialog {
  :global(.lc-dialog-header::before) {
    @include background-image-sliding-animation-x(linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec, #90c2ed));
  }
}
</style>
