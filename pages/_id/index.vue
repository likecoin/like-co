<template>
  <div class="payment-container">
    <avatar-header :title="displayName" :icon="avatar" :id="id" :address="wallet" :isEth="isEth"/>
    <div class="inner-container">
      <form id="paymentInfo" v-on:submit.prevent="onSubmit">
        <input v-model="wallet" hidden required disabled />
        <div class="number-input">
          <number-input
            :currencyTitle="isEth ? 'ETH' : ''"
            :amount="amount"
            :isBadAmount="isBadAmount"
            :label="$t('Transaction.label.amountToSend', { coin: isEth ? 'ETH' : 'LikeCoin' })"
            @onChange="handleAmountChange"
          />
        </div>
        <!-- <md-field> -->
        <!--   <md-input placeholder="Remark (optional)" /> -->
        <!-- </md-field> -->
        <material-button v-if="isEth"
          id="payment-confirm"
          class="md-raised md-primary eth"
          type="submit"
          form="paymentInfo"
          :disabled="getIsInTransaction || !getLocalWallet">
          <div class="button-content-wrapper">
            <img :src="EthIcon" />
            {{ $t('General.button.send') }}
          </div>
        </material-button>
        <md-button v-else
          id="payment-confirm"
          class="md-raised md-primary likecoin"
          type="submit"
          form="paymentInfo"
          :disabled="getIsInTransaction || !getLocalWallet">
          {{ $t('General.button.confirm') }}
        </md-button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

import AvatarHeader from '~/components/header/AvatarHeader';
import NumberInput from '~/components/NumberInput';
import EthIcon from '@/assets/tokensale/eth.svg';
import MaterialButton from '~/components/MaterialButton';

import EthHelper from '@/util/EthHelper';
import { apiGetUserById } from '@/util/api/api';

import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';


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
    NumberInput,
    MaterialButton,
  },
  data() {
    return {
      EthIcon,
      isBadAddress: false,
      isBadAmount: false,
    };
  },
  asyncData({ params, redirect, error }) {
    if (params.id !== params.id.toLowerCase()) {
      redirect({ name: 'id', params: { id: params.id.toLowerCase() } });
    }
    return apiGetUserById(params.id)
      .then((res) => {
        const { wallet, avatar, displayName } = res.data;
        const amount = formatAmount(params.amount || 1);
        if (wallet === LIKE_COIN_ICO_ADDRESS) {
          redirect({
            name: 'in-tokensale',
          });
        }
        return {
          wallet,
          avatar,
          id: params.id,
          displayName: displayName || params.id,
          amount,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: '' });
      });
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
    ...mapGetters([
      'getUserIsRegistered',
      'getIsInTransaction',
      'getLocalWallet',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
    ]),
    isEth() {
      /* HACK because nuxt cannot easily pass route with params */
      return this.$route.name === 'id-eth' || this.$route.name === 'id-eth-amount';
    },
  },
  methods: {
    ...mapActions([
      'sendPayment',
      'sendEthPayment',
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
      this.isBadAmount = false;
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
          const value = valueToSend;
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
          this.$router.push({ name: 'in-tx-id', params: { id: txHash, tx: this.getPendingTxInfo } });
        }
      } catch (error) {
        console.error(error);
      }
    },
    onAmountInput(value) {
      this.amount = value;
    },
    handleAmountChange(value) {
      this.amount = value;
    },
  },
};
</script>

<style lang="scss" scoped>
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
  margin: 0 40px 16px;

  .number-input {
    margin: 16px 0 40px;
  }
}

#payment-confirm {
  display: block;

  width: 256px;
  height: 40px;
  margin: 0 auto;

  text-transform: none;
}

#payment-confirm.likecoin {
  color: #ffffff;
  font-size: 24px;
  background-color: #28646e;
  text-transform: none;
}

#payment-confirm.eth {

  background-image: linear-gradient(261deg, #a8a8a8, #6886a1);

  .button-content-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;

    img {
      position: absolute;
      top: 8px;
      left: 16px;
    }
  }
}
</style>
