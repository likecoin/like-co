<script>
import { IS_TESTNET } from '@/constant';

export default {
  fetch({ redirect, query }) {
    const queryString = Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
    redirect(302, `https://${IS_TESTNET ? 'rinkeby.' : ''}liker.land/civic?${queryString}`);
  },
};
</script>
