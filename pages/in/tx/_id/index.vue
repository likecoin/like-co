<template>
  <div>
    <transaction-header
      :isNotFound="isNotFound"
      :failReason="failReason"
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
            {{ $t('Transaction.label.recipientId') }}
          </div>
          <nuxt-link :to="{ name: 'id', params: { id: toId } }">
            <div class="value">{{ toId }}</div>
          </nuxt-link>
        </section>
        <section class="section-container">
          <div class="key">
            {{ $t('Transaction.label.recipientAddress') }}
          </div>
          <a :href="`${ETHERSCAN_HOST}/address/${to}#tokentxns`" target="_blank" rel="noopener">
            <div class="address value">{{ to }}</div>
          </a>
        </section>
      </section>

      <section class="extra tx-info">
        <section v-if="fromId" class="section-container">
          <div class="key">
            {{ $t('Transaction.label.senderName') }}
          </div>
          <nuxt-link :to="{ name: 'id', params: { id: fromId } }">
            <div class="value">{{ fromName }}</div>
          </nuxt-link>
        </section>
        <section class="section-container">
          <div class="key">
            {{ $t('Transaction.label.senderAddress') }}
          </div>
          <a :href="`${ETHERSCAN_HOST}/address/${from}#tokentxns`" target="_blank" rel="noopener">
            <div class="address value">{{ from }}</div>
          </a>
        </section>
      </section>
      <section v-if="remarks" class="extra tx-info">
        <section class="section-container">
          <div class="key">
            {{ $t('Transaction.label.remarks') }}
          </div>
          <div class="value">{{ remarks }}</div>
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
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';

import TransactionHeader from '~/components/header/TransactionHeader';
import ViewEtherscan from '~/components/ViewEtherscan';

import { apiGetTxById, apiCheckIsUser } from '@/util/api/api';

const ONE_LIKE = new BigNumber(10).pow(18);
const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'base',
  data() {
    return {
      isEth: false,
      isNotFound: false,
      /* failReason : 0 = none, 1 = failed, 2 = timeout */
      failReason: 0,
      status: 'pending',
      from: '',
      to: '',
      fromId: '',
      fromName: '',
      toId: '',
      toName: '',
      toAvatar: '',
      remarks: '',
      timestamp: 0,
      value: '', // BN in string
      amount: 0,
      updateTimer: null,
      ETHERSCAN_HOST,
    };
  },
  asyncData({ params, redirect }) {
    if (params.tx && params.tx !== {}) {
      const { to, from, value } = params.tx;
      if (to === LIKE_COIN_ICO_ADDRESS) {
        return redirect({
          name: 'in-tokensale-tx-id',
          params,
        });
      }
      return { to, from, value };
    }
    return apiGetTxById(params.id)
      .then((res) => {
        const {
          to,
          from,
          value,
          status,
          remarks,
        } = res.data;
        if (to === LIKE_COIN_ICO_ADDRESS) {
          return redirect({
            name: 'in-tokensale-tx-id',
            params,
          });
        }
        return {
          to,
          from,
          value,
          status,
          remarks,
        };
      })
      .catch(e => ({})); // eslint-disable-line no-unused-vars
  },
  head() {
    return {
      title: 'View Transaction State - Like.co',
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
  },
  methods: {
    ...mapActions([
      'startLoading',
      'stopLoading',
    ]),
    setupTimer() {
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(async () => {
        const { ts, isFailed } = await EthHelper.getTransactionCompleted(this.txId);
        if (!ts) {
          this.setupTimer();
        } else {
          this.timestamp = ts;
          this.failReason = isFailed ? 1 : 0;
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
    if (this.to) this.updateUI(this.from, this.to);
    if (this.value) {
      this.amount = new BigNumber(this.value).div(ONE_LIKE).toString();
    }
    if (this.status === 'timeout') this.failReason = 2;
    try {
      const tx = await EthHelper.getTransferInfo(this.txId, { blocking: true });
      this.isEth = tx.isEth;
      if (!this.failReason) this.failReason = tx.isFailed ? 1 : 0;
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
@import "~assets/variables";

.tx-info {
  width: 100%;
  max-width: 560px;
  background: $like-gray-1;
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

  .value {
    margin: 0 auto;
    font-size: 20px;
    word-wrap: break-word;
    color: #28646e;
  }

  a {

    &:hover {
      text-decoration: none;
    }

    .value {
      text-align: left;
    }

    .address.value {
      font-size: 19px;
    }
  }
}

.extra {
  margin: 20px auto;
}

</style>
