<template>
  <div class="lc-container-0">
    <div class="lc-container-1">
      <div class="lc-container-2">
        <div class="lc-container-3">
          <lc-loading-indicator />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { IS_TESTNET } from '@/constant';

export default {
  layout: 'blank',
  mounted() {
    const { query } = this.$route;
    const queryString = Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
    window.location.replace(`https://${IS_TESTNET ? 'rinkeby.' : ''}liker.land/civic?${queryString}`);
  },
};
</script>
