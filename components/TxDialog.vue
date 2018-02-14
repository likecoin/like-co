<template>
  <md-dialog :md-active.sync="showDialog"
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
        <md-dialog-content class="new-user">
          {{ $t('Dialog.transaction.label.newUser') }}
        </md-dialog-content>
        <nuxt-link :to="{ name: 'register' }">
          <md-button class="secondary md-primary md-raised" @click="$emit('onClose')">
            {{ $t('Dialog.transaction.button.createID') }}
          </md-button>
        </nuxt-link>
      </section>
      <section v-else>
        <a href="https://likecoin.foundation/" target="_blank">
          <md-button class="primary md-primary md-raised">
            {{ $t('Dialog.transaction.button.buyCoin') }}
          </md-button>
        </a>
        <nuxt-link :to="actionRoute">
          <md-button class="secondary md-primary md-raised" @click="$emit('onClose')">
            {{ actionText }}
          </md-button>
        </nuxt-link>
      </section>
    </div>
  </md-dialog>
</template>

<script>
  export default {
    name: 'txDialog',
    props: ['show', 'txId', 'txInfo', 'isNewUser', 'txDialogActionRoute', 'txDialogActionText'],
    data() {
      return {
        showDialog: this.show,
        defaultActionText: this.$t('Transaction.label.viewTx'),
      };
    },
    computed: {
      defaultActionRoute() {
        return { name: 'tx-id', params: { id: this.txId, tx: this.txInfo } };
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
@import "../assets/dialog";

.title-bar {
  background-image: linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec);
}

.primary {
  background: linear-gradient(73deg, #3c286e, #6e2828);
}

.new-user {
  color: #26646f;
  font-weight: 600;
}

.md-button.secondary {
  background-color: #28646e !important;
}

</style>
