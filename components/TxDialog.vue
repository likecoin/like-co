<template>
  <md-dialog :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar"></div>
    <md-dialog-title>
      <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" />
      Pending Confirmation...
    </md-dialog-title>
    <md-dialog-content>Waiting for the blockchain to confirm. It may take few minutes… meanwhile you can visit other pages on likecoin.store</md-dialog-content>
    <section v-if="isNewUser">
      <md-dialog-content class="new-user">Seem you don’t have a LikeCoin ID. Create now to recive LikeCoin.</md-dialog-content>
      <nuxt-link :to="{ name: 'register' }">
        <md-button class="secondary md-primary md-raised" @click="$emit('onClose')">Create Like Coin ID</md-button>
      </nuxt-link>
    </section>
    <section v-else>
      <a href="https://likecoin.foundation/" target="_blank">
        <md-button class="primary md-primary md-raised">Buy LikeCoin</md-button>
      </a>
      <nuxt-link :to="{ name: 'tx-id', params: { id: txId } }">
        <md-button class="secondary md-primary md-raised" @click="$emit('onClose')">View Transaction</md-button>
      </nuxt-link>
    </section>
  </md-dialog>
</template>

<script>
  export default {
    name: 'txDialog',
    props: ['show', 'txId', 'isNewUser'],
    data() {
      return {
        showDialog: this.show,
      };
    },
    watch: {
      show(show) {
        this.showDialog = show;
      },
    },
  };
</script>

<style scoped>

.md-dialog {
  max-width: 500px;
  min-height: 188px;
  border-radius: 6px;
  overflow: hidden;
}

.title-bar {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 48px;
  background-image: linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec);
}

.md-dialog-title {
  padding-top: 70px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 32px;
}

.md-dialog-content {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 16px;
}

.md-button {
  height: 40px;
  margin-left: 20%;
  margin-right: 20%;
  font-size: 20px;
}

section, a {
  display: flex;
  flex-direction: column;
  flex: 1;
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
