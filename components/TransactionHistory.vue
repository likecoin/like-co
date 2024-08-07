<template>
  <section class="transaction-history-section lc-container-0">
    <div class="lc-container-1">

      <div class="lc-container-header">
        <div class="lc-container-2 lc-container-header-overlay">
          <div class="lc-container-3 lc-bg-gray-1" />
        </div>
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <div class="lc-container-header-title">
                <h1 class="lc-font-size-32 lc-mobile">
                  {{ $t('TransactionHistory.title') }}
                </h1>
                <div
                  v-if="isFetchedTx"
                  class="lc-container-header-button-wrapper lc-mobile-hide"
                >
                  <refresh-button
                    :is-refreshing="isEmptyList && isFetchingTx"
                    @click="updateTokenSaleHistory"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lc-container-2">
        <!-- Empty Placeholder -->
        <div
          v-if="!isFetchingTx && isFetchedTx && isEmptyList"
          class="lc-container-3 lc-padding-vertical-64 lc-bg-gray-1"
        >
          <div
            class="lc-container-4"
          >
            <div class="lc-text-align-center">
              {{ $t('TransactionHistory.label.noRecord') }}
            </div>
            <div
              v-if="hasPendingLike"
              class="lc-text-align-center"
            >
              {{ $t('TransactionHistory.label.stillPending') }}
            </div>
          </div>
        </div>

        <!-- Transaction List -->
        <div
          v-else-if="!isEmptyList"
          class="lc-transaction-history lc-padding-top-32 lc-bg-gray-1 lc-mobile"
        >
          <md-table>
            <md-table-row>
              <md-table-head class="status-header">
                {{ $t('TransactionHistory.header.status') }}
              </md-table-head>
              <md-table-head>
                {{ $t('TransactionHistory.header.fromOrTo') }}
              </md-table-head>
              <md-table-head>
                {{ $t('TransactionHistory.header.time') }}
              </md-table-head>
              <md-table-head class="right">
                {{ $t('TransactionHistory.header.value') }}
              </md-table-head>
              <md-table-head />
            </md-table-row>

            <md-table-row
              v-for="tx in filteredHistory"
              :key="tx.id"
              class="lc-container-3"
            >
              <md-table-cell :class="['status', getStatus(tx)]">
                {{ $t(`TransactionHistory.label.${getStatus(tx)}`) }}
              </md-table-cell>

              <md-table-cell class="from-to-cell">
                <span>
                  {{ $t(`TransactionHistory.label.${getFromTo(tx)}`) }}:
                </span>
                <span
                  v-if="isOutMultiple(tx)"
                  class="multiple-recipients"
                >
                  {{ $t('TransactionHistory.label.multipleOut') }}
                </span>
                <nuxt-link
                  v-else-if="getFromToId(tx)"
                  :to="{ name: 'id', params: { id: getFromToId(tx) } }"
                >
                  {{ getFromToId(tx) }}
                </nuxt-link>
                <span v-else>{{ $t('TransactionHistory.label.unknown') }}</span>
              </md-table-cell>

              <md-table-cell
                :class="['time-cell', {
                  pending: tx.status === 'pending',
                  expired: tx.status === 'timeout',
                }]"
              >
                {{ getTime(tx) }}
              </md-table-cell>

              <md-table-cell>
                <div :class="['value-cell right', { error: isTxFailed(tx) }]">
                  <img
                    v-if="isTxFailed(tx)"
                    :src="ErrorIcon"
                  >
                  <div
                    v-else-if="isFromPreSaleBonus(tx)"
                  >
                    <img :src="LockIcon">
                    <md-tooltip>
                      {{
                        $t('TransactionHistory.label.lockUntilDate',
                           { date: BONUS_LOCK_UNTIL_DATE })
                      }}
                    </md-tooltip>
                  </div>
                  <!-- eslint-disable vue/valid-v-for -->
                  <div
                    v-for="value in [getValue(tx)]"
                    :key="tx.id"
                    class="value"
                  >
                    <!-- eslint-enable vue/valid-v-for -->
                    <span class="lc-font-size-14">{{ value.integerPart }}.</span>
                    <span class="lc-font-size-12">{{ value.decimalPart }}</span>
                    <span class="currency">{{ value.currency }}</span>
                    <template v-if="value.tokenSale">
                      <span class="to">→</span>
                      <span class="lc-font-size-14">{{ value.tokenSale.integerPart }}.</span>
                      <span class="lc-font-size-12">{{ value.tokenSale.decimalPart }}</span>
                      <span class="currency">{{ value.tokenSale.currency }}</span>
                    </template>
                  </div>
                </div>
              </md-table-cell>

              <md-table-cell class="view-cell">
                <nuxt-link
                  :to="{
                    name: isTokensale(tx) ? 'in-tokensale-tx-id' : 'in-tx-id',
                    params: { id: tx.id },
                    query: isInMultiple(tx) ? { address: address } : {},
                  }"
                >
                  {{ $t('TransactionHistory.button.view') }}
                </nuxt-link>
              </md-table-cell>
            </md-table-row>
          </md-table>

        </div>

        <!-- Progress Bar & More Button -->
        <div
          :class="[
            'lc-container-3 lc-bg-gray-1 lc-mobile',
            isEmptyList ? 'lc-padding-vertical-64' : 'lc-padding-bottom-32',
          ]"
        >
          <div class="lc-container-4">

            <md-progress-bar
              v-if="isFetchingTx"
              md-mode="indeterminate"
            />

            <div
              v-else-if="hasMore"
              class="lc-text-align-center lc-padding-top-4"
            >
              <a
                class="lc-margin-top-16 show-more"
                href=""
                @click.prevent="onShowMore"
              >
                {{ $t('TransactionHistory.button.showMore') }}
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import format from 'date-fns/format';

