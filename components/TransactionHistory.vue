<template>
  <div>
    <!-- Progress Bar -->
    <md-progress-bar
      v-if="!isHistoryFetched"
      md-mode="indeterminate" />

    <!-- Transaction List -->
    <div class="lc-transaction-history" v-else-if="filteredHistory && filteredHistory.length">
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
          <md-table-head>
            {{ $t('TransactionHistory.header.value') }}
          </md-table-head>
        </md-table-row>

        <md-table-row v-for="tx in filteredHistory" :key="tx.id">
          <md-table-cell :class="['status', getStatus(tx)]">
            {{ $t(`TransactionHistory.label.${getStatus(tx)}`) }}
          </md-table-cell>

          <md-table-cell class="from-to-cell">
            <span>
              {{ $t(`TransactionHistory.label.${getFromTo(tx)}`) }}:
            </span>
            <nuxt-link
              v-if="getFromToId(tx)"
              :to="{ name: 'id', params: { id: getFromToId(tx) } }">
              {{ getFromToId(tx) }}
            </nuxt-link>
            <span v-else>{{ $t('TransactionHistory.label.unknown') }}</span>
          </md-table-cell>

          <md-table-cell
            :class="['time-cell', {
              pending: tx.status === 'pending',
              expired: tx.status === 'timeout',
            }]">
            {{ $t(getTime(tx)) }}
          </md-table-cell>

          <md-table-cell>
            <div :class="['value-cell', { error: isTxFailed(tx) }]">
              <img
                v-if="isTxFailed(tx)"
                :src="ErrorIcon" />
              <div
                class="value"
                v-html="getValue(tx)" />
            </div>
          </md-table-cell>

          <md-table-cell class="view-cell">
            <nuxt-link :to="{
              name: isTokensale(tx) ? 'in-tokensale-tx-id' : 'in-tx-id',
              params: { id: tx.id },
            }">
              {{ $t('TransactionHistory.button.view') }}
            </nuxt-link>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <a class="lc-verticle-inset-4 show-more" v-if="hasMore" href="" @click.prevent="onShowMore">
        {{ $t('TransactionHistory.button.showMore') }}
      </a>
    </div>

    <!-- Empty Placeholder -->
    <div v-else>
      {{ $t('TransactionHistory.label.noRecord') }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import ErrorIcon from '@/assets/txHistory/invalid.svg';
import LockIcon from '@/assets/txHistory/lock.svg';

import EthHelper from '@/util/EthHelper';
import { ETH_TO_LIKECOIN_RATIO, ONE_LIKE } from '@/constant';
import { LIKE_COIN_ICO_ADDRESS, LIKE_COIN_PRESALE_ADDRESS } from '@/constant/contract/likecoin-ico';

function getLikeCoinByETH(eth) {
  return new BigNumber(eth).dividedBy(ONE_LIKE)
    .multipliedBy(new BigNumber(ETH_TO_LIKECOIN_RATIO));
}

function getLikeCoinByValue(value) {
  return new BigNumber(value).dividedBy(ONE_LIKE);
}

function formatAmount(value, currency) {
  if (Number.isNaN(Number(value))) return '0.00';

  const stringValue = value.toString();
  const valueParts = stringValue.split('.');

  const integerPart = valueParts[0];
  const decimalPart = valueParts[1] ? valueParts[1].padEnd(2, '00') : '00';
  return `
    <span class="integer">${integerPart}.</span>
    <span class="decimal">${decimalPart}</span>
    <span class="currency">${currency}</span>
  `;
}

function formatUTCTime(date) {
  return `${moment.utc(date).format('D-M-YYYY HH:mm:ss')} (UTC)`;
}

export default {
  name: 'transaction-history',
  props: ['address', 'showTokensale'],
  data() {
    return {
      ErrorIcon,
      LockIcon,
      ICOTotalCoin: 0,
      ICOTotalETH: 0,
      txHistory: [],
      hasMore: true,
      isHistoryFetched: false,
    };
  },
  computed: {
    filteredHistory() {
      return this.txHistory
        .filter(t => (t.type !== 'logRegisterKYC'))
        .filter(t => (t.type !== 'transferETH' || this.isTokensale(t)));
    },
  },
  methods: {
    ...mapActions([
      'queryTxHistoryByAddr',
    ]),
    getStatus(tx) {
      if (this.isTokensale(tx)) return 'tokensale';
      if (this.isPresale(tx)) return 'earlybird';
      if (this.isTxFailed(tx)) return 'fail';
      if (tx.type === 'claimCoupon') return 'coupon';
      if (tx.to === this.address) return 'in';
      if (tx.from === this.address) return 'out';
      return 'unknown';
    },
    getValue(tx) {
      if (!tx.value) return '0.00';
      const value = getLikeCoinByValue(tx.value) || 0;
      // handle decimal places
      if (this.isPresale(tx)) {
        return formatAmount(value, 'ETH');
      }
      if (this.isTokensale(tx)) {
        return `
          ${formatAmount(1, 'ETH')}
          <span class="to">→</span>
          ${formatAmount(getLikeCoinByETH(tx.value || 0), 'LIKE')}
        `;
      }
      return formatAmount(value, 'LIKE');
    },
    getFromToId(tx) {
      if (this.isPresale(tx)) return 'earlybird';
      if (this.isTokensale(tx)) return 'tokensale';
      if (tx.type === 'claimCoupon') return 'coupon';
      const isFrom = (tx.to === this.address);
      return isFrom ? tx.fromId : tx.toId;
    },
    getFromTo(tx) {
      if (this.isTokensale(tx)) return 'from';
      const isFrom = (tx.to === this.address);
      return isFrom ? 'from' : 'to';
    },
    getTime(tx) {
      if (tx.status === 'pending') return 'TransactionHistory.label.timePending';
      if (tx.status === 'timeout') return 'TransactionHistory.label.timeExpired';
      return tx.completeTs ? formatUTCTime(tx.completeTs) : '';
    },
    isPresale(tx) {
      return tx.to === LIKE_COIN_PRESALE_ADDRESS;
    },
    isTokensale(tx) {
      return tx.to === LIKE_COIN_ICO_ADDRESS;
    },
    isTxFailed(tx) {
      return tx.status === 'fail' || tx.status === 'timeout';
    },
    async onShowMore() {
      const data = await this.queryTxHistoryByAddr({
        addr: this.address,
        ts: (this.txHistory[this.txHistory.length - 1].ts - 1),
      });
      if (!data || !data.length) this.hasMore = false;
      this.txHistory = this.txHistory.concat(data);
    },
    async updateTokenSaleHistory() {
      try {
        const { coin, eth } = await EthHelper.getAddressPurchaseTotal(this.address);
        this.ICOTotalCoin = new BigNumber(coin).dividedBy(ONE_LIKE).toFixed(4);
        this.ICOTotalETH = new BigNumber(eth).dividedBy(ONE_LIKE).toFixed(4);
        this.txHistory = await this.queryTxHistoryByAddr({ addr: this.address });
        this.isHistoryFetched = true;
        if (!this.txHistory || !this.txHistory.length) this.hasMore = false;
      } catch (err) {
        console.error(err);
      }
    },
  },
};

</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-transaction-history {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .md-table {
    background-color: transparent;
    :global(.md-table-content) {
      background-color: transparent;
    }
    :global(.md-table-head-label) {
      height: 14px;
    }
    :global(.md-table-head-label),
    :global(.md-table-cell-container) {
      padding-left: 0;
      line-height: 14px;
    }
    :global(.md-table-head-container) {
      padding: 6px 0;
      height: initial;
    }

    .md-table-head {
      color: $like-dark-brown-1;
      font-size: 14px;
      font-weight: normal;

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
        border-top-color: #E6E6E6;
        color: $like-dark-brown-1;

        &.status {
          font-size: 10px;
          font-weight: 600;
          padding-left: 8px;

          &.in,
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
            font-size: 10px;
            margin-right: 2px;
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
          :global(.md-table-cell-container) {
            padding: 0 8px;
          }
        }

        .value-cell {
          display: flex;
          flex-direction: row;
          &.error {
            color: #9b9b9b;
          }
          img {
            margin-top: -4px;
            margin-right: 4px;
          }
          .value {
            font-size: 0;

            :global(.integer) { font-size: 14px; }
            :global(.decimal) { font-size: 12px; }
            :global(.currency) { font-size: 10px; margin-left: 4px; }
            :global(.to) {
              font-size: 14px;
              margin: 4px;
            }
          }
        }
      }
    }
  }

  a {
    font-size: 14px;
    color: $like-green;

    &.show-more {
      text-align: center;
    }
  }
}
</style>
