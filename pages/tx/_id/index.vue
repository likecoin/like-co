<template>
  <div>
    <transaction-header
      :isNotFound="isNotFound"
      :isFailed="isFailed"
      :isEth="isEth"
      :icon="toAvatar"
      :toId="toId"
      :toName="toName"
      :toAddress="to"
      :timestamp="timestamp"
      :amount="amount" />

    <div class="tx-container" v-if="!isNotFound">
      <section class="tx-info">
        <section v-if="toId" class="section-container">
          <div class="key">
            Recipient LikeCoin ID
          </div>
          <nuxt-link :to="{ name: 'id', params: { id: toId } }">
            <div class="address value">{{ toId }}</div>
          </nuxt-link>
        </section>
        <section class="section-container">
          <div class="key">Recipient Address</div>
          <a :href="`${ETHERSCAN_HOST}/address/${to}#tokentxns`" target="_blank">
            <div class="address value">{{ to }}</div>
          </a>
        </section>
      </section>

      <section class="extra tx-info">
        <section v-if="fromId" class="section-container">
          <div class="key">Sender Display Name</div>
          <nuxt-link :to="{ name: 'id', params: { id: fromId } }">
            <div class="address value">{{ fromName }}</div>
          </nuxt-link>
        </section>
        <section class="section-container">
          <div class="key">Sender Address</div>
          <a :href="`${ETHERSCAN_HOST}/address/${from}#tokentxns`" target="_blank">
            <div class="address value">{{ from }}</div>
          </a>
        </section>
      </section>
    </div>
    <view-etherscan :transaction="txId" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import { ETHERSCAN_HOST } from '@/constant';

import TransactionHeader from '~/components/TransactionHeader';
import ViewEtherscan from '~/components/ViewEtherscan';

import { apiCheckIsUser } from '@/util/api/api';

const ONE_LIKE = new BigNumber(10).pow(18);
const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'base',
  data() {
    return {
      isEth: false,
      isNotFound: false,
      isFailed: false,
      from: '',
      to: '',
      fromId: '',
      fromName: '',
      toId: '',
      toName: '',
      toAvatar: '',
      timestamp: 0,
      amount: 0,
      updateTimer: null,
      ETHERSCAN_HOST,
    };
  },
  head() {
    return {
      title: 'View Transaction State - LikeCoin.Store',
    };
  },
  components: {
    TransactionHeader,
    ViewEtherscan,
  },
  computed: {
    isCompleted() {
      return !!this.timestamp;
    },
    txId() {
      return this.$route.params.id;
    },
    txInfo() {
      return this.$route.params.tx;
    },
  },
  methods: {
    ...mapActions([
      'startLoading',
      'stopLoading',
    ]),
    setupTimer() {
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(async () => {
        const ts = await EthHelper.getTransactionCompleted(this.txId);
        if (!ts) {
          this.setupTimer();
        } else {
          this.timestamp = ts;
        }
      }, PENDING_UPDATE_INTERVAL);
    },
    async updateUI(from, to) {
      this.from = from;
      this.to = to;
      this.startLoading();
      const [fromData, toData] = await Promise.all([
        apiCheckIsUser(from).catch(() => {}),
        apiCheckIsUser(to).catch(() => {}),
      ]);
      this.stopLoading();
      if (fromData && fromData.data) {
        this.fromId = fromData.data.user;
        this.fromName = fromData.data.displayName || fromData.data.user;
      }
      if (toData && toData.data) {
        this.toId = toData.data.user;
        this.toName = toData.data.displayName || toData.data.user;
        this.toAvatar = toData.data.avatar;
      }
    },
  },
  async mounted() {
    this.timestamp = 0;
    if (this.txInfo && this.txInfo !== {}) {
      this.updateUI(this.txInfo.from, this.txInfo.to);
      if (this.txInfo.value) {
        this.amount = new BigNumber(this.txInfo.value).div(ONE_LIKE).toString();
      }
    }
    try {
      const tx = await EthHelper.getTransferInfo(this.txId, { blocking: true });
      this.isEth = tx.isEth;
      this.isFailed = tx.isFailed;
      /* eslint-disable no-underscore-dangle */
      if (tx._value !== undefined) this.amount = new BigNumber(tx._value).div(ONE_LIKE).toString();
      this.updateUI(tx._from, tx._to);
      this.timestamp = tx.timestamp;
      if (!this.timestamp) {
        this.setupTimer();
      }
    } catch (err) {
      console.error(err);
      this.isNotFound = true;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "~assets/index.scss";

.tx-info {
  width: 100%;
  max-width: 560px;
  background: #f7f7f7;
  margin: 0 auto;
  padding: 17px 0;

  .extra {
    margin: 17px auto;
  }
}

.section-container {
  margin: 16px 40px;

  .key {
    font-size: 14px;
    margin: 4px 0;
    color: $like-dark-brown-1;
  }

  a {
    color: #28646e;

    &:hover {
      text-decoration: none;
    }

    .value {
      margin: 0 auto;
      text-align: left;
      font-size: 20px;
      word-wrap: break-word;
    }
  }
}

.extra {
  margin: 20px auto;
}

</style>