import ErrorIcon from '@/assets/txHistory/invalid.svg';
import LockIcon from '@/assets/txHistory/lock.svg';

import {
  ETH_TO_LIKECOIN_RATIO,
  ONE_LIKE,
  TRANSACTION_QUERY_LIMIT,
  BONUS_LOCK_UNTIL_DATE,
  BONUS_ADDRESSES,
} from '@/constant';
import {
  LIKE_COIN_ICO_ADDRESS,
  LIKE_COIN_PRESALE_ADDRESS,
  LIKE_COIN_PRESALE_FROM_ADDRESS,
  LIKE_COIN_PRESALE_BONUS_FROM_ADDRESS,
} from '@/constant/contract/likecoin-ico';
import { amountToLIKE } from '@/util/CosmosHelper';

import RefreshButton from '~/components/RefreshButton';

function getLikeCoinByETH(eth) {
  return new BigNumber(eth).dividedBy(ONE_LIKE)
    .multipliedBy(new BigNumber(ETH_TO_LIKECOIN_RATIO));
}

function getLikeCoinByValue(value) {
  return new BigNumber(value).dividedBy(ONE_LIKE);
}

function formatAmount(value, currency) {
  if (Number.isNaN(Number(value))) return '0.00';

  const stringValue = value.toFixed();
  const valueParts = stringValue.split('.');

  const integerPart = valueParts[0];
  const decimalPart = valueParts[1] ? valueParts[1].padEnd(2, '00') : '00';
  return {
    integerPart,
    decimalPart,
    currency,
  };
}

function formatUTCTimeToLocal(date) {
  return format(date, 'D-M-YYYY HH:mm:ss UTCZZ');
}

