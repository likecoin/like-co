<template>
  <div class="payment-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <narrow-page-header :icon="avatar" />

            </div>
          </div>
        </div>

        <div :class="['lc-container-2-extend', { ether: isEth }]">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">

              <section class="lc-text-align-center">
                <h1
                  class="lc-font-size-42 receiver-title"
                  v-html="$t('Transaction.label.sendTo', { title: displayName, coin: isEth ? 'ETH' : 'LikeCoin' })"
                  />
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <section v-if="id" class="address-container">
                <div class="address-title">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <div class="address-content">{{ id }}</div>
              </section>
              <section v-if="wallet" class="address-container">
                <div class="address-title">
                  {{ $t('Transaction.label.recipientAddress') }}
                </div>
                <div class="address-content">{{ wallet }}</div>
              </section>

            </div>
          </div>
        </div>

      </section>

      <!-- BEGIN - Send LikeCoin Section -->
      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

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
                  :disabled="getIsInTransaction">
                  <div class="button-content-wrapper">
                    <img :src="EthIcon" />
                    {{ $t('General.button.send') }}
                  </div>
                </material-button>

                <div v-else-if="!getUserIsRegistered" class="create-account-wrapper">
                  <p>{{ $t('KYC.label.createID') }}</p>
                  <material-button @click="$router.push({ name: 'in-register'})">
                    {{ $t('KYC.button.createID') }}
                  </material-button>
                  <p><a href="#" @click="showLoginWindow">{{ $t('Home.Header.button.signIn') }}</a></p>
                </div>

                <div v-else>
                  <p v-if="!isSupportTransferDeleteaged">{{ $t('Transaction.error.notSupported') }}</p>
                  <material-button
                    id="payment-confirm"
                    class="md-raised md-primary likecoin"
                    type="submit"
                    form="paymentInfo"
                    :disabled="getIsInTransaction || !isSupportTransferDeleteaged ||  (!getLocalWallet)">
                    {{ $t('General.button.confirm') }}
                  </material-button>
                </div>

              </form>

            </div>
          </div>
        </div>

      </section>
      <!-- END - Send LikeCoin Section -->
    </div>

    <tool-bars :disableError="['web3', 'testnet', 'locked']" />
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

import EthIcon from '@/assets/tokensale/eth.svg';
import MaterialButton from '~/components/MaterialButton';
import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import NumberInput from '~/components/NumberInput';
import ToolBars from '~/components/toolbars/ToolBars';

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
  layout: 'narrowWithHeader',
  components: {
    MaterialButton,
    NarrowPageHeader,
    NumberInput,
    ToolBars,
  },
  data() {
    return {
      EthIcon,
      isBadAddress: false,
      isBadAmount: false,
      isSupportTransferDeleteaged: true,
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
      'getIsInTransaction',
      'getLocalWallet',
      'getUserIsRegistered',
      'getMetamaskError',
      'getWeb3Type',
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
      'showLoginWindow',
      'sendPayment',
      'sendEthPayment',
      'setErrorMsg',
      'closeTxDialog',
    ]),
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    async onSubmit() {
      if (this.getMetamaskError) {
        this.showLoginWindow();
        return;
      }
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
          if (!EthHelper.getIsSupportTransferDelegated()) {
            this.setErrorMsg(this.$t('Transaction.error.notSupported'));
          }
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
  watch: {
    getWeb3Type() {
      this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    },
  },
  mounted() {
    this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.payment-page {
  margin-bottom: 18px;
}

.lc-container-3-extend-bg {
  .ether & {
    background-image: linear-gradient(261deg, #a8a8a8, #6886a1);
  }
}

.receiver-title {
  font-weight: 300;
}

.address-container {
  & + & {
    margin-top: 18px;
  }
}

.address-title {
  margin-bottom: 8px;

  font-size: 14px;
}

.address-content {
  overflow: hidden;

  margin: 0 auto;

  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 20px;
  line-height: 1.2;
}

p {
  max-width: 422px;
  margin: auto;

  text-align: center;

  color: $like-gray-4;
}

.create-account-wrapper {
  .md-button {
    width: 256px;
    margin: 16px 0;
  }
  a {
    text-decoration: underline;

    color: $like-gray-4;
  }
}

#payment-confirm {
  display: block;

  width: 256px;
  height: 40px;
  margin: 0 auto;

  text-transform: none;

  &.likecoin {
    text-transform: none;

    color: $like-white;
    background-color: $like-green;

    font-size: 24px;
  }

  &.eth {
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
}
</style>
