<template>
  <div class="tx-history-tab">

    <section class="lc-margin-top-48 lc-mobile">
      <div class="lc-container-0">
        <div class="lc-container-1">

          <transaction-history
            ref="txHistory"
            :address="getUserInfo.wallet"
            :is-fetching.sync="isFetchingTranscationHistory"
            class="lc-margin-top-48 lc-mobile"
          />

          <div class="lc-container-2 lc-margin-top-24">
            <div class="lc-container-3 lc-flex lc-justify-content-center">
              <refresh-button
                :is-refreshing="isFetchingTranscationHistory"
                :is-outline="true"
                @click="updateInfo"
              />
            </div>
            <div class="lc-container-3">
              <view-etherscan :address="getUserInfo.wallet" />
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import RefreshButton from '@/components/RefreshButton';
import TransactionHistory from '@/components/TransactionHistory';
import ViewEtherscan from '~/components/ViewEtherscan';

export default {
  name: 'tx-history-tab',
  layout: 'in',
  head() {
    return {
      title: this.$t('TransactionHistory.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('TransactionHistory.title'),
        },
      ],
    };
  },
  asyncData({ store, redirect }) {
    const user = store.getters.getUserInfo;
    if (!user.wallet || !user.isEmailVerified) {
      redirect('/in');
    }
  },
  components: {
    RefreshButton,
    TransactionHistory,
    ViewEtherscan,
  },
  data() {
    return {
      isFetchingTranscationHistory: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    updateInfo() {
      if (this.$refs.txHistory) this.$refs.txHistory.updateTokenSaleHistory();
    },
  },
};
</script>
