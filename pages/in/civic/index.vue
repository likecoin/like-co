<template>
  <div>{{$t('General.loading')}}</div>
</template>
<script>
import { IS_TESTNET } from '@/constant';

export default {
  mounted() {
    const { query } = this.$route;
    const queryString = Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
    window.location.replace(`https://${IS_TESTNET ? 'rinkeby.' : ''}liker.land/civic?${queryString}`);
  },
};
</script>
