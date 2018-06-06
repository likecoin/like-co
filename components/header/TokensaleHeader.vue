<template>
  <section class="lc-transaction-header">
    <div class="lc-container-2">
      <div class="lc-container-3 lc-bg-gray-1 icon-wrapper">
        <div class="icon">
          <nuxt-link :to="{ name: 'in-tokensale' }">
            <img alt="likecoin" class="main-icon" :src="likeCoinIcon" />
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="lc-container-2-extend">
      <div class="lc-container-3-extend-bg" />
      <div class="lc-container-3">
        <div class="heading lc-font-size-42 lc-padding-top-32 lc-padding-bottom-24 lc-mobile">
          <section
            class="tokensale-state"
            v-if="!isNotFound">
            <div class="header lc-font-size-20">
              TokenSale
            </div>
            <div v-if="amount" class="amount lc-font-weight-300">
              {{ $t(`Transaction.header.label.ethAmount`, { amount }) }} →
              {{ $t(`Transaction.header.label.likecoinAmount`, { amount: amountOfLikeCoin }) }}
            </div>
            <div v-else />
          </section>
          <h1 v-else class="error">
            <md-icon class="md-size-2x">error</md-icon>
            {{ $t('Transaction.header.label.notFound') }}
          </h1>
        </div>
      </div>
    </div>

    <div class="lc-container-2">
      <div class="lc-container-3 lc-bg-gray-1 icon-wrapper">

        <section v-if="!isNotFound" class="tokensale-container lc-padding-vertical-48 lc-mobile">
          <section v-if="failReason === 2"><!-- timeout !-->
            <h1 class="failed">
              <md-icon class="status-icon error-icon">
                error
              </md-icon>
              {{ $t('Transaction.header.label.timeout') }}
            </h1>
          </section>
          <section v-else-if="failReason === 1">
            <h1 class="failed">
              <md-icon class="status-icon error-icon">
                error
              </md-icon>
              {{ $t('Transaction.header.label.failed') }}
            </h1>
          </section>
          <section v-else-if="isPending">
            <h1 class="pending">
              {{ $t('Transaction.header.label.pending') }}
            </h1>
            <md-progress-bar md-mode="indeterminate" />
            <div class="pending-description lc-font-size-16 lc-font-weight-300">
              {{ $t('Dialog.transaction.label.waiting') }}
            </div>
          </section>
          <section v-else>
            <h1 class="success lc-margin-bottom-12">
              <img class="status-icon" :src="TickIcon" />
              {{ $t('Transaction.header.label.completed') }}
            </h1>
            <div class="lc-font-size-20">
              {{ dateCompleted }}
            </div>
          </section>
        </section>
      </div>
    </div>
  </section>
</template>


<script>
import likeCoinIcon from '@/assets/logo/icon.svg';
import TickIcon from '@/assets/tokensale/tick.svg';

import { ETH_TO_LIKECOIN_RATIO } from '@/constant';

export default {
  name: 'tokensale-header',
  /* failReason : 0 = none, 1 = failed, 2 = timeout */
  props: ['icon', 'toId', 'toName', 'toAddress', 'timestamp', 'amount', 'isNotFound', 'failReason'],
  data() {
    return {
      defaultText: 'Redeem your free LikeCoin',
      likeCoinIcon,
      TickIcon,
    };
  },
  computed: {
    isPending() {
      return !this.timestamp;
    },
    name() {
      return this.toName || this.toId || '';
    },
    dateCompleted() {
      return new Date(this.timestamp * 1000).toString();
    },
    amountOfLikeCoin() {
      return this.amount * ETH_TO_LIKECOIN_RATIO;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$status-icon-size: 32px;

.lc-transaction-header {
  position: relative;

  .icon-wrapper {
    display: flex;
    justify-content: center;

    .icon {
      width: 128px;
      height: 128px;

      position: relative;
      z-index: 1;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .heading {
    position: relative;
    display: flex;
    flex-direction: row;

    margin-top: -24px;

    text-align: center;

    border-radius: 8px;


    .tokensale-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      > * {
        flex: 1;
      }

      .amount {
        flex: 3;
      }

      @media (max-width: 600px) {
        margin-top: 16px;
      }
    }

    h1 {
      margin: 0;

      text-align: center;
    }
  }
}


.main-icon {
  display: inline;

  width: auto;
  height: 100%;
  margin: 0 auto;
}

.tokensale-container {
  text-align: center;

  h1 {
    position: relative;

    display: inline-flex;

    font-size: 32px;

    &.fail {
      color: $like-red;
    }
    &.pending {
      color: #d9b503;
    }
    &.success {
      color: $like-green-2;
    }

    @media (max-width: 600px) {
      font-size: 26px;
    }

    .status-icon {
      position: absolute;
      top: 2px;
      left: -42px;

      color: $like-green-2;

      width: $status-icon-size;
      height: $status-icon-size;

      @media (max-width: 600px) {
        display: none;
      }
    }

    .error-icon {
      color: $like-red;
    }
  }

  .md-progress-bar {
    margin-top: 12px;
    width: 100%;
  }

  .pending-description {
    margin-top: 20px;
    color: $like-gray-4;
  }
}
</style>
