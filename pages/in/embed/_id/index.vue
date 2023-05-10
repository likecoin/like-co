<template>
  <div>Redirecting...</div>
</template>
<script>
import { IS_TESTNET } from '~/constant';

export default {
  fetch({ redirect, params, query }) {
    redirect(301, `https://button.${IS_TESTNET ? 'rinkeby.' : ''}like.co/in/embed/${params.id}/button?${Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&')}`);
  },
};
</script>
