<template>
  <div>
    <transaction-header :isNotFound="isNotFound" :icon="toAvatar"
      :toId="toId" :toAddress="to" :timestamp="timestamp" :amount="amount"/>
    <div class="tx-container" v-if="!isNotFound">
      <section class="tx-info">
        <section v-if="toId" class="section-container">
          <div class="key">Recipient Display Name</div>
          <nuxt-link :to="{ name: 'pay-id', params: { id: toId } }">
            <div class="address value">{{ toId }}</div>
          </nuxt-link>
        </section>
        <section class="section-container">
          <div class="key">Recipient Address</div>
          <a :href="`https://rinkeby.etherscan.io/address/${to}#tokentxns`" target="_blank">
            <div class="address value">{{ to }}</div>
          </a>
        </section>
      </section>
      <section class="extra tx-info">
        <section v-if="fromId" class="section-container">
          <div class="key">Sender Display Name</div>
          <nuxt-link :to="{ name: 'pay-id', params: { id: fromId } }">
            <div class="address value">{{ fromId }}</div>
          </nuxt-link>
        </section>
        <section class="section-container">
          <div class="key">Sender Address</div>
          <a :href="`https://rinkeby.etherscan.io/address/${from}#tokentxns`" target="_blank">
            <div class="address value">{{ from }}</div>
          </a>
        </section>
      </section>
    </div>
    <a :href="`https://rinkeby.etherscan.io/tx/${txId}`" target="_blank">
      <div class="etherscan">view on etherscan</div>
    </a>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import TransactionHeader from '~/components/TransactionHeader';
import { apiCheckIsUser } from '@/util/api/api';
import { mapActions } from 'vuex';

const ONE_LIKE = new BigNumber(10).pow(18);
const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'base',
  data() {
    return {
      isNotFound: false,
      from: '',
      to: '',
      fromId: '',
      toId: '',
      toAvatar: '',
      timestamp: 0,
      amount: 0,
      updateTimer: null,
    };
  },
  head() {
    return {
      title: 'View Transaction State - LikeCoin.Store',
    };
  },
  components: {
    TransactionHeader,
  },
  computed: {
    isCompleted() {
      return !!this.timestamp;
    },
    txId() {
      return this.$route.params.id;
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
          console.log(ts);
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
      }
      if (toData && toData.data) {
        this.toId = toData.data.user;
        this.toAvatar = toData.data.avatar;
      }
    },
  },
  async mounted() {
    this.timestamp = 0;
    try {
      const tx = await EthHelper.getTransferInfo(this.txId);
      /* eslint-disable no-underscore-dangle */
      this.amount = new BigNumber(tx._value).div(ONE_LIKE).toString();
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
<style scoped>

.tx-info {
  width: 100%;
  max-width: 560px;
  background: #f7f7f7;
  margin: 0 auto;
  padding: 17px 0;
}

.tx-info .extra{
  margin: 17px auto;
}

.key {
  font-size: 14px;
  margin: 5px -5px;
}

.value {
  margin: 0 auto;
  text-align: left;
  font-size: 20px;
}

.section-container {
  margin: 17px 41px;
}

.address {
  color: #28646e;
}

.extra {
  margin: 20px auto;
}

.etherscan {
  margin: 20px auto;
  text-align: center;
  width: 100%;
}
</style>
