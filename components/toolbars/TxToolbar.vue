<template>
  <md-toolbar
    v-if="txHash"
    :class="styleClass"
    md-elevation="0"
  >
    <div class="md-layout-item">
      <section v-if="isInTx">
        <md-progress-spinner
          :md-diameter="24"
          :md-stroke="2"
          md-mode="indeterminate"
        />
      </section>
      <img
        v-else
        :src="TickIcon"
        class="status-icon"
      >
      {{
        isInTx ? `${$t('Transaction.header.label.pending')}...`
        : `${$t('Transaction.header.label.completed')}!`
      }}
    </div>
    <div class="btn-container">
      <nuxt-link :to="{ name: 'in-tx-id', params: { id: txHash, tx: txInfo } }">
        <md-button>{{ $t('Transaction.label.viewTx') }}</md-button>
      </nuxt-link>
      <md-button
        v-if="!isInTx"
        class="md-icon-button"
        @click="$emit('onClose')"
      >
        <md-icon>close</md-icon>
      </md-button>
    </div>
  </md-toolbar>
</template>

<script>
import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'tx-toolbar',
  props: {
    txHash: {
      type: String,
      default: '',
    },
    txInfo: {
      type: Object,
      default: () => ({}),
    },
    isInTx: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      TickIcon,
    };
  },
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
@import "~assets/variables";

.md-toolbar {
  > .md-layout-item {
    display: flex;
    align-items: center;
    flex-direction: row;

    .status-icon {
      width: 24px;
      height: 24px;

      margin-right: 8px;
    }
  }

  > .btn-container {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .md-progress-spinner {
    margin-right: 12px;
  }

  a .md-button {
    height: 24px;

    text-decoration: underline;

    color: $like-green;
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
