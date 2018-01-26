<template>
  <div id="view-etherscan">
    <a
     class="view-url"
     :href="getUrl"
     target="_blank"
     rel="noopener noreferrer"
    >
      {{ text || defaultText }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'view-etherscan',
  props: ['text', 'address', 'transaction'],
  data() {
    return {
      defaultText: 'View on Etherscan',
      etherscanUrl: 'https://rinkeby.etherscan.io',
    };
  },
  computed: {
    getUrl() {
      if (this.address) return `${this.etherscanUrl}/address/${this.address}`;
      if (this.transaction) return `${this.etherscanUrl}/transaction/${this.transaction}`;
      return this.etherscanUrl;
    },
  },
};
</script>

<style lang="scss" scoped>
#view-etherscan {
  padding: 32px;
  text-align: center;
  .view-url {
    color: #28646e;
  }
}
</style>
