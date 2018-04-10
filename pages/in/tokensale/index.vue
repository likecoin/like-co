<template>
  <div class="tokensale-page">

    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <narrow-page-header />

            </div>
          </div>
        </div>

        <div class="lc-container-2-extend">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">

              <section class="countdown-section lc-text-align-center">
                <h1 class="lc-font-size-42 lc-font-weight-600">
                  {{ isPreSale ? $t('TokenSale.preSaleTitle') : $t('TokenSale.title') }} <span class="lc-font-weight-300 lc-color-like-green">LIVE</span>
                </h1>
                <h2 v-if="isPreSale" class="lc-margin-top-12 lc-font-size-38 lc-font-weight-300">
                  {{ $t('TokenSale.label.bonusAndLimitedOffer') }}
                </h2>
                <h3 class="lc-margin-top-12 lc-font-size-14 lc-font-weight-400">
                  {{ isPreSale ? $t('TokenSale.label.limitedOfferCondition') : $t('TokenSale.label.publicSaleStartIn') }}
                </h3>
                <!-- <countdown-timer :date="SALE_DATE" /> -->
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">

          <div v-if="!isPreSale" class="tokensale-progress-wrapper lc-container-3 lc-bg-gray-1 lc-verticle-inset-4">
            <tokensale-progress
              :progress="currentTokenSaleAmount.toFixed(2)"
              :total="maxTokenSaleAmount.toFixed(2)"/>

            <div class="lc-container-4">
              <div class="tokensale-amount lc-verticle-inset-2 lc-text-align-center">
                <span class="current lc-color-like-green lc-font-size-46 lc-font-weight-300">{{ currentTokenSaleAmount }}</span>
                <span class="max lc-font-size-20 lc-font-weight-400"> / {{ maxTokenSaleAmount }} ETH</span>
              </div>
            </div>
          </div>
          <div v-else class="tokensale-presale-wrapper lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">
              {{ $t('TokenSale.label.amountWillBeSentWhenSalesStart')}}
            </div>
          </div>

          <section class="token-info-section lc-margin-top-8">
            <div class="lc-container-3 lc-bg-gray-1">
              <div class="lc-container-4 lc-verticle-inset-4">
                <div class="info-grid">
                  <ul>
                    <li>
                      <div>
                        <span class="label">{{ $t('TokenSale.label.token') }}</span>
                        <span class="value highlight" >
                          LIKE
                        </span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span class="label">{{ $t('TokenSale.label.exchangeRate') }}</span>
                        <span class="value">1 ETH / 40,000 LIKE</span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <span class="label">{{ $t('TokenSale.label.supply') }}</span>
                        <span class="value">600,000,000</span>
                      </div>
                    </li>
                    <li class="what-is-eth">
                      <a
                        :href="$t('TokenSale.label.whatIsEthLink')"
                        ref="noopener"
                        target="_blank">
                        <span class="lc-font-size-12">{{ $t('TokenSale.label.whatIsETH') }}</span>
                        <img :src="QuestionIcon" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        <div v-if="canICO" class="lc-container-2">
          <div class="lc-container-3 lc-bg-transparent">
            <div class="lc-container-4 lc-padding-top-16 lc-text-align-center">
              <nuxt-link
                class="lc-font-size-12 lc-underline"
                :to="{ name: 'in-backer' }">
                {{ $t('TokenSale.button.noETH') }}
              </nuxt-link>
            </div>
          </div>
        </div>
      </section>

      <!-- KYC Sections start -->
      <section
        v-if="getUserIsFetching || isKYCTxPass===undefined"
        class="lc-container-1 lc-padding-vertical-32">
        <div class="lc-container-2">
          <md-progress-bar md-mode="indeterminate" />
        </div>
      </section>

      <section
        class="lc-container-1 lc-section-block"
        v-else-if="!getUserIsRegistered"
      >
        <div class="lc-container-header">
          <div class="lc-container-2">
            <div class="lc-container-3 lc-bg-gray-1 create-account-wrapper">
              <p class="lc-color-like-gray-4 lc-text-align-center">
                {{ $t('KYC.label.createID') }}
              </p>
              <material-button @click="redirectToRegister">
                {{ $t('KYC.button.createID') }}
              </material-button>
              <p>
                <a
                  class="lc-color-like-gray-4 lc-underline"
                  href="#"
                  @click="showLoginWindow">
                  {{ $t('Home.Header.button.signIn') }}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="lc-container-1 lc-section-block" v-else>
        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3 lc-bg-gray-1" />
          </div>

          <div class="lc-container-2">
            <div class="lc-container-header-title">
              <h1 class="lc-font-size-32 lc-mobile">
                {{ isPreSale ? $t('TokenSale.label.joinPreSale') : $t('TokenSale.label.prepareToJoin') }}
              </h1>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-24">
              <div class="inner-container">
                <section>
                  <KYCForm
                    :isKYCTxPass="isKYCTxPass"
                    :isPreSale="isPreSale"
                    :user="getUserInfo"
                    :wallet="getLocalWallet"
                    @showPaymentForm="handleShowPaymentForm" />
                </section>

                <section v-if="isPreSale && canICO" class="like-coin-rate-section lc-padding-top-24 lc-padding-botton-0 lc-mobile">
                  <div>
                    <div class="title">
                      {{ $t('TokenSale.label.amountLikeToPurhcase') }}
                    </div>
                    <md-field class="lc-padding-top-8 lc-padding-top-0-mobile">
                      <div class="coin-value-wrapper lc-padding-bottom-8 lc-padding-bottom-0-mobile">
                        <span>LIKE</span>
                        <md-input
                          :value="preSaleBase"
                          @keypress="onAmountKeypress"
                          @input="onAmountInput" />
                      </div>
                    </md-field>
                  </div>

                  <img class="add-sign" :src="AddIcon" />

                  <div>
                    <div class="title">
                      {{ $t('TokenSale.label.bonus') }}
                    </div>
                    <md-field class="lc-padding-top-8 lc-padding-top-0-mobile">
                      <div class="coin-value-wrapper lc-padding-bottom-8 lc-padding-bottom-0-mobile">
                        <span>LIKE</span>
                        <md-input :value="preSaleBonus" disabled />
                      </div>
                    </md-field>
                    <div class="remark lc-padding-top-8 lc-color-like-gray-4 lc-font-size-12">
                      {{ $t('TokenSale.label.bonusLockUp') }}
                    </div>
                  </div>

                </section>

                <!-- <section v-else-if="KYCStatus==KYC_STATUS_ENUM.PENDING">
                  <md-progress-bar md-mode="indeterminate" />
                  KYC ALREADY PENDING
                </section> -->
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="canICO && !needExtraKYC && shouldShowPaymentForm" class="lc-container-1 lc-verticle-inset-3">
        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-24">
              <div class="inner-container">
                <form
                  id="paymentInfo"
                  v-on:submit.prevent="onSubmit">
                  <input v-model="wallet" hidden required disabled />
                  <div class="lc-padding-bottom-24 lc-mobile">
                    <number-input
                      currencyTitle="ETH"
                      :amount="displayAmount"
                      :decimalPlaceLimit="4"
                      :isBadAmount="isBadAmount"
                      :badAmountMessage="$t('TokenSale.label.tokensaleBadAmount')"
                      :label="$t('Transaction.label.amountToSend', { coin: isEth ? 'ETH' : 'LikeCoin' })"
                      @onChange="handleAmountChange"
                    />
                  </div>
                  <!-- <md-field>
                    <md-input placeholder="Remark (optional)" />
                  </md-field> -->
                  <div class="lc-verticle-inset-4">
                    <material-button
                      id="payment-confirm"
                      type="submit"
                      form="paymentInfo"
                      :disabled="getIsInTransaction || !getLocalWallet">
                      <div class="button-content-wrapper">
                        <img :src="EthIcon" />
                        {{ $t('General.button.send') }}
                      </div>
                    </material-button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

    <popup-dialog
      :allowClose="false"
      :header="$t('KYC.label.kyc')"
      :message="popupMessage"
      @onConfirm="popupMessage=''"
    />
  </div>
