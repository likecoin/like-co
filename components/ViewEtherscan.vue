<template>
  <div
    id="view-etherscan"
    class="lc-padding-vertical-32"
  >
    <a
      :href="getUrl"
      class="view-url lc-font-weight-300 lc-font-size-16 lc-color-like-green"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ text || $t('Toolbar.etherscan.button.view') }}
    </a>
  </div>
</template>

<script>
import { ETHERSCAN_HOST } from '@/constant';

export default {
  name: 'view-etherscan',
  props: {
    text: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    transaction: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      etherscanUrl: ETHERSCAN_HOST,
    };
  },
  computed: {
    getUrl() {
      if (this.address) return `${this.etherscanUrl}/address/${this.address}/#tokentxns`;
      if (this.transaction) return `${this.etherscanUrl}/tx/${this.transaction}`;
      return this.etherscanUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

#view-etherscan {
  position: relative;

  text-align: center;

  .view-url {
    text-decoration: underline;
  }
}
</style>
