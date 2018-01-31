<template>
  <div class="payment-container">
    <avatar-header :title="displayName" :icon="avatar" :id="id" :address="wallet"/>
    <div class="inner-container">
      <form id="paymentInfo" v-on:submit.prevent="onSubmit">
        <input v-model="wallet" hidden required disabled />
        <label>Amount of LikeCoin to send</label>
        <md-field :class="isBadAmount?'md-input-invalid':''">
          <md-button class="value-button" @click="onAmountAdd(-1)"><md-icon class="md-size-2x">remove</md-icon></md-button>
          <md-input id="payment-input"
            pattern="[0-9]*(\.[0-9]*)?"
            title="Please enter a valid decimal number"
            :value="amount"
            @keypress="onAmountKeypress"
            @input="onAmountInput"
            @focusout="formatAmount"
            required />
          <md-button class="value-button" @click="onAmountAdd(1)"><md-icon class="md-size-2x">add</md-icon></md-button>
          <span v-if="isBadAmount" class="md-error">Invalid amount</span>
        </md-field>
        <!-- <md-field> -->
        <!--   <md-input placeholder="Remark (optional)" /> -->
        <!-- </md-field> -->
        <md-button id="payment-confirm" class="md-raised md-primary" type="submit" form="paymentInfo" :disabled="getIsInTransaction || !getLocalWallet">Confirm</md-button>
      </form>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import AvatarHeader from '~/components/AvatarHeader';
import EthHelper from '@/util/EthHelper';
import axios from '~/plugins/axios';
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
  name: 'payment',
  layout: 'pay',
  components: {
    AvatarHeader,
  },
  data() {
    return {
      isBadAddress: false,
      isBadAmount: false,
      dialogHeader: 'Success',
      dialogMsg: '',
    };
  },
  asyncData({ params, error }) {
    return axios.get(`/api/users/${params.id}`)
      .then((res) => {
        const { wallet, avatar, displayName } = res.data;
        const amount = formatAmount(params.amount || 1);
        return {
          wallet,
          avatar,
          id: params.id,
          displayName: displayName || params.id,
          amount,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: 'User not found' });
      });
  },
  head() {
    return {
      title: `Send LikeCoin to ${this.displayName} - LikeCoin Store`,
      meta: [
        { hid: 'description', name: 'description', content: `Send LikeCoin to ${this.displayName}` },
        { hid: 'og_description', property: 'og:description', content: `Send LikeCoin to ${this.displayName}` },
        { hid: 'og_image', property: 'og:image', content: `${this.avatar}` },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getIsInTransaction',
      'getLocalWallet',
      'getIsShowingTxPopup',
    ]),
  },
  methods: {
    ...mapActions([
      'sendPayment',
      'setErrorMsg',
      'closeTxDialog',
    ]),
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    async onSubmit() {
      this.isBadAddress = false;
      if (!this.checkAddress()) {
        this.isBadAddress = true;
        return;
      }
      const amount = new BigNumber(this.amount);
      if (!amount || amount.lt('0.000000000000000001')) {
        this.isBadAmount = true;
        return;
      }
      try {
        if (!EthHelper.getWallet()) return;
        const balance = await EthHelper.queryLikeCoinBalance(EthHelper.getWallet());
        const valueToSend = ONE_LIKE.mul(new BigNumber(this.amount));
        if ((new BigNumber(balance)).lt(valueToSend)) {
          this.setErrorMsg('Insufficient LikeCoin in your wallet!');
          return;
        }
        const payload = await EthHelper.signTransferDelegated(this.wallet, valueToSend, 0);
        const txHash = await this.sendPayment(payload);
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          this.$router.push({ name: 'tx-id', params: { id: txHash } });
        }
      } catch (error) {
        console.error(error);
      }
    },
    onConfirm() {
      if (!this.getUserIsRegistered) this.$router.push({ name: 'register' });
    },
    onAmountAdd(diff) {
      let newAmount = new BigNumber(this.amount).add(diff);
      if (newAmount.lt(0)) {
        newAmount = new BigNumber(0);
      }
      this.amount = newAmount.toFixed();
      this.formatAmount();
    },
    onAmountKeypress(e) {
      if (e.code === 'Enter') {
        return;
      }
      if (!/[0-9.]/.test(e.key)) {
        e.preventDefault();
        return;
      }
      const { value } = e.target;
      const newValue =
        value.slice(0, e.target.selectionStart) + e.key + value.slice(e.target.selectionEnd);
      if (!/^[0-9]*.?[0-9]*$/.test(newValue)) {
        e.preventDefault();
        return;
      }
      this.amount = newValue;
    },
    onAmountInput(value) {
      this.amount = value;
    },
    formatAmount() {
      this.amount = formatAmount(this.amount);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.inner-container {
  background: #f7f7f7;
  margin: 16px 0;
  padding: 16px 0;
}

.payment-container {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

#paymentInfo {
  margin: 24px 41px 33px 41px;
}

#payment-confirm {
  display: block;
  margin: 0 auto;
  width: 256px;
  height: 40px;
  text-align: center;
  color: #ffffff;
  font-size: 24px;
  background-color: #28646e;
}

.value-button {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 50%;
  position: relative;
  top: calc((76px - 48px) / 2);
}

#payment-input {
  height: 76px;
  text-align: center;
  font-size: 56px;
}
</style>
