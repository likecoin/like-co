<template>
  <div class="civic-redirect-page">
    <Spinner :size="56" />
  </div>
</template>
<script>
import Spinner from '~/components/Spinner';

import { IS_TESTNET } from '@/constant';

export default {
  layout: 'blank',
  components: {
    Spinner,
  },
  mounted() {
    const { query } = this.$route;
    const queryString = Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
    window.location.replace(`https://${IS_TESTNET ? 'rinkeby.' : ''}liker.land/civic?${queryString}`);
  },
};
</script>

<style lang="scss" scoped>
.civic-redirect-page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
