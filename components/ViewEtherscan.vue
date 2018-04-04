<template>
  <div id="view-etherscan" class="lc-padding-vertical-32">
    <a
     class="view-url lc-font-weight-300 lc-font-size-16 lc-color-like-green"
     :href="getUrl"
     target="_blank"
     rel="noopener noreferrer"
    >
      {{ text || defaultText }}
    </a>
  </div>
</template>

<script>
import { ETHERSCAN_HOST } from '@/constant';

export default {
  name: 'view-etherscan',
  props: ['text', 'address', 'transaction'],
  data() {
    return {
      defaultText: this.$t('Toolbar.etherscan.button.view'),
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
  text-align: center;

  .view-url {
    text-decoration: underline;
  }
}
</style>
