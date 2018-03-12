<template>
  <section class="section-avatar">
    <div class="icon">
      <nuxt-link v-if="toId" :to="{ name: 'id', params: { id: toId } }">
        <img alt="avatar" class="main-icon" :src="icon" />
      </nuxt-link>
      <img v-else alt="likecoin" class="main-icon" :src="defaultIcon" />
    </div>
    <div class="heading">
      <section
        class="transaction-state"
        v-if="!isNotFound">
        <div class="send-state">
          {{ isPending ? $t('Transaction.header.label.sending') : $t('Transaction.header.label.sent') }}
        </div>
        <div v-if="amount" class="amount">
          {{ $t(`Transaction.header.label.${isEth ? 'eth' : 'likecoin'}Amount`, { amount }) }}
        </div>
        <div v-if="name" class="user-section">
          {{ $t('Transaction.header.label.to') }}
          <span class="usertitle">{{ name }}</span>
        </div>
        <div v-else />
      </section>
      <h1 v-else class="error">
        <md-icon class="md-size-2x">error</md-icon>
        {{ $t('Transaction.header.label.notFound') }}
      </h1>
    </div>
    <section v-if="!isNotFound">
      <section v-if="failReason==2"><!-- timeout !-->
        <h1 style="color: #fc5757">
          <md-icon class="status-icon error-icon">
            error
          </md-icon>
          {{ $t('Transaction.header.label.timeout') }}
        </h1>
      </section>
      <section v-else-if="failReason==1" class="transaction-container">
        <h1 style="color: #fc5757">
          <md-icon class="status-icon error-icon">
            error
          </md-icon>
          {{ $t('Transaction.header.label.failed') }}
        </h1>
      </section>
      <section v-else-if="isPending" class="transaction-container">
        <h1 style="color: #d9b503">
          {{ $t('Transaction.header.label.pending') }}
        </h1>
        <md-progress-bar md-mode="indeterminate"></md-progress-bar>
        <div class="pending-description">
          {{ $t('Dialog.transaction.label.waiting') }}
        </div>
      </section>
      <section v-else class="transaction-container">
        <h1 style="color: #16a122">
          <md-icon class="status-icon tick-icon">
            check
          </md-icon>
          {{ $t('Transaction.header.label.completed') }}
        </h1>
        <div class="date-content">{{ dateCompleted }}</div>
      </section>
    </section>
  </section>
</template>


<script>
import likeCoinIcon from '@/assets/likecoin.svg';

export default {
  name: 'transaction-header',
  /* failReason : 0 = none, 1 = failed, 2 = timeout */
  props: ['icon', 'toId', 'toName', 'toAddress', 'timestamp', 'amount', 'isNotFound', 'isEth', 'failReason'],
  data() {
    return {
      defaultText: 'Redeem your free LikeCoin',
      defaultIcon: likeCoinIcon,
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
@import "~assets/index";

$status-icon-size: 32px;

.section-avatar {
  position: relative;

  overflow: visible;

  max-width: 560px;
  min-height: 408px;
  margin: -137px auto 0;
  padding: 113px 0 1px;

  background: $like-gray-1;

  display: flex;
  flex-direction: column;
  align-items: center;

  .icon {
    width: 128px;
    height: 128px;

    position: relative;
    z-index: 1;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba(0,0,0, 0.2);
  }

  .heading {
    position: relative;
    display: flex;
    flex-direction: row;

    width: 120%;
    margin-top: -24px;
    padding: 28px;

    text-align: center;

    border-radius: 8px;
    background-image: linear-gradient(238deg, $like-light-blue, $like-gradient-1);

    font-size: 42px;

    .transaction-state {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;

      > * {
        flex: 1;
      }

      .amount {
        flex: 3;
        line-height: 42px;
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
  display: flex;
  align-items: center;
  flex-direction: column;

  margin: 42px;

  h1 {
    position: relative;

    margin: 0;

    font-size: 32px;
  }

  .date-content {
    margin-top: 12px;

    font-size: 20px;
  }

  .md-progress-bar {
    margin-top: 12px;
    width: 100%;
  }

  .status-icon {
    position: absolute;
    top: 8px;
    left: #{-$status-icon-size - 12px};

    color: $like-green-2;

    font-size: $status-icon-size !important;
  }

  .tick-icon {
    color: $like-green-2;
  }

  .error-icon {
    color: $like-red;
  }

  .pending-description {
    margin-top: 20px;
    font-size: 16px;
    font-weight: 300;
    color: $like-gray-4;
  }
}

.usertitle {
  font-weight: 600;
}

@media (max-width: 768px) {
  body .section-avatar {
    margin-top: -112px;

    .heading {
      padding-left: 60px;
      padding-right: 60px;
    }
  }
}
</style>
