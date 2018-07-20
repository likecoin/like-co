<template>
  <div class="account-overview lc-margin-bottom-24-mobile">
    <div class="account-overview__user">
      <img
        :src="getUserInfo.avatar"
        alt="avatar"
      >
      <span class="account-overview__id lc-font-size-18 lc-font-weight-600 lc-color-like-green">
        {{ getUserInfo.user }}
      </span>
    </div>

    <div
      v-if="usdStrValue"
      class="account-overview__account"
    >
      <div class="account-overview__like-amount">
        <span class="lc-font-size-38 lc-font-weight-300 lc-color-like-gray-5">
          {{ likeCoinStrValue }}
        </span><span class="account-overview__like-currency">LIKE</span>
      </div>
      <div class="lc-font-weight-600 lc-color-gray-9b">
        (USD {{ usdStrValue }})
      </div>
    </div>

    <div class="lc-text-align-center">
      <md-button
        :href="QRYPTOS_LIKEETH_URL"
        class="md-likecoin lc-secondary lc-font-size-18 lc-font-weight-600"
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ $t('Home.Sale.button.buyCoin') }}
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { QRYPTOS_LIKEETH_URL } from '@/constant';

export default {
  name: 'account-overview',
  data() {
    return {
      QRYPTOS_LIKEETH_URL,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsReady',
      'getUserIsRegistered',
      'getUserInfo',
      'getLikeCoinUsdPrice',
      'getUserLikeCoinAmount',
    ]),
    likeCoinStrValue() {
      return this.getUserLikeCoinAmount ? this.getUserLikeCoinAmount.toFixed(2) : '';
    },
    usdStrValue() {
      if (this.getLikeCoinUsdPrice && this.getUserLikeCoinAmount) {
        return this.getUserLikeCoinAmount.times(this.getLikeCoinUsdPrice).toFixed(2);
      }
      return null;
    },
  },
  watch: {
    getUserIsReady(isReady) {
      if (isReady && this.getUserIsRegistered) {
        this.queryLikeCoinUsdPrice();
        this.queryLikeCoinWalletBalance();
      }
    },
  },
  mounted() {
    if (this.getUserIsReady && this.getUserIsRegistered) {
      this.queryLikeCoinUsdPrice();
      this.queryLikeCoinWalletBalance();
    }
  },
  methods: {
    ...mapActions([
      'queryLikeCoinUsdPrice',
      'queryLikeCoinWalletBalance',
    ]),
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.account-overview {
  background-image: linear-gradient(221deg, #d2f0f0, #f0e6b4);

  &__user {
    padding-top: 16px;
    padding-left: 32px;
    img {
      width: 56px;
      height: 56px;

      border-radius: 50%;
      background-color: $like-white;

      object-fit: cover;
    }
  }

  &__id {
    display: inline-block;
    overflow: hidden;

    width: 228px;

    white-space: nowrap;
    text-overflow: ellipsis;

    @media (min-width: 600px + 1px) {
      padding-left: 8px;
    }
  }

  &__account {
    @media (min-width: 600px + 1px) {
      margin-top: -16px;
      padding-left: 96px;
    }
    @media (max-width: 600px) {
      padding-left: 32px;
    }
  }

  &__like-amount {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
  }

  &__like-currency {
    padding-left: 16px;

    color: $like-dark-brown-2;
  }

  .md-likecoin {
    bottom: -22px;

    align-self: center;

    min-width: 188px;
    margin: 0;

    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    :global(.md-ripple) {
      min-height: 36px;
    }
  }
}
</style>
