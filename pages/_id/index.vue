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
                <i18n
                  path="Transaction.label.sendTo"
                  tag="h1"
                  class="lc-font-size-42 lc-font-weight-300 lc-mobile"
                >
                  <span place="coin">{{ isEth ? 'ETH' : 'LikeCoin' }}</span>
                  <span
                    place="title"
                    class="usertitle"
                  >{{ displayName }}</span>
                </i18n>
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              <social-media-connect
                :limit="5"
                :username="id"
                :platforms="platforms"
                class="lc-margin-bottom-16"
                type="readonly"
                center
              />

              <section
                v-if="id"
                class="address-container"
              >

                <div class="address-title">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <div class="address-content">
                  {{ id }}
                </div>
              </section>
              <section
                v-if="wallet"
                class="address-container"
              >
                <div class="address-title">
                  {{ $t('Transaction.label.recipientAddress') }}
                </div>
                <div class="address-content">
                  {{ maskedWallet }}
                </div>
              </section>

            </div>
          </div>
        </div>

      </section>

      <!-- BEGIN - Send LikeCoin Section -->
      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-top-24 lc-padding-bottom-32">

              <form
                v-if="wallet"
                id="paymentInfo"
                @submit.prevent="onSubmitPollForWeb3"
              >
                <input
                  v-model="wallet"
                  hidden
                  required
                  disabled
                >
                <div class="number-input lc-padding-bottom-32">
                  <number-input
                    :currencyTitle="isEth ? 'ETH' : ''"
                    :amount="amount"
                    :isBadAmount="isBadAmount"
                    :label="$t('Transaction.label.amountToSend',
                               { coin: isEth ? 'ETH' : 'LikeCoin' })"
                    @onChange="handleAmountChange"
                  />

                  <p
                    v-if="usdTransferStrValue"
                    class="lc-margin-top-8 lc-text-align-center lc-color-gray-9b"
                  >
                    (${{ usdTransferStrValue }} USD)
                  </p>
                </div>
                <!-- <md-field> -->
                <!--   <md-input placeholder="Remark (optional)" /> -->
                <!-- </md-field> -->

                <material-button
                  v-if="isEth"
                  id="payment-confirm"
                  :disabled="getIsInTransaction"
                  class="md-raised md-primary eth"
                  type="submit"
                  form="paymentInfo"
                >
                  <div class="button-content-wrapper">
                    <img :src="EthIcon">
                    {{ $t('General.button.send') }}
                  </div>
                </material-button>

                <div
                  v-else-if="getUserNeedAuth"
                  class="create-account-wrapper"
                >
                  <md-button
                    class="md-likecoin"
                    @click="showLoginWindow"
                  >
                    {{ $t('Home.Header.button.signIn') }}
                  </md-button>
                </div>

                <div
                  v-else-if="!getUserIsRegistered"
                  class="create-account-wrapper"
                >
                  <p>{{ $t('KYC.label.createID') }}</p>
                  <md-button
                    class="md-likecoin"
                    @click="onClickSignUpButton"
                  >
                    {{ $t('KYC.button.createID') }}
                  </md-button>
                </div>

                <div v-else>
                  <no-ssr>
                    <p v-if="!isSupportTransferDeleteaged">
                      {{ $t('Transaction.error.notSupported') }}
                  </p></no-ssr>
                  <no-ssr>
                    <md-button
                      id="payment-confirm"
                      :class="['md-raised',
                               'md-primary',
                               'likecoin',
                               'md-likecoin',
                               { 'lc-alert': isP2pUnavailable },
                      ]"
                      :disabled="isP2pUnavailable
                        || getIsInTransaction
                        || !isSupportTransferDeleteaged
                      "
                      type="submit"
                      form="paymentInfo"
                    >
                      {{
                        isP2pUnavailable
                          ? $t('Transaction.button.unavailable')
                          : $t('General.button.confirm')
                      }}
                    </md-button>
                  </no-ssr>
                  <p
                    v-if="isP2pUnavailable"
                    class="lc-margin-top-8"
                  >{{ $t('Transaction.label.unavailable') }}</p>
                  <div class="lc-text-align-center lc-margin-top-12">
                    <i18n
                      path="Transaction.label.updateMetamask"
                      tag="p"
                    >
                      <span place="version">4.9.2</span>
                    </i18n>
                    <a
                      :href="$t('Transaction.label.manualProcedureUrl')"
                      class="lc-underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >{{ $t('Transaction.label.manualProcedure') }}</a>
                  </div>
                </div>

              </form>

              <div v-else>
                {{ 'This ID has not binded to any wallet yet. LikeCoin transfer is disallowed.' }}
              </div>
            </div>
          </div>
        </div>

      </section>
      <!-- END - Send LikeCoin Section -->

    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

