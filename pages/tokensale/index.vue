<template>
  <div class="payment-container">
    <avatar-header :title="displayName" :icon="avatar" :id="id" :address="wallet" :isEth="isEth"/>
    <div class="inner-container">
      <form id="paymentInfo" v-on:submit.prevent="onSubmit">
        <input v-model="wallet" hidden required disabled />
        <label>{{ $t('Transaction.label.amountToSend', { coin: isEth ? 'ETH' : 'LikeCoin' }) }}</label>
        <md-field :class="isBadAmount?'md-input-invalid':''">
          <md-button class="value-button" @click="onAmountAdd(-1)">
            <md-icon class="md-size-2x">remove</md-icon>
          </md-button>
          <md-input id="payment-input"
            pattern="[0-9]*(\.[0-9]*)?"
            :title="$t('Transaction.label.enterValidNumber')"
            :value="amount"
            @keypress="onAmountKeypress"
            @input="onAmountInput"
            @focusout="formatAmount"
            required />
          <md-button class="value-button" @click="onAmountAdd(1)">
            <md-icon class="md-size-2x">add</md-icon>
          </md-button>
          <span v-if="isBadAmount" class="md-error">
            {{ $t('Transaction.label.invalidAmount') }}
          </span>
        </md-field>
        <!-- <md-field> -->
        <!--   <md-input placeholder="Remark (optional)" /> -->
        <!-- </md-field> -->
        <md-button
          id="payment-confirm"
          class="md-raised md-primary"
          type="submit"
          form="paymentInfo"
          :disabled="getIsInTransaction || !getLocalWallet">
          {{ $t('General.button.confirm') }}
        </md-button>
      </form>
    </div>
    <popup-dialog
      :allowClose="false"
      :header="$t('KYC.label.kyc')"
      :message="popupMessage"
      @onConfirm="goToKYC"/>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

import AvatarHeader from '~/components/header/AvatarHeader';
import PopupDialog from '~/components/dialogs/PopupDialog';
import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';
import { KYC_USD_LIMIT } from '@/constant';
import { mapActions, mapGetters } from 'vuex';
import likeCoinIcon from '@/assets/likecoin.svg';

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
  name: 'tokensale',
  layout: 'pay',
  components: {
    AvatarHeader,
    PopupDialog,
  },
  data() {
    return {
      isBadAddress: false,
      isBadAmount: false,
      isICO: true,
      wallet: LIKE_COIN_ICO_ADDRESS,
      avatar: likeCoinIcon,
      id: 'tokensale',
      displayName: 'LikeCoin TokenSale',
      amount: this.$route.params.amount || 0,
      popupMessage: '',
    };
  },
  head() {
    return {
      title: this.$t('Transaction.head.title', { name: this.displayName }),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Transaction.head.title', { name: this.displayName }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Transaction.head.description', { name: this.displayName }),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Transaction.head.description', { name: this.displayName }),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: `${this.avatar}`,
        },
      ],
    };
  },
  computed: {
    isEth() {
      return this.isICO;
    },
    ...mapGetters([
      'getUserIsFetching',
      'getUserIsRegistered',
      'getUserInfo',
      'getIsInTransaction',
      'getLocalWallet',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
    ]),
  },
  methods: {
    ...mapActions([
      'sendPayment',
      'sendEthPayment',
      'queryEthPrice',
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
      const usdPrice = await this.queryEthPrice();
      const usdAmount = usdPrice * this.amount;
      if (usdAmount > KYC_USD_LIMIT) {
        this.popupMessage = this.$t('KYC.label.advKycNeeded');
        return;
      }
      try {
        if (!EthHelper.getWallet()) return;
        let balance = 0;
        const from = EthHelper.getWallet();
        const to = this.wallet;
        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          return;
        }
        if (this.isEth) {
          balance = await EthHelper.queryEthBalance(from);
        } else {
          balance = await EthHelper.queryLikeCoinBalance(from);
        }
        const valueToSend = ONE_LIKE.multipliedBy(new BigNumber(this.amount));
        if ((new BigNumber(balance)).lt(valueToSend)) {
          this.setErrorMsg(this.$t(`Transaction.error.${this.isEth ? 'eth' : 'likecoin'}Insufficient`));
          return;
        }
        let txHash;
        if (this.isEth) {
          txHash = await EthHelper.sendTransaction(to, valueToSend);
          const value = this.amount;
          await this.sendEthPayment({
            from,
            to,
            txHash,
            value,
          });
        } else {
          const payload = await EthHelper.signTransferDelegated(to, valueToSend, 0);
          txHash = await this.sendPayment(payload);
        }
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          this.$router.push({ name: 'tx-id', params: { id: txHash, tx: this.getPendingTxInfo } });
        }
      } catch (error) {
        console.error(error);
      }
    },
    onConfirm() {
      if (!this.getUserIsRegistered) this.$router.push({ name: 'register' });
    },
    onAmountAdd(diff) {
      let newAmount = new BigNumber(this.amount).plus(diff);
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
    async checkKYCStatus() {
      const isKYC = await EthHelper.queryKYCStatus(this.getLocalWallet);
      if (!isKYC) return false;
      const status = this.getUserInfo.KYC;
      return (status > 1);
    },
    async checkAndRedirect() {
      if (!this.getUserIsRegistered) {
        this.$router.push({ name: 'register', query: { ref: 'tokensale' } });
      } else {
        const canICO = await this.checkKYCStatus();
        if (!canICO) this.$router.push({ name: 'tokensale-kyc' });
      }
    },
    goToKYC() {
      this.$router.push({ name: 'tokensale-kyc' });
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        this.checkAndRedirect();
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) this.checkAndRedirect();
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
  color: #ffffff;
  font-size: 24px;
  background-color: #28646e;
  text-transform: none;
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
  width: 0; /* not sure why */
  text-align: center;
  font-size: 56px;
}
</style>
