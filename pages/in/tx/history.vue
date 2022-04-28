<template>
  <div class="tx-history-tab">

    <section class="lc-margin-top-48 lc-mobile">
      <div class="lc-container-0">
        <div class="lc-container-1">

          <transaction-history
            ref="txHistory"
            :user="getUserId"
            :address="getUserERC20WalletAddress"
            :is-fetching.sync="isFetchingTranscationHistory"
            :has-pending-like="getUserHasPendingLike"
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
              <view-bigdipper
                v-if="getUserWalletAddress"
                :address="getUserWalletAddress"
              />
              <view-etherscan
                v-else
                :address="getUserERC20WalletAddress"
              />
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
import ViewBigdipper from '~/components/ViewBigdipper';

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
    if (!store.getters.getUserHasERC20Wallet) {
      redirect('/in');
    }
  },
  components: {
    RefreshButton,
    TransactionHistory,
    ViewEtherscan,
    ViewBigdipper,
  },
  data() {
    return {
      isFetchingTranscationHistory: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
      'getUserIsRegistered',
      'getUserHasPendingLike',
      'getUserERC20WalletAddress',
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