export default {
  name: 'transaction-history',
  components: {
    RefreshButton,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
    user: {
      type: String,
      default: '',
    },
    isFetched: {
      type: Boolean,
      default: false,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    hasPendingLike: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      BONUS_LOCK_UNTIL_DATE: new Date(BONUS_LOCK_UNTIL_DATE),
      ErrorIcon,
      LockIcon,
      ICOTotalCoin: 0,
      ICOTotalETH: 0,
      txHistory: [],
      hasMore: false,

      isFetchedTx: this.isFetched,
      isFetchingTx: this.isFetching,
    };
  },
  computed: {
    filteredHistory() {
      return this.txHistory
        .filter(t => (t.type !== 'logRegisterKYC'))
        .filter(t => (t.type !== 'transferETH' || this.isTokensale(t)));
    },
    isEmptyList() {
      return !(this.filteredHistory && this.filteredHistory.length);
    },
  },
  methods: {
    ...mapActions([
      'queryTxHistoryByUserId',
    ]),
    getStatus(tx) {
      if (this.isFromPreSaleBonus(tx) || this.isFromPresale(tx)) return 'earlybird';
      if (this.isTokensale(tx)) return 'tokensale';
      if (this.isPresale(tx)) return 'earlybird';
      if (this.isTxFailed(tx)) return 'fail';
      if (tx.type === 'claimCoupon') return 'coupon';
      if (this.isInMultiple(tx)) return 'multipleIn';
      if (tx.toId === this.user) return 'in';
      if (tx.fromId === this.user) return 'out';
      return 'unknown';
    },
    getValue(tx) {
      if (!(tx.value || tx.amount)) return '0.00';
      let value;

      if (this.isCosmos) {
        if (this.isInMultiple(tx)) {
          return formatAmount(
            amountToLIKE(tx.amount[tx.toIds.indexOf(this.user)]) || 0, 'LIKE',
          );
        }

        if (this.isOutMultiple(tx)) {
          let total = 0;
          tx.amount.forEach((a) => {
            total += amountToLIKE(a);
          });
          return formatAmount(total, 'LIKE');
        }
        value = amountToLIKE(tx.amount) || 0;
      } else {
        if (this.isInMultiple(tx)) {
          return formatAmount(
            getLikeCoinByValue(tx.value[tx.toIds.indexOf(this.user)]) || 0, 'LIKE',
          );
        }

        if (this.isOutMultiple(tx)) {
          let total = new BigNumber(0);
          tx.value.forEach((v) => {
            total = total.plus(getLikeCoinByValue(v) || 0);
          });
          return formatAmount(total, 'LIKE');
        }
        value = getLikeCoinByValue(tx.value) || 0;
      }

      if (this.isPresale(tx)) {
        return formatAmount(value, 'ETH');
      }
      if (this.isTokensale(tx)) {
        return {
          ...formatAmount(value, 'ETH'),
          tokenSale: formatAmount(getLikeCoinByETH(tx.value || 0), 'LIKE'),
        };
      }
      return formatAmount(value, 'LIKE');
    },
    getFromToId(tx) {
      if (this.isFromPresale(tx)) return 'presale';
      if (this.isFromBonus(tx)) return 'likecoinbonus';
      if (this.isFromPreSaleBonus(tx)) return 'presalebonus';
      if (this.isPresale(tx)) return 'earlybird';
      if (this.isTokensale(tx)) return 'tokensale';
      if (tx.type === 'claimCoupon') return 'coupon';
      if (this.isInMultiple(tx)) return tx.fromId;
      const isFrom = (tx.toId === this.user);
      return isFrom ? tx.fromId : tx.toId;
    },
    getFromTo(tx) {
      if (this.isTokensale(tx)) return 'from';
      const isFrom = (tx.toId === this.user) || this.isInMultiple(tx);
      return isFrom ? 'from' : 'to';
    },
    getTime(tx) {
      if (tx.status === 'pending') return this.$t('TransactionHistory.label.timePending');
      if (tx.status === 'timeout') return this.$t('TransactionHistory.label.timeExpired');
      return tx.completeTs ? formatUTCTimeToLocal(tx.completeTs) : '';
    },
    setIsFetching(value = true) {
      this.isFetchingTx = value;
      this.$emit('update:isFetching', value);
    },
    isFromPresale(tx) {
      return tx.from === LIKE_COIN_PRESALE_FROM_ADDRESS;
    },
    isFromBonus(tx) {
      return BONUS_ADDRESSES.includes(tx.from);
    },
    isFromPreSaleBonus(tx) {
      return tx.from === LIKE_COIN_PRESALE_BONUS_FROM_ADDRESS;
    },
    isPresale(tx) {
      return tx.to === LIKE_COIN_PRESALE_ADDRESS;
    },
    isTokensale(tx) {
      return tx.to === LIKE_COIN_ICO_ADDRESS;
    },
    isInMultiple(tx) {
      return (Array.isArray(tx.toIds)
        && (Array.isArray(tx.value) || Array.isArray(tx.amount))
        && tx.toIds.includes(this.user));
    },
    isOutMultiple(tx) {
      return (tx.fromId === this.user)
      && Array.isArray(tx.to)
      && (Array.isArray(tx.value) || Array.isArray(tx.amount));
    },
    isTxFailed(tx) {
      return tx.status === 'fail' || tx.status === 'timeout';
    },
    isCosmos(tx) {
      return tx.type === 'cosmosTransfer';
    },
    async onShowMore() {
      this.setIsFetching();
      const data = await this.queryTxHistoryByUserId({
        id: this.user,
        ts: (this.txHistory[this.txHistory.length - 1].ts - 1),
      });
      if (!data || !data.length || data.length < TRANSACTION_QUERY_LIMIT) this.hasMore = false;
      this.txHistory = this.txHistory.concat(data);
      this.setIsFetching(false);
    },
    async updateTokenSaleHistory() {
      this.hasMore = false;
      this.txHistory = [];
      this.setIsFetching();

      try {
        this.txHistory = await this.queryTxHistoryByUserId({ id: this.user });
        this.isFetchedTx = true;
        this.$emit('update:isFetched', this.isFetchedTx);
        if (
          this.txHistory
          && this.txHistory.length
          && this.txHistory.length >= TRANSACTION_QUERY_LIMIT
        ) {
          this.hasMore = true;
        }
      } catch (err) {
        console.error(err);
      }

      this.setIsFetching(false);
    },
  },
};

