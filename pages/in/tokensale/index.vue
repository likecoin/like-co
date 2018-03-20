<template>
  <div class="tokensale-page">

    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4 ">

              <nav class="nav-menu">
                <span>
                  <nuxt-link :to="{ name: 'whitepaper' }">
                    {{ $t('TokenSale.button.whitePaper') }}
                  </nuxt-link>
                </span>

                <img class="like-coin-token" :src="likeCoinIcon" />

                <span>
                  <nuxt-link to="/">
                    {{ $t('TokenSale.button.aboutLikeCoin') }}
                  </nuxt-link>
                </span>
              </nav>

            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3 lc-container-extend-bg">
            <div class="lc-container-4 lc-verticle-inset-5">

              <section class="countdown-section">
                <h1>{{ isPreSale ? $t('TokenSale.preSaleTitle') : $t('TokenSale.title') }} LIVE </h1>
                <h3>{{ isPreSale ? $t('TokenSale.label.preSaleEndIn') : $t('TokenSale.label.publicSaleStartIn') }}</h3>
                <countdown-timer :date="new Date(SALE_DATE)" />
              </section>

            </div>
          </div>
        </div>

        <div class="lc-container-2">

          <div v-if="!isPreSale" class="tokensale-progress-wrapper lc-container-3 lc-verticle-inset-4">
            <tokensale-progress
              :progress="currentTokenSaleAmount"
              :total="maxTokenSaleAmount"
              :points="points" />

            <div class="lc-container-4">
              <div class="tokensale-amount lc-verticle-inset-2">
                <span class="current">{{ currentTokenSaleAmount.toLocaleString() }}</span>
                <span class="max"> / {{ maxTokenSaleAmount.toLocaleString() }} ETH</span>
              </div>
            </div>
          </div>
          <div v-else class="tokensale-presale-wrapper lc-container-3 lc-verticle-inset-4">
            <h1>{{ $t('TokenSale.label.preSaleBonus') }}</h1>
            <div class="tokensale-amount lc-verticle-inset-2">{{ $t('TokenSale.label.preSaleBonusCondition') }} </div>
          </div>

          <section class="token-info-section">
            <div class="lc-container-3">
              <div class="lc-container-4 lc-verticle-inset-4">
                <div class="info-grid">
                  <ul>
                    <li>
                      <div>
                        <span class="label">{{ $t('TokenSale.label.token') }}</span>
                        <a
                          class="value highlight"
                          :href="LIKE_CONTRACT_ADDRESS"
                          target="_blank">
                          LIKE
                        </a>
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
                        <span class="value">600mil</span>
                      </div>
                    </li>
                    <!-- TODO: wait for a support thread in help centre to introduce ETH -->
                    <!-- <li>
                      <a
                        href="https://google.com/"
                        target="_blank">
                        <span>{{ $t('TokenSale.label.whatIsETH') }}</span>
                        <img :src="QuestionIcon" />
                      </a>
                    </li> -->
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>
      </section>

      <!-- KYC Sections start -->
      <section
        v-if="getUserIsFetching || isKYCTxPass===undefined"
        class="lc-container-1 lc-verticle-inset-5">
        <div class="lc-container-2">
          <md-progress-bar md-mode="indeterminate" />
        </div>
      </section>

      <section
        class="lc-container-1 lc-section-block"
        v-else-if="!getUserIsRegistered"
      >
        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3">
              <div class="create-account-wrapper">
                <p>{{ $t('KYC.label.createID') }}</p>
                <material-button @click="redirectToRegister">
                  {{ $t('KYC.button.createID') }}
                </material-button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="lc-container-1 lc-section-block" v-else>
        <div class="lc-container-header">
          <div class="lc-container-2 lc-container-header-overlay">
            <div class="lc-container-3" />
          </div>

          <div class="lc-container-2">
            <div class="lc-container-header-title">
              <h1>{{ isPreSale ? $t('TokenSale.label.joinPreSale') : $t('TokenSale.label.prepareToJoin') }}</h1>
            </div>
          </div>
        </div>

        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4 lc-verticle-inset-4">
              <div class="inner-container">
                <section>
                  <KYCForm
                    :isKYCTxPass="isKYCTxPass"
                    :isPreSale="isPreSale"
                    :user="getUserInfo"
                    :wallet="getLocalWallet"
                    @showPaymentForm="handleShowPaymentForm" />
                </section>

                <form
                  id="paymentInfo"
                  v-if="canICO && !needExtraKYC && shouldShowPaymentForm"
                  v-on:submit.prevent="onSubmit">
                  <input v-model="wallet" hidden required disabled />
                  <div class="lc-verticle-inset-5">
                    <number-input
                      currencyTitle="ETH"
                      :amount="amount"
                      :isBadAmount="isBadAmount"
                      :label="$t('Transaction.label.amountToSend', { coin: isEth ? 'ETH' : 'LikeCoin' })"
                      @onChange="handleAmountChange"
                    />
                    <div class="presale-description lc-verticle-inset-3" v-if="isPreSale">
                      <div>
                        {{
                          $t('TokenSale.label.preSaleDescription0', {
                            base: preSaleBase,
                            bonus: preSaleBonus,
                          })
                        }}
                      </div>
                      <div>{{ $t('TokenSale.label.preSaleDescription1') }}</div>
                    </div>
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

                <section v-else-if="KYCStatus==KYC_STATUS_ENUM.PENDING">
                  <md-progress-bar md-mode="indeterminate" />
                  KYC ALREADY PENDING
                </section>
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
import NumberInput from '~/components/NumberInput';
import MaterialButton from '~/components/MaterialButton';
import TokenSaleProgress from '~/components/TokenSaleProgress';
import PopupDialog from '~/components/dialogs/PopupDialog';
import KYCForm from '~/components/KYCForm';

