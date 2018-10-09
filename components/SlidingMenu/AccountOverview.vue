<template>
  <div class="account-overview">
    <div class="account-overview__user">
      <img
        :src="getUserInfo.avatar"
        alt="avatar"
      >
      <div class="account-overview__id lc-font-size-18 lc-font-weight-600">
        <span class="lc-color-gray-9b">ID:</span>
        <span class="lc-color-like-green lc-line-height-1-2">
          {{ getUserInfo.user }}
        </span>
      </div>
    </div>

    <div
      v-if="usdStrValue"
      class="account-overview__account lc-padding-bottom-32"
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

    <div class="account-overview__cta-wrapper lc-text-align-center">
      <div @click="closeSlidingMenu">
        <md-button
          :to="{ 'name': 'in-settings-button' }"
          class="md-likecoin lc-secondary lc-font-size-18 lc-font-weight-600"
        >{{ $t('Home.Sale.button.earnCoin') }}</md-button>
      </div>
      <a
        :href="LIQUID_LIKEETH_URL"
        class="lc-underline lc-margin-top-12"
        rel="noopener noreferrer"
        target="_blank"
      >{{ $t('Home.Sale.button.tradeAtLiquid') }}</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import { LIQUID_LIKEETH_URL } from '@/constant';

export default {
  name: 'account-overview',
  data() {
    return {
      LIQUID_LIKEETH_URL,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserInfo',
      'getLikeCoinUsdNumericPrice',
      'getUserLikeCoinAmountInBigNumber',
    ]),
    likeCoinStrValue() {
      return this.getUserLikeCoinAmountInBigNumber ? this.getUserLikeCoinAmountInBigNumber.toFixed(2) : '';
    },
    usdStrValue() {
      if (this.getLikeCoinUsdNumericPrice && this.getUserLikeCoinAmountInBigNumber) {
        return (
          this.getUserLikeCoinAmountInBigNumber.times(this.getLikeCoinUsdNumericPrice).toFixed(2)
        );
      }
      return null;
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.queryLikeCoinUsdPrice();
      this.queryLikeCoinWalletBalance();
    }
  },
  methods: {
    ...mapActions([
      'closeSlidingMenu',
      'queryLikeCoinUsdPrice',
      'queryLikeCoinWalletBalance',
    ]),
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
.account-overview {
  position: relative;

  background-image: linear-gradient(221deg, #d2f0f0, #f0e6b4);

  &__user {
    display: flex;
    align-items: center;
    flex-direction: row;

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
    display: flex;
    align-items: center;
    flex-direction: row;

    padding-left: 8px;

    span:last-child {
      display: inline-block;
      overflow: hidden;

      padding-left: 4px;

      white-space: nowrap;
      text-overflow: ellipsis;

      @media (min-width: 600px + 1px) {
        width: 200px;
      }
      @media (max-width: 600px) {
        width: 136px;
      }
    }
  }

  &__account {
    @media (min-width: 600px + 1px) {
      margin-top: -10px;
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
    align-self: center;

    min-width: 188px;
    margin: 0;

    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    :global(.md-ripple) {
      min-height: 36px;
    }
  }

  &__cta-wrapper {
    position: absolute;
    bottom: -50px;

    display: flex;
    flex-direction: column;

    width: 100%;
  }
}
</style>
