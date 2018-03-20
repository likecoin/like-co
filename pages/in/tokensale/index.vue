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
                        <span class="value highlight">LIKE</span>
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
                <form v-if="canICO && !needExtraKYC" id="paymentInfo" v-on:submit.prevent="onSubmit">
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
                  </md-field>
                  <span v-if="isBadAmount" class="md-error">
                    <md-icon>error</md-icon>{{ $t('Transaction.label.invalidAmount') }}
                  </span>
                  <div v-if="isPreSale">
                    <div> {{ $t('TokenSale.label.preSaleDescription0', {
                      base: preSaleBase,
                      bonus: preSaleBonus,
                      }) }}
                    </div>
                    <div>{{ $t('TokenSale.label.preSaleDescription1') }}</div>
                  </div>
                  <!-- <md-field>
                    <md-input placeholder="Remark (optional)" />
                  </md-field> -->
                  <md-button
                    id="payment-confirm"
                    class="md-raised md-primary"
                    type="submit"
                    form="paymentInfo"
                    :disabled="getIsInTransaction || !getLocalWallet">
                    {{ $t('General.button.confirm') }}
                  </md-button>
                </form>

                <section v-else-if="KYCStatus==KYC_STATUS_ENUM.PENDING">
                  <md-progress-bar md-mode="indeterminate" />
                  KYC ALREADY PENDING
                </section>

                <section>
                  <KYCForm
                    :isKYCTxPass="isKYCTxPass"
                    :isPreSale="isPreSale"
                    :user="getUserInfo"
                    :wallet="getLocalWallet" />
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
import MaterialButton from '~/components/MaterialButton';
import TokenSaleProgress from '~/components/TokenSaleProgress';
import PopupDialog from '~/components/dialogs/PopupDialog';
import KYCForm from '~/components/KYCForm';
import EthHelper from '@/util/EthHelper';
import { LIKE_COIN_ICO_ADDRESS, LIKE_COIN_PRESALE_ADDRESS } from '@/constant/contract/likecoin-ico';
import { KYC_USD_LIMIT, KYC_STATUS_ENUM, ETH_TO_LIKECOIN_RATIO } from '@/constant';
import { mapActions, mapGetters } from 'vuex';
import likeCoinIcon from '@/assets/like-coin.svg';

const ONE_LIKE = new BigNumber(10).pow(18);
const INITIAL_TOKENSALE_ETH = new BigNumber(5400);
const SALE_DATE = '2018-04-23T00:00:00+0800';

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
  layout: 'narrowWithHeader',
  components: {
    CountdownTimer,
    MaterialButton,
    'tokensale-progress': TokenSaleProgress,
    PopupDialog,
    KYCForm,
  },
  data() {
    return {
      KYC_STATUS_ENUM,
      SALE_DATE,
      ETH_TO_LIKECOIN_RATIO,
      isBadAddress: false,
      isBadAmount: false,
      isEth: true,
      isKYCTxPass: undefined,
      needExtraKYC: false,
      likeCoinIcon,
      id: 'tokensale',
      displayName: 'LikeCoin TokenSale',
      amount: this.$route.params.amount || 0,
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
      this.isBadAmount = false;
    },
    formatAmount() {
      this.amount = formatAmount(this.amount);
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

  .create-account-wrapper {
    text-align: center;
    p {
      text-align: center;
      color: $like-gray-4;
      max-width: 422px;
      margin: auto;
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
        margin: 26px;

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
          }

          > span {
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
        }
      }
    }
  }
}


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