import EthIcon from '@/assets/tokensale/eth.svg';
import likeCoinIcon from '@/assets/like-coin.svg';
import QuestionIcon from '@/assets/tokensale/question.svg';

import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ADDRESS } from '@/constant/contract/likecoin';
import { LIKE_COIN_ICO_ADDRESS, LIKE_COIN_PRESALE_ADDRESS } from '@/constant/contract/likecoin-ico';
import { ETHERSCAN_HOST, KYC_USD_LIMIT, KYC_STATUS_ENUM, ETH_TO_LIKECOIN_RATIO } from '@/constant';
import { mapActions, mapGetters } from 'vuex';

const ONE_LIKE = new BigNumber(10).pow(18);
const INITIAL_TOKENSALE_ETH = new BigNumber(5400);
const SALE_DATE = '2018-04-23T00:00:00+0800';


export default {
  name: 'tokensale',
  layout: 'narrowWithHeader',
  components: {
    CountdownTimer,
    NumberInput,
    MaterialButton,
    'tokensale-progress': TokenSaleProgress,
    PopupDialog,
    KYCForm,
  },
  data() {
    return {
      EthIcon,
      likeCoinIcon,
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
      amount: this.$route.params.amount || '0.00',
      popupMessage: '',
      currentTokenSaleAmount: INITIAL_TOKENSALE_ETH,
      maxTokenSaleAmount: 12600,
      points: [
        {
          value: 1,
          legend: '4,200 ETH (Soft Cap)',
        },
        {
          value: 2,
        },
        {
          value: 3,
          legend: '12,600 ETH (Hard Cap)',
        },
      ],
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
      return (new Date() < new Date(SALE_DATE));
    },
    preSaleBase() {
      if (!this.amount) return new BigNumber(0);
      try {
        return (new BigNumber(ETH_TO_LIKECOIN_RATIO)).multipliedBy(new BigNumber(this.amount));
      } catch (err) {
        return new BigNumber(0);
      }
    },
    preSaleBonus() {
      if (!this.preSaleBase || Number(this.amount) < 10) return new BigNumber(0);
      return this.preSaleBase.multipliedBy(new BigNumber(0.25));
    },
    canICO() {
      if (this.isPreSale) return this.getUserInfo.isEmailVerified;
      return !this.needRegister && this.isKYCTxPass && this.KYCStatus >= KYC_STATUS_ENUM.STANDARD;
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
      if (!amount || amount.lt('0.1')) {
        this.isBadAmount = true;
        return;
      }
      this.isBadAmount = false;
      const usdPrice = await this.queryEthPrice();
      const usdAmount = usdPrice * this.amount;
      if (usdAmount > KYC_USD_LIMIT && this.getUserInfo.KYC < KYC_STATUS_ENUM.ADVANCED) {
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
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          this.$router.push({ name: 'tx-id', params: { id: txHash, tx: this.getPendingTxInfo } });
        }
      } catch (error) {
        console.error(error);
      }
    },
    redirectToRegister() {
      this.$router.push({ name: 'register', query: { ref: 'tokensale' } });
    },
    async checkStatus() {
      if (this.getUserIsRegistered) {
        this.isKYCTxPass = await EthHelper.queryKYCStatus(this.getLocalWallet);
      } else {
        this.isKYCTxPass = null;
      }
    },
    async updateTokenSaleProgress() {
      const amount = await EthHelper.queryEthBalance(LIKE_COIN_ICO_ADDRESS);
      this.currentTokenSaleAmount = new BigNumber(amount).dividedBy(ONE_LIKE)
        .plus(INITIAL_TOKENSALE_ETH).toFixed(2);
    },
    handleAmountChange(value) {
      this.amount = value;
    },
    handleShowPaymentForm(show) {
      this.shouldShowPaymentForm = show;
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
@import "~assets/index";
@import "~assets/default";


.lc-container-3 {
  background-color: $like-gray-1;
}

.tokensale-page {
  margin-bottom: 18px;

  h1, h2 {
    font-weight: normal;
  }

  ul {
    padding: 0;

    list-style-type: none;
  }

  li {
    display: inline-block;

    margin: 0 10px;
  }

  a {
    cursor: pointer;
    transition: opacity, color .2s ease-in-out;

    color: #28646e;
  }

  .create-account-wrapper {
    text-align: center;
    p {
      max-width: 422px;
      margin: auto;

      text-align: center;

      color: $like-gray-4;
    }
    .md-button {
      width: 256px;
      margin-top: 32px;
    }
  }
}

.nav-menu {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  .like-coin-token {
    z-index: 1;

    width: 144px;
    height: 144px;
    margin: 16px;
    margin-bottom: -16px;

    @media (min-width: 769px) {
      margin-top: -32px;
    }
    @media (max-width: 600px) {
      order: 999;
    }
  }

  span {
    flex: 1;

    a {
      text-decoration: underline;

      color: #28646E;
    }

    &:last-child {
      text-align: right;
    }
  }
}


.countdown-section {
  h1 {
    font-size: 42px;
    font-weight: 600;
    line-height: 1.2;
  }

  h3 {
    margin-top: 12px;
    margin-bottom: 8px;

    font-size: 14px;
    font-weight: 400;
  }

  h1, h3 {
    text-align: center;
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
  > h1 {
    text-align: center;
  }
}

.tokensale-amount {
  text-align: center;

  font-weight: 300;

  .current {
    color: #28646E;

    font-size: 46px;
    line-height: 62px;
  }

  .max {
    font-size: 20px;
    font-weight: 400;
  }
}


.token-info-section {
  margin-top: 8px;

  .info-grid {
    > ul {
      display: flex;

      margin: -26px;
      padding: 0;

      list-style: none;

      @media (max-width: 600px) {
        margin: -12px;
      }
      @media (max-width: 480px) {
        flex-direction: column;
      }

      > li {
        margin: 24px;
        flex-shrink: 0;

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

        &:last-child {
          display: flex;
          align-items: center;

          margin-left: 16px;
          margin-right: 0;
          a {
            display: flex;
            flex-direction: row;

            text-decoration: underline;

            span {
              flex-shrink: 0;

              font-size: 12px;
            }
            img {
              margin-left: 8px;
            }
          }
        }
      }
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