</script>

<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/mixin";

.lc-transaction-history {
  .md-table {
    -webkit-overflow-scrolling: touch;

    background-color: transparent;

    /deep/ .md-scrollbar::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    /deep/ .md-table-head-label {
      height: 14px;
    }

    /deep/ .md-table-head-label,
    /deep/ .md-table-cell-container {
      padding-left: 0;

      line-height: 14px;
    }

    /deep/ .md-table-head-container {
      height: initial;
      padding: 6px 0;
    }

    /deep/ .md-table-content {
      @include padding-x(40 + 8);

      background-color: transparent;

      @media (max-width: 600px) {
        @include padding-x(24 + 8)
      }
    }

    .md-table-head {
      color: $like-dark-brown-1;

      font-size: 14px;
      font-weight: normal;

      &.right {
        text-align: right;
      }

      &.status-header {
        width: 102px;
      }
    }

    .md-table-row {
      &:hover {
        .md-table-cell {
          background-color: rgba(255, 255, 255, .8);
        }
      }
      &:last-child {
        border-bottom: 1px solid #E6E6E6;
      }
      .md-table-cell {
        white-space: nowrap;

        color: $like-dark-brown-1;
        border-top-color: #E6E6E6;

        &.status {
          padding-left: 8px;

          font-size: 10px;
          font-weight: 600;

          &.in,
          &.multipleIn,
          &.tokensale,
          &.earlybird,
          &.pending,
          &.coupon {
            color: $like-green-2;
          }

          &.out {
            color: #d9b503;
          }

          &.fail {
            color: #9b9b9b;
          }
        }

        &.from-to-cell {
          span {
            margin-right: 2px;

            font-size: 10px;

            &.multiple-recipients {
              font-size: 14px;
            }
          }
        }

        &.time-cell {
          &.pending {
            color: #9b9b9b;

            font-style: italic;
          }
          &.expired {
            color: $like-red;
          }
        }

        &.view-cell {
          width: 56px;

          text-align: right;

          /deep/ .md-table-cell-container {
            padding: 0 8px;
          }
        }

        .value-cell {
          display: flex;
          flex-direction: row;

          &.right {
            justify-content: flex-end;
          }

          &.error {
            color: #9b9b9b;
          }
          img {
            min-width: 10px;
            margin-top: -2px;
            margin-right: 4px;
          }
          .value {
            font-size: 0;

            /deep/ .currency {
              margin-left: 4px;

              font-size: 10px;
            }
            /deep/ .to {
              margin: 4px;

              font-size: 14px;
            }
          }
        }
      }
    }
  }

  a {
    font-size: 14px;

    &.show-more {
      display: block;

      text-align: center;
    }
  }
}
</style>
