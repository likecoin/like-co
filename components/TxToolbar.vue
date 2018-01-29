<template>
  <md-toolbar :class="styleClass" v-if="txHash" >
  	<section v-if="isInTx">
      <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" />
    </section>
    <md-icon v-else>check</md-icon>
    <div class="md-layout-item">
      {{ isInTx ? 'Pending confirmation...' : 'Transaction Complete!' }}
    </div>
    <nuxt-link :to="{ name: 'tx-id', params: { id: txHash } }">
      <md-button class="md-primary">View Transaction</md-button>
	</nuxt-link>
    <md-button v-if="!isInTx" class="md-icon-button" @click="$emit('onClose')"><md-icon>close</md-icon></md-button>
  </md-toolbar>
</template>

<script>
  export default {
    name: 'TxToolbar',
    props: ['txHash', 'isInTx'],
    computed: {
      styleClass() {
        const cls = ['md-layout'];
        if (this.isInTx) cls.push('pending');
        else cls.push('complete');
        return cls;
      },
    },
  };
</script>

<style scoped>

.md-toolbar {
  font-size: 20px;
}

.md-toolbar.pending {
  color: #ffffff;
  background-image: linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec);
}

.md-toolbar.complete {
  background-image: linear-gradient(263deg, #d2f0f0, #f0e6b4);
}

</style>