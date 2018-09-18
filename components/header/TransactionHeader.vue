<template>
  <section class="lc-transaction-header">
    <div class="lc-container-2">
      <div class="lc-container-3 lc-bg-gray-1 icon-wrapper">
        <div class="icon">
          <nuxt-link
            v-if="toId"
            :to="{ name: 'id', params: { id: toId } }"
          >
            <img
              :src="icon"
              alt="avatar"
              class="main-icon"
            >
          </nuxt-link>
          <img
            v-else
            :src="likeCoinIcon"
            alt="likecoin"
            class="main-icon"
          >
        </div>
      </div>
    </div>

    <div class="lc-container-2-extend">
      <div class="lc-container-3-extend-bg" />
      <div class="lc-container-3">
        <div class="heading lc-font-size-42 lc-padding-top-32 lc-padding-bottom-24 lc-mobile">
          <section
            v-if="!isNotFound"
            class="transaction-state"
          >
            <div class="send-state">
              {{
                isPending ? $t('Transaction.header.label.sending')
                : $t('Transaction.header.label.sent')
              }}
            </div>
            <div
              v-if="amount"
              class="amount lc-font-weight-300"
            >
              {{ $t(`Transaction.header.label.${isEth ? 'eth' : 'likecoin'}Amount`, { amount }) }}
            </div>
            <div
              v-if="name"
              class="user-section"
            >
              {{ $t('Transaction.header.label.to') }}
              <span class="lc-font-weight-600">
                {{ name }}
              </span>
            </div>
            <div v-else />
          </section>
          <h1
            v-else
            class="error"
          >
            <md-icon class="md-size-2x">error</md-icon>
            {{ $t('Transaction.header.label.notFound') }}
          </h1>
        </div>
      </div>
    </div>

    <div class="lc-container-2">
      <div class="lc-container-3 lc-bg-gray-1 icon-wrapper">

        <section
          v-if="!isNotFound"
          class="transaction-container lc-padding-vertical-48 lc-mobile"
        >
          <div v-if="failReason === 2">
            <h1 class="failed">
              <md-icon class="status-icon error-icon">
                error
              </md-icon>
              {{ $t('Transaction.header.label.timeout') }}
            </h1>
          </div>
          <div v-else-if="failReason === 1">
            <h1 class="failed">
              <md-icon class="status-icon error-icon">
                error
              </md-icon>
              {{ $t('Transaction.header.label.failed') }}
            </h1>
          </div>
          <div v-else-if="isPending">
            <h1 class="pending">
              {{ $t('Transaction.header.label.pending') }}
            </h1>
            <div class="pending-progress" />
            <div class="pending-description lc-font-size-16 lc-font-weight-400">
              {{ $t('Dialog.transaction.label.waiting') }}
            </div>
          </div>
          <div v-else>
            <h1 class="success lc-margin-bottom-12">
              <img
                :src="TickIcon"
                class="status-icon"
              >
              {{ $t('Transaction.header.label.completed') }}
            </h1>
            <div class="lc-font-size-20">
              {{ dateCompleted }}
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>


<script>
import likeCoinIcon from '@/assets/logo/icon.svg';
import TickIcon from '@/assets/tokensale/tick.svg';

export default {
  name: 'transaction-header',
  /* failReason : 0 = none, 1 = failed, 2 = timeout */
  props: {
    icon: {
      type: String,
      default: '',
    },
    toId: {
      type: String,
      default: '',
    },
    toName: {
      type: String,
      default: '',
    },
    toAddress: {
      type: String,
      default: '',
    },
    timestamp: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    isNotFound: {
      type: Boolean,
      default: false,
    },
    isEth: {
      type: Boolean,
      default: false,
    },
    failReason: {
      type: Number,
      default: 0,
    },
  },
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
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

$status-icon-size: 32px;

.lc-transaction-header {
  position: relative;

  .icon-wrapper {
    display: flex;
    justify-content: center;

    .icon {

      position: relative;
      z-index: 1;

      overflow: hidden;

      width: 128px;
      height: 128px;

      border-radius: 50%;
    }
  }

  .heading {
    position: relative;

    display: flex;
    flex-direction: row;

    margin-top: -24px;

    text-align: center;

    border-radius: 8px;


    .transaction-state {
      display: flex;
      align-items: center;
      flex-direction: row;

      width: 100%;

      > * {
        flex: 1;
      }

      .amount {
        flex: 3;
      }

      @media (max-width: 600px) {
        flex-direction: column;

        margin-top: 16px;
      }
    }

    h1 {
      margin: 0;

      text-align: center;
    }

    .send-state {
      text-align: left;

      font-size: 14px;
    }

    .user-section {
      text-align: right;

      font-size: 14px;
    }
  }
}


.main-icon {
  display: inline;

  width: auto;
  height: 100%;
  margin: 0 auto;
}

.transaction-container {
  text-align: center;

  h1 {
    position: relative;

    display: inline-flex;

    font-size: 32px;

    &.fail {
      color: $like-red;
    }
    &.pending {
      color: #6faeee;
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

      width: $status-icon-size;
      height: $status-icon-size;

      color: $like-green-2;

      @media (max-width: 600px) {
        display: none;
      }
    }

    .error-icon {
      color: $like-red;
    }
  }

  .md-progress-bar {
    width: 100%;
    margin-top: 12px;
  }

  .pending-progress {
    height: 6px;
    margin: 16px 0;

    @include background-image-sliding-animation-x(
      linear-gradient(to right, #90c2ed, #6faeee 20%, #d7ecec)
    );
  }

  .pending-description {
    margin-top: 20px;

    text-align: left;

    color: $like-gray-4;
  }
}

</style>
