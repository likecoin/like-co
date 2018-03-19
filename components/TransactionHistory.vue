<template>
  <div v-if="txHistory && txHistory.length">
    <div v-if="showTokensale"> sum: {{ ICOTotalCoin }} (ETH : {{ ICOTotalETH }}) </div>
    <md-table>
      <md-table-row>
        <md-table-head>Status</md-table-head>
        <md-table-head>From/To</md-table-head>
        <md-table-head>Time</md-table-head>
        <md-table-head>Value</md-table-head>
        <md-table-head>Tx page</md-table-head>
      </md-table-row>
      <md-table-row v-for="tx in txHistory" :key="tx.id">
        <md-table-cell>{{ getStatus(tx) }}</md-table-cell>
        <md-table-cell>{{ getFromTo(tx)}}: 
          <nuxt-link v-if="getFromToId(tx)" :to="{ name: 'id', params: { id: getFromToId(tx) } }">
            {{ getFromToId(tx) }}
          </nuxt-link>
          <span v-else>unknown</span>
        </md-table-cell>
        <md-table-cell>{{ getTime(tx) }}</md-table-cell>
        <md-table-cell><md-icon v-if="isTxFailed(tx)">error</md-icon>{{ getValue(tx) }}</md-table-cell>
        <md-table-cell>
          <nuxt-link :to="{
            name: isTokensale(tx) ? 'in-tokensale-tx-id' : 'in-tx-id',
            params: { id: tx.id },
          }">
            view
          </nuxt-link>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <a v-if="hasMore" href="" @click.prevent="onShowMore">Show more</a>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import { ETH_TO_LIKECOIN_RATIO, ONE_LIKE } from '@/constant';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import { mapActions } from 'vuex';

function getLikeCoinByETH(eth) {
  return new BigNumber(eth).dividedBy(ONE_LIKE)
    .multipliedBy(new BigNumber(ETH_TO_LIKECOIN_RATIO));
}

function getLikeCoinByValue(value) {
  return new BigNumber(value).dividedBy(ONE_LIKE);
}

export default {
  name: 'Edit',
  layout: 'baseWithBackground',
  props: ['address', 'showTokensale'],
  data() {
    return {
      ICOTotalCoin: 0,
      ICOTotalETH: 0,
      txHistory: [],
      hasMore: true,
    };
  },
  methods: {
    ...mapActions([
      'queryTxHistoryByAddr',
    ]),
    getStatus(tx) {
      if (this.isTokensale(tx)) return 'tokensale';
      if (tx.status === 'pending') return 'pending';
      if (tx.status === 'timeout') return 'expired';
      if (tx.type === 'claimCoupon') return 'coupon';
      if (tx.to === this.address) return 'in';
      if (tx.from === this.address) return 'out';
      return '';
    },
    getValue(tx) {
      if (this.isTokensale(tx)) {
        return `${getLikeCoinByValue(tx.value) || 0} ETH -> ${getLikeCoinByETH(tx.value || 0)} LikeCoin`;
      }
      return `${getLikeCoinByValue(tx.value) || 0} LikeCoin`;
    },
    getFromToId(tx) {
      if (this.isTokensale(tx)) return 'tokensale';
      if (tx.type === 'claimCoupon') return 'coupon';
      const isFrom = (tx.to === this.address);
      return isFrom ? tx.fromId : tx.toId;
    },
    getFromTo(tx) {
      if (this.isTokensale(tx)) return 'From';
      const isFrom = (tx.to === this.address);
      return isFrom ? 'From' : 'To';
    },
    getTime(tx) {
      if (tx.status === 'pending') return 'pending';
      if (tx.status === 'timeout') return 'expired';
      return tx.completeTs ? (new Date(tx.completeTs)).toString() : '';
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
        if (!this.txHistory || !this.txHistory.length) this.hasMore = false;
      } catch (err) {
        console.error(err);
      }
    },
  },
};

</script>
