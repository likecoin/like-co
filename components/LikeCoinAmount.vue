<template>
  <section class="likecoin-amount-section">
    <div
      id="likecoin-amount"
      class="likecoin-wallet-banner"
    >
      <div class="likecoin-wallet-banner__text-label">
        {{ $t('Edit.label.likeCoinAmount') }}
      </div>

      <div class="likecoin-wallet-banner__amount-view">
        <svg
          v-if="hasPendingLIKE"
          class="likecoin-wallet-banner__lock-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <!-- eslint-disable max-len -->
          <path
            d="M9.65,7.92a2.35,2.35,0,1,1,4.7,0V11H9.65ZM17.32,11h-.4V7.92a4.92,4.92,0,0,0-9.84,0V11h-.4A1.68,1.68,0,0,0,5,12.66v6.65A1.68,1.68,0,0,0,6.68,21H17.32A1.68,1.68,0,0,0,19,19.31V12.66A1.68,1.68,0,0,0,17.32,11Z"
            style="fill-rule: evenodd;fill: currentColor"
          />
          <!-- eslint-enable max-len -->
        </svg>

        <div class="likecoin-wallet-banner__value">
          {{ formattedValue }}
        </div>

        <NuxtLink
          v-if="isZero"
          class="link md-likecoin lc-font-weight-600"
          :to="{ name: 'in-creator' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12px"
            height="12px"
            viewBox="0 0 12 12"
          >
            <!-- eslint-disable max-len -->
            <path
              fill="currentColor"
              d="M7,5h4c0.6,0,1,0.4,1,1s-0.4,1-1,1H7v4c0,0.6-0.4,1-1,1s-1-0.4-1-1V7H1C0.4,7,0,6.6,0,6s0.4-1,1-1h4V1c0-0.6,0.4-1,1-1s1,0.4,1,1V5z"
            />
            <!-- eslint-enable max-len -->
          </svg>
          {{ $t('Home.Sale.button.earnCoin') }}
        </NuxtLink>
      </div>

      <div class="likecoin-wallet-banner__accessory-view">
        <NuxtLink
          v-if="hasPendingLIKE"
          :to="{ name: 'in-unlock' }"
        >
          <!-- eslint-disable max-len -->
          <span
            class="lc-underline lc-font-weight-600"
            style="margin-right: 8px"
          >{{ $t('Edit.label.manageYourLikeCoin') }}</span><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="12px"
            viewBox="0 0 24 12"
          >
            <title>Lock</title>
            <path
              d="M7.24,7A2.37,2.37,0,0,1,4.9,9.4,2.37,2.37,0,0,1,2.56,7V5A2.37,2.37,0,0,1,4.9,2.6,2.37,2.37,0,0,1,7.24,5ZM22.72,4.7H9.79A4.94,4.94,0,0,0,4.9,0,5,5,0,0,0,0,5V7a5,5,0,0,0,4.9,5A4.94,4.94,0,0,0,9.79,7.3h8v2a1.28,1.28,0,1,0,2.56,0v-2h1.1v2a1.28,1.28,0,1,0,2.56,0V6a1.29,1.29,0,0,0-1.28-1.3Z"
              style="fill-rule: evenodd;fill: currentColor"
            />
          </svg>
          <!-- eslint-enable max-len -->
        </NuxtLink>
        <a
          v-else-if="!isZero"
          :href="PURCHASE_LIKE_URL"
          class="lc-underline lc-font-weight-600"
          rel="noopener noreferrer"
          target="_blank"
        >{{ $t('Home.Sale.button.tradeAtExchange') }}</a>
      </div>

    </div>
  </section>
</template>


<script>
import { PURCHASE_LIKE_URL } from '@/constant';

export default {
  name: 'like-coin-amount',
  props: {
    value: {
      type: Object,
      default: null,
    },
    hasWallet: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      PURCHASE_LIKE_URL,
    };
  },
  computed: {
    formattedValue() {
      return this.value || '0';
    },
    isZero() {
      return !this.value || this.value.isZero();
    },
    hasPendingLIKE() {
      return !this.hasWallet && !this.isZero;
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";

.likecoin-wallet-banner {
  display: flex;
  align-items: center;
  flex-direction: row;

  padding: 24px 48px;

  border-radius: 8px;
  background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

  @media (max-width: 768px) {
    z-index: 1;

    align-items: center;
    flex-direction: column;

    padding: 24px 8px;

    text-align: center;

    > *:not(:first-child) {
      margin-top: 12px;
    }
  }

  @media (max-width: 600px) {
    border-radius: 0;
  }

  &__text-label {
    display: flex;

    color: $like-dark-brown-1;

    @media (min-width: 769px) {
      width: 128px;
      min-width: 128px;
      margin-right: 48px;
    }
  }

  &__amount-view {
    @media (min-width: 769px) {
      display: flex;
      align-items: center;
      flex-grow: 1;
    }
  }

  &__lock-icon {
    width: 24px;

    @media (min-width: 769px) {
      margin-right: 8px;
      margin-left: -32px;
    }
  }

  &__value {
    word-wrap: break-word;

    color: $like-gray-5;

    font-size: 56px;
    font-weight: 300;
    line-height: 1;

    @media (max-width: 1024px) {
      font-size: 42px;
    }

    @media (min-width: 769px) {
      margin-right: 32px;
    }

    @media (max-width: 768px) {
      margin: 12px 0;

      font-size: 38px;
    }
  }
}
</style>
