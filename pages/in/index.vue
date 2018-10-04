<template>
  <div class="overview-page">

    <div
      id="earn"
      class="bonus-container lc-container-0 lc-margin-top-48"
    >
      <section class="lc-container-1">
        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>
          <div class="lc-container-2">
            <div class="lc-container-3">
              <div class="lc-container-4">
                <div class="lc-container-header-title">
                  <h1 class="lc-font-size-32 lc-mobile">
                    {{ $t('BonusPage.title') }}
                  </h1>
                  <div
                    v-if="getIsFetchedMissions"
                    class="lc-container-header-button-wrapper lc-mobile-hide"
                  >
                    <refresh-button
                      :is-refreshing="getIsFetchingMissions"
                      @click="refreshMissions"
                    />
                  </div>
                </div>
                <md-button
                  class="md-likecoin lc-container-header-button lc-font-size-20"
                  @click="$router.push({ name: 'in-bonus' })"
                >
                  {{ $t('BonusPage.button.moreBonus') }}
                </md-button>
              </div>
            </div>
          </div>
        </div>

        <div class="lc-container-2">

          <div class="lc-padding-top-32 lc-bg-gray-1">
            <mission-list
              :missions="getShortMissionList"
              :is-grid="false"
              :is-loading="getIsFetchingMissions || !getIsFetchedMissions"
              @click="onMissionClick"
            />
          </div>

          <div class="lc-container-3 lc-padding-top-24 lc-bg-gray-1">
            <div class="lc-container-4">
              <div class="section-btn-container bonus-button-container lc-padding-bottom-32">
                <md-button
                  class="section-button md-likecoin"
                  @click="$router.push({ name: 'in-bonus' })"
                >
                  {{ $t('BonusPage.button.moreBonus') }}
                </md-button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>

    <transaction-history
      v-if="wallet"
      id="transaction"
      ref="txHistory"
      :address="wallet"
      :is-fetching.sync="isFetchingTranscationHistory"
      class="lc-margin-top-48 lc-mobile"
    />

    <div class="lc-container-0 lc-margin-top-24 lc-mobile-show">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-flex lc-justify-content-center">
            <refresh-button
              :is-refreshing="getIsFetchingMissions || isFetchingTranscationHistory"
              :is-outline="true"
              @click="updateInfo"
            />
          </div>
        </div>
      </div>
    </div>

    <view-etherscan :address="wallet" />

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import LikeCoinAmount from '~/components/LikeCoinAmount';
import MaterialButton from '~/components/MaterialButton';
import MissionList from '@/components/Mission/List';
import TransactionHistory from '~/components/TransactionHistory';
import RefreshButton from '~/components/RefreshButton';
import ViewEtherscan from '~/components/ViewEtherscan';

import EditIcon from '@/assets/icons/edit.svg';
import EditWhiteIcon from '@/assets/icons/edit-white.svg';
import TickIcon from '@/assets/tokensale/tick.svg';


export default {
  name: 'in',
  layout: 'in',
  components: {
    LikeCoinAmount,
    MaterialButton,
    MissionList,
    TransactionHistory,
    RefreshButton,
    ViewEtherscan,
  },
  data() {
    return {
      wallet: '',
      EditIcon,
      EditWhiteIcon,
      TickIcon,
      freeCoupon: '',
      isFetchingTranscationHistory: false,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsPopupBlocking',
      'getCurrentLocale',
      'getIsFetchingMissions',
      'getIsFetchedMissions',
      'getUserNeedAuth',
      'getUserIsRegistered',
      'getShortMissionList',
    ]),
  },
  head() {
    return {
      meta: [
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ],
    };
  },
  mounted() {
    const { hash } = document.location;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView();
    }
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    ...mapActions([
      'setInfoMsg',
      'checkCoupon',
      'sendVerifyEmail',
      'sendCouponCodeEmail',
      'refreshUserInfo',
      'fetchUserReferralStats',
      'refreshMissionList',
      'onMissionClick',
    ]),
    refreshMissions() {
      this.refreshMissionList(this.getUserInfo.user);
    },
    updateInfo() {
      const user = this.getUserInfo;
      this.wallet = user.wallet;
      if (this.$refs.txHistory) this.$refs.txHistory.updateTokenSaleHistory();
      this.refreshMissions();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.section-redeem-edit-mode {
  opacity: .3;
}

.section-btn-container {
  text-align: center;

  @media (min-width: 768 + 1px) {
    text-align: right;

    .bonus-container & {
      text-align: center;
    }

    .section-button {
      width: calc(33.33% - 16px);
    }
  }

}

.bonus-container {
  .bonus-button-container {
    @media (min-width: 960 + 1px) {
      display: none;
    }
  }
}
</style>
