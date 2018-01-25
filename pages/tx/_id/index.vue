<template>
  <div class="tx-container">
    <section class="tx-info">
      <section class="section-container">
        <md-progress-spinner v-if="!isCompleted" md-mode="indeterminate"></md-progress-spinner>
        <div>Transaction Complete</div>
        <div>{{ new Date(this.timestamp * 1000) }}</div>
      </section>
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
</template>

<script>
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
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
  layout: 'pay',
  data() {
    return {
      from: '',
      to: '',
      fromId: '',
      toId: '',
      timestamp: 1,
    };
  },
  components: {
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
    async updateSender(addr) {
      this.from = addr;
      const { data: user } = await apiCheckIsUser(addr);
      if (user) {
        this.fromId = user.user;
      }
    },
    async updateRecevier(addr) {
      this.to = addr;
      const { data: user } = await apiCheckIsUser(addr);
      if (user) {
        this.toId = user.user;
        this.setPageHeader({
          // title,
          // subtitle,
          icon: user.avatar,
        });
      }
    },
  },
  async mounted() {
    this.timestamp = 0;
    const tx = await EthHelper.getTransferInfo('0x55c2177f1ed69ff8cd147b80f10966fcd54d918816d69c9ca379ff33e04dd80c');
    console.log(tx);
    /* eslint-disable no-underscore-dangle */
    this.updateSender(tx._from);
    this.updateRecevier(tx._to);
    this.value = new BigNumber(tx._value).div(ONE_LIKE).toString();
    this.timestamp = tx.timestamp;
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
