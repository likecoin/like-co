<template>
  <div>
    <transaction-header :isNotFound="isNotFound" :icon="toAvatar"
      :toId="toId" :toAddress="to" :timestamp="timestamp" :amount="amount"/>
    <div class="tx-container" v-if="!isNotFound">
      <section class="tx-info">
        <section v-if="toId" class="section-container">
          <div class="key">Recipient Display Name</div>
          <div class="address value">{{ toId }}</div>
        </section>
        <section class="section-container">
          <div class="key">Recipient Address</div>
          <div class="address value">{{ to }}</div>
        </section>
      </section>
      <section class="extra tx-info">
        <section v-if="fromId" class="section-container">
          <div class="key">Sender Display Name</div>
          <div class="address value">{{ fromId }}</div>
        </section>
        <section class="section-container">
          <div class="key">Sender Address</div>
          <div class="address value">{{ from }}</div>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import TransactionHeader from '~/components/TransactionHeader';
import PopupDialog from '~/components/PopupDialog';
import { apiCheckIsUser } from '@/util/api/api';
import { mapActions, mapGetters } from 'vuex';

const ONE_LIKE = new BigNumber(10).pow(18);

function formatAmount(amount) {
  let result = amount.toString().replace(/[^0-9.]/, '');
  if (!result) {
    result = '0.00';
  }
  const dotIndex = result.indexOf('.');
  if (dotIndex === -1) {
    result = `${result}.00`;
  } else if (dotIndex === 0) {
    result = `0${result}`;
  }
  const decimals = result.length - result.indexOf('.') - 1;
  if (decimals < 2) {
    const paddingZeros = '00'.substr(0, 2 - decimals);
    result = `${result}${paddingZeros}`;
  }
  return result;
}

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
      timestamp: 1,
      amount: 0,
    };
  },
  components: {
    TransactionHeader,
    PopupDialog,
  },
  computed: {
    isCompleted() {
      return !!this.timestamp;
    },
    ...mapGetters([
      'getUserIsRegistered',
      'getIsLoading',
      'getLocalWallet',
    ]),
  },
  methods: {
    ...mapActions([
      'setPageHeader',
      'setErrorMsg',
    ]),
    formatAmount() {
      this.amount = formatAmount(this.amount);
    },
    async updateUI(from, to) {
      this.from = from;
      this.to = to;
      const [fromData, toData] = await Promise.all([
        apiCheckIsUser(from).catch(() => {}),
        apiCheckIsUser(to).catch(() => {}),
      ]);
      if (fromData.data) {
        this.fromId = fromData.data.user;
      }
      if (toData.data) {
        this.toId = toData.data.user;
        this.toAvatar = toData.data.avatar;
      }
    },
  },
  async mounted() {
    this.timestamp = 0;
    try {
      const tx = await EthHelper.getTransferInfo(this.$route.params.id);
      /* eslint-disable no-underscore-dangle */
      this.amount = new BigNumber(tx._value).div(ONE_LIKE).toString();
      this.updateUI(tx._from, tx._to);
      this.timestamp = tx.timestamp;
    } catch (err) {
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
</style>
