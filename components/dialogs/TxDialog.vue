<template>
  <md-dialog
    class="tx-dialog"
    :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">

    <div class="title-bar" />

    <div class="dialog-content">
      <md-dialog-title>
        <md-progress-spinner :md-diameter="28" :md-stroke="2" md-mode="indeterminate" />
        {{ $t('Transaction.header.label.pending')}}...
      </md-dialog-title>

      <md-dialog-content>
        {{ $t('Dialog.transaction.label.waiting') }}
      </md-dialog-content>

      <section v-if="isNewUser">
        <md-dialog-content class="new-user lc-font-weight-600">
          {{ $t('Dialog.transaction.label.newUser') }}
        </md-dialog-content>
        <nuxt-link :to="{ name: 'in-register' }">
          <material-button @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.createID') }}
          </material-button>
        </nuxt-link>
      </section>

      <section v-else>
        <nuxt-link v-if="$route.name !== 'in-tokensale'" :to="{ name: 'in-tokensale' }">
          <material-button class="primary" @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.buyCoin') }}
          </material-button>
        </nuxt-link>
        <nuxt-link v-else :to="{ name: 'in' }">
          <material-button class="primary" @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.myAccount') }}
          </material-button>
        </nuxt-link>
        <nuxt-link :to="actionRoute">
          <material-button @click="$emit('onClose')">
            {{ actionText }}
          </material-button>
        </nuxt-link>
      </section>
    </div>

  </md-dialog>
</template>


<script>
import MaterialButton from '@/components/MaterialButton';

export default {
  name: 'txDialog',
  props: ['show', 'txId', 'txInfo', 'isNewUser', 'txDialogActionRoute', 'txDialogActionText'],
  components: {
    MaterialButton,
  },
  data() {
    return {
      showDialog: this.show,
      defaultActionText: this.$t('Transaction.label.viewTx'),
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
      return this.txDialogActionText || this.defaultActionText;
    },
  },
  watch: {
    show(show) {
      this.showDialog = show;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/dialog";

.tx-dialog {
  .title-bar {
    background-image: linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec);
  }

  .primary {
    background: linear-gradient(73deg, #3c286e, #6e2828);
  }

  .new-user {
    color: #26646f;
  }
}


</style>
