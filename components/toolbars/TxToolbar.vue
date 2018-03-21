<template>
  <md-toolbar :class="styleClass" v-if="txHash" >
  	<section v-if="isInTx">
      <md-progress-spinner :md-diameter="24" :md-stroke="2" md-mode="indeterminate" />
    </section>
    <md-icon v-else>check</md-icon>
    <div class="md-layout-item">
      {{ isInTx ? `${$t('Transaction.header.label.pending')}...` : `${$t('Transaction.header.label.completed')}!` }}
    </div>
    <nuxt-link :to="{ name: 'in-tx-id', params: { id: txHash, tx: txInfo } }">
      <md-button>{{ $t('Transaction.label.viewTx') }}</md-button>
	</nuxt-link>
    <md-button v-if="!isInTx" class="md-icon-button" @click="$emit('onClose')">
      <md-icon>close</md-icon>
    </md-button>
  </md-toolbar>
</template>

<script>
  export default {
    name: 'TxToolbar',
    props: ['txHash', 'txInfo', 'isInTx'],
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

<style lang="scss" scoped>
@import "~assets/index";

.md-toolbar {
  .md-progress-spinner {
    margin-right: 12px;
  }

  a .md-button {
    color: $like-green;
    text-decoration: underline;
  }

  > .md-icon {
    margin-right: 12px;
  }
}

.md-toolbar.pending {
  color: $like-white;
  background-image: linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec);
}

.md-toolbar.complete {
  background-image: linear-gradient(263deg, $like-light-blue, $like-gradient-1);
}

</style>