import NumberInput from '~/components/NumberInput';
import EthIcon from '@/assets/tokensale/eth.svg';
import MaterialButton from '~/components/MaterialButton';
import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import SocialMediaConnect from '~/components/SocialMediaConnect';

import EthHelper from '@/util/EthHelper';
import {
  apiGetUserMinById,
  apiGetSocialListById,
} from '@/util/api/api';

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
    NumberInput,
    MaterialButton,
    NarrowPageHeader,
    SocialMediaConnect,
  },
  data() {
    return {
      EthIcon,
      isBadAddress: false,
      isBadAmount: false,
      isSupportTransferDeleteaged: true,
      isP2pUnavailable: false,
    };
  },
  async asyncData({
    route,
    params,
    query,
    redirect,
    error,
  }) {
    if (params.id !== params.id.toLowerCase()) {
      redirect({ name: route.name, params: { ...params, id: params.id.toLowerCase() }, query });
    }
    const data = await apiGetUserMinById(params.id)
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

    if (data) {
      data.platforms = await apiGetSocialListById(params.id)
        .then(res => res.data)
        .catch(() => {});
    }

    return data;
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
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getIsInTransaction',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getMetamaskError',
      'getWeb3Type',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
      'getLikeCoinUsdNumericPrice',
      'getUserInfo',
      'getLocalWallet',
      'getIsWeb3Polling',
    ]),
    isEth() {
      /* HACK because nuxt cannot easily pass route with params */
      return this.$route.name === 'id-eth' || this.$route.name === 'id-eth-amount';
    },
    maskedWallet() {
      return this.wallet.replace(/(0x.{10}).*(.{10})/, '$1...$2');
    },
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
    usdTransferStrValue() {
      if (this.getLikeCoinUsdNumericPrice && this.amount) {
        const value = new BigNumber(this.amount);
        const usdValue = value.times(this.getLikeCoinUsdNumericPrice);
        let decimalPlace = 2;
        if (usdValue.lt(0.01)) decimalPlace = 4;
        return value.times(this.getLikeCoinUsdNumericPrice).toFixed(decimalPlace);
      }
      return null;
    },
  },
  watch: {
    getWeb3Type() {
      this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    },
    getLocalWallet() {
      if (this.getIsWeb3Polling) {
        this.submitTransfer();
        this.stopWeb3Polling();
      }
    },
  },
  mounted() {
    this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();

    if (!this.getLikeCoinUsdNumericPrice) {
      this.queryLikeCoinUsdPrice();
    }
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
      'sendPayment',
      'sendEthPayment',
      'setErrorMsg',
      'closeTxDialog',
      'queryLikeCoinUsdPrice',
      'startWeb3Polling',
      'stopWeb3Polling',
    ]),
    checkAddress() {
      return this.wallet.length === 42 && this.wallet.substr(0, 2) === '0x';
    },
    async onSubmitPollForWeb3() {
      const isStarted = await this.startWeb3Polling();
      if (!isStarted) {
        this.submitTransfer();
      }
    },
    async submitTransfer() {
      if (this.getMetamaskError) {
        this.showLoginWindow();
        return;
      }
      this.isBadAddress = false;
      if (!this.checkAddress()) {
        this.isBadAddress = true;
        return;
      }
      const { wallet } = this.getUserInfo;
      const amount = new BigNumber(this.amount);
      if (!amount || amount.lt('0.000000000000000001')) {
        this.isBadAmount = true;
        return;
      }
      this.isBadAmount = false;
      try {
        let balance = 0;
        const from = this.getLocalWallet;
        if (!from) {
          return;
        }
        if (from !== wallet) {
          this.setErrorMsg(this.$t('Transaction.error.metamaskWalletNotMatch'));
          return;
        }
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
          payload.httpReferrer = this.httpReferrer;
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
    onClickSignUpButton() {
      this.$router.push({
        name: 'in-register',
        query: { ...this.$route.query, ref: '' },
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-container-3-extend-bg {
  .ether & {
    background-image: linear-gradient(261deg, #a8a8a8, #6886a1);
  }
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

  font-size: 19px;
  line-height: 1.2;
}

p {
  max-width: 432px;
  margin: auto;

  text-align: center;

  color: $like-gray-4;
}

.create-account-wrapper {
  .md-button {
    display: block;

    margin: 16px auto;
  }

  a {
    text-decoration: underline;

    color: $like-gray-4;
  }
}

#payment-confirm {
  display: block;

  margin: 0 auto;

  text-transform: none;

  &.likecoin {
    text-transform: none;

    color: $like-white;

    font-size: 24px;
  }

  &.lc-alert {
    padding: 4px 0;
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