</template>


<script>
import BigNumber from 'bignumber.js';

import CountdownTimer from '~/components/CountdownTimer';
import KYCForm from '~/components/KYCForm';
import NumberInput from '~/components/NumberInput';
import MaterialButton from '~/components/MaterialButton';
import PopupDialog from '~/components/dialogs/PopupDialog';
import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import TokenSaleProgress from '~/components/TokenSaleProgress';

import AddIcon from '@/assets/icons/add.svg';
import EthIcon from '@/assets/tokensale/eth.svg';
import QuestionIcon from '@/assets/tokensale/question.svg';

import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';
import { LIKE_COIN_ICO_ADDRESS, LIKE_COIN_PRESALE_ADDRESS } from '@/constant/contract/likecoin-ico';
import {
  ETH_TO_LIKECOIN_RATIO,
  ETHERSCAN_HOST,
  INITIAL_TOKENSALE_ETH,
  KYC_USD_LIMIT,
  KYC_STATUS_ENUM,
  ONE_LIKE,
  SALE_DATE,
} from '@/constant';
import { logTrackerEvent } from '@/util/EventLogger';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'tokensale',
  layout: 'narrowWithHeader',
  components: {
    'tokensale-progress': TokenSaleProgress,
    CountdownTimer,
    KYCForm,
    MaterialButton,
    NarrowPageHeader,
    NumberInput,
    PopupDialog,
  },
  data() {
    return {
      AddIcon,
      EthIcon,
      QuestionIcon,

      KYC_STATUS_ENUM,
      SALE_DATE,
      ETH_TO_LIKECOIN_RATIO,
      LIKE_CONTRACT_ADDRESS: `${ETHERSCAN_HOST}/address/${LIKE_COIN_ADDRESS}`,

      isBadAddress: false,
      isBadAmount: false,
      isEth: true,
      isKYCTxPass: undefined,
      shouldShowPaymentForm: true,

      needExtraKYC: false,
      id: 'tokensale',
      displayName: 'LikeCoin TokenSale',
      displayAmount: this.$route.params.amount || '0.00',
      amount: this.$route.params.amount || '0.00',
      preSaleBase: '0',
      popupMessage: '',
      currentTokenSaleAmount: INITIAL_TOKENSALE_ETH,
      maxTokenSaleAmount: new BigNumber('12600'),
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
    wallet() {
      return this.isPreSale ? LIKE_COIN_PRESALE_ADDRESS : LIKE_COIN_ICO_ADDRESS;
    },
    isPreSale() {
      return (new Date() < SALE_DATE);
    },
    preSaleBonus() {
      if (!this.preSaleBase || Number(this.displayAmount) < 10) return new BigNumber(0);
      const preSaleBase = new BigNumber(this.preSaleBase);
      return preSaleBase.multipliedBy(new BigNumber(0.25)).toString();
    },
    canICO() {
      return this.isKYCTxPass && this.KYCStatus >= KYC_STATUS_ENUM.STANDARD;
    },
    KYCStatus() {
      return this.getUserInfo.KYC;
    },
    pendingKYC() {
      return this.getUserInfo.pendingKYC || false;
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
      'fetchAdvancedKYC',
      'refreshUser',
      'sendEthPayment',
      'queryEthPrice',
      'setErrorMsg',
      'closeTxDialog',
      'showLoginWindow',
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
      if (!amount || amount.lt('0.1') || amount.gte('10000')) {
        this.isBadAmount = true;
        return;
      }
      this.isBadAmount = false;
      const usdPrice = await this.queryEthPrice();
      const usdAmount = usdPrice * this.amount;
      if (!this.isPreSale
        && usdAmount > KYC_USD_LIMIT
        && this.getUserInfo.KYC < KYC_STATUS_ENUM.ADVANCED) {
        this.popupMessage = this.$t('KYC.label.advKycNeeded');
        this.needExtraKYC = true;
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
          const value = valueToSend;
          await this.sendEthPayment({
            from,
            to,
            txHash,
            value,
            isPreSale: this.isPreSale,
          });
        } else {
          const payload = await EthHelper.signTransferDelegated(to, valueToSend, 0);
          txHash = await this.sendPayment(payload);
        }
        try {
          logTrackerEvent(
            this,
            'Tokensale',
            'buyLikeCoin',
            'buy LikeCoin on tokensale page',
            Number(this.amount),
          );
          if (this.preSaleBonus && this.preSaleBonus !== '0') {
            logTrackerEvent(
              this,
              'Tokensale',
              'buyLikeCoinEarilybird',
              'buy LikeCoin on tokensale page (is Early Bird)',
              Number(this.amount),
            );
          }
        } catch (err) {
          // just to prevent anything wrong from Number(this.amount)
        }
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          this.$router.push({ name: 'in-tx-id', params: { id: txHash, tx: this.getPendingTxInfo } });
        }
      } catch (error) {
        console.error(error);
      }
    },
    redirectToRegister() {
      this.$router.push({ name: 'in-register', query: { ref: 'in-tokensale' } });
    },
    async checkStatus() {
      if (this.getUserIsRegistered) {
        this.isKYCTxPass = await EthHelper.queryKYCStatus(this.getLocalWallet);
        if (this.getUserInfo.pendingKYC) {
          const { status } = this.fetchAdvancedKYC(this.getUserInfo.user);
          if (status === 'CLEARED' || status === 'ACCEPTED') this.refreshUser();
        }
      } else {
        this.isKYCTxPass = null;
      }
      if (this.canICO
        && !this.needExtraKYC
        && this.shouldShowPaymentForm) {
        const balance = await EthHelper.queryEthBalance();
        if (!balance || balance === '0') this.triggerIntercom();
      }
    },
    triggerIntercom() {
      if (this.$intercom) {
        this.$router.push({ query: Object.assign({}, this.$route.query, { interested: 'true' }) });
        this.$intercom.update();
        this.$intercom.show();
      }
    },
    async updateTokenSaleProgress() {
      const amount = await EthHelper.queryEthBalance(LIKE_COIN_ICO_ADDRESS);
      this.currentTokenSaleAmount = new BigNumber(amount).dividedBy(ONE_LIKE)
        .plus(INITIAL_TOKENSALE_ETH);
    },
    handleAmountChange(value) {
      this.displayAmount = value;
      this.amount = value.toString();
      if (!this.displayAmount) {
        this.preSaleBase = '0';
        return;
      }
      let newValue;
      try {
        newValue = (new BigNumber(ETH_TO_LIKECOIN_RATIO))
          .multipliedBy(new BigNumber(value));
      } catch (err) {
        newValue = new BigNumber(0);
      }
      this.preSaleBase = newValue.toString();
    },
    handleShowPaymentForm(show) {
      this.shouldShowPaymentForm = show;
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
      this.preSaleBase = newValue;
    },
    onAmountInput(likeAmount) {
      try {
        const amount = new BigNumber(likeAmount).dividedBy(ETH_TO_LIKECOIN_RATIO);
        this.amount = amount.toString();
        this.displayAmount = amount.dp(4);
        this.isBadAmount = false;
      } catch (err) {
        this.displayAmount = '0';
      }
    },
  },
  watch: {
    getUserIsFetching(f) {
      if (!f) {
        this.checkStatus();
      }
    },
  },
  mounted() {
    if (!this.getUserIsFetching) this.checkStatus();
    this.updateTokenSaleProgress();
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";
@import "~assets/default";
@import "~assets/input";

.tokensale-page {
  ul {
    padding: 0;

    list-style-type: none;
  }

  li {
    display: inline-block;

    margin: 0 10px;
  }

  .create-account-wrapper {
    text-align: center;
    background-color: transparent;

    p {
      max-width: 422px;
      margin: auto;
    }
    .md-button {
      width: 256px;
      margin-top: 32px;
    }
  }
}

.tokensale-progress-wrapper {
  padding-right: 0;
  padding-left: 0;

  > div {
    margin-right: -8px;
    margin-left: -8px;
  }
}

.tokensale-presale-wrapper {
  text-align: center;
}

.tokensale-amount {
  text-align: center;

  font-weight: 300;

  .current {
    color: $like-green;

    font-size: 46px;
    line-height: 62px;
  }

  .max {
    font-size: 20px;
    font-weight: 400;
  }
}


.token-info-section {
  .lc-container-3 {
    @media (min-width: 601px) {
      padding-right: 0;
    }
  }

  .info-grid {
    > ul {
      display: flex;
      flex-wrap: wrap;

      margin: -20px -10px;
      padding: 0;

      list-style: none;

      @media (max-width: 600px) {
        justify-content: center;

        margin: -12px;
      }
      @media (max-width: 480px) {
        flex-direction: column;
      }

      > li {
        flex-shrink: 0;

        margin: 20px 10px;

        @media (max-width: 600px) {
          margin: 12px;
        }

        > div {
          margin: -4px;

          @media (max-width: 480px) {
            display: flex;
            justify-content: space-between;
          }

          .highlight {
            color: #28646e;

            font-weight: 600 !important;
          }

          > a, span {
            display: block;

            margin: 4px;

            &.label {
              font-size: 14px;
              font-weight: 400;
            }

            &.value {
              font-size: 20px;
              font-weight: 300;

              @media (max-width: 480px) {
                text-align: right;
              }
            }
          }

          a {
            text-decoration: none;

            &:hover {
              opacity: .7;
            }
          }
        }

        &.what-is-eth {
          display: flex;
          align-items: center;
          flex-grow: 1;

          a {
            display: flex;
            flex-direction: row;

            text-decoration: underline;

            span {
              flex-shrink: 0;
            }
            img {
              margin-left: 8px;
            }
          }

          @media (max-width: 600px) {
            justify-content: center;
          }
        }
      }
    }
  }
}

.like-coin-rate-section {
  display: flex;
  flex-direction: row;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }

  > div {
    flex: 1;

    @media (max-width: 600px) {
      max-width: 200px;
    }

    .title {
      color: $like-dark-brown-1;

      @media (max-width: 600px) {
        text-align: center;
      }
    }

    .md-field {
      &.md-disabled::after {
        background-image: none;
      }

      .coin-value-wrapper {
        display: flex;
        align-items: center;

        .md-input {
          font-size: 34px;
          width: 160px;
          height: 100%;
          text-align: right;
          margin-left: 8px;
        }
      }
    }
  }

  .add-sign {
    margin: 32px;
    width: 24px;

    @media (max-width: 600px) {
      margin: 16px;
      width: 18px;
    }
  }
}

#paymentInfo {
  .presale-description {
    color: $like-dark-brown-1;
    text-align: center;
  }

  #payment-confirm {
    display: block;

    width: 256px;
    height: 40px;
    margin: 0 auto;

    text-transform: none;

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
