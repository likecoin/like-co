<template>
  <div class="payment-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 lc-padding-vertical-32">

              <section class="product-details">
                <div class="product-details__header">
                  <h1>{{ $route.query.header }}</h1>
                </div>
                <div class="product-details__body">
                  <div>
                    <div
                      v-if="$route.query.image"
                      class="product-details__body__image"
                    >
                      <img
                        :src="$route.query.image"
                        :alt="$route.query.title"
                      >
                    </div>
                    <div class="product-details__body__content">
                      <div>
                        <h1>{{ $route.query.title }}</h1>
                        <p v-if="$route.query.description">
                          {{ $route.query.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section v-if="displayName" class="recipient-field">
                <div class="recipient-field__title">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <div class="recipient-field__content">
                  {{ displayName }}
                </div>
              </section>

              <section v-if="wallet" class="recipient-field">
                <div class="recipient-field__title">
                  {{ $t('Transaction.label.recipientAddress') }}
                </div>
                <div class="recipient-field__content">
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
            <div class="lc-container-4">

              <div class="transaction-summary lc-padding-vertical-48">
                <div>
                  <span class="transaction-summary__pay-label">
                    {{ $t('Pay.label.needToPay') }}
                  </span>
                  <span class="transaction-summary__amount">
                    {{ amount }}
                  </span>
                  <span class="transaction-summary__currency-label">
                    LIKE
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div class="lc-container-3 lc-margin-vertical-16">
            <div class="lc-container-4">

              <div
                v-if="!getUserIsRegistered"
                class="registration-wrapper"
              >
                <p class="lc-text-align-center lc-color-gray-9b">
                  {{ $t('Pay.label.dontWorryWithoutLikeCoin') }}
                </p>
                <md-button
                  class="md-likecoin"
                  @click="onClickSignUpButton"
                >
                  {{ $t('Pay.button.registrationTutorial') }}
                </md-button>
              </div>

              <div v-else>
                <no-ssr>
                  <p v-if="!isSupportTransferDeleteaged">
                    {{ $t('Transaction.error.notSupported') }}
                  </p>
                </no-ssr>
                <no-ssr>
                  <md-button
                    id="payment-confirm"
                    class="md-likecoin"
                    :disabled="getIsInTransaction
                      || !isSupportTransferDeleteaged
                      || (!getLocalWallet)"
                    @click="onSubmit"
                  >
                    {{ $t('General.button.confirm') }}
                  </md-button>
                </no-ssr>
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

import EthHelper from '@/util/EthHelper';
import { apiGetUserMinByMerchantId } from '@/util/api/api';

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
  name: 'likecoin-pay',
  layout: 'pay',
  data() {
    return {
      isSupportTransferDeleteaged: true,
    };
  },
  asyncData({
    app,
    params,
    query,
    error,
  }) {
    const { merchantId } = params;
    const { redirect } = query;

    const amount = formatAmount(params.amount || 1);
    const reward = query.reward || 0;
    const bigAmount = new BigNumber(amount);
    const bigReward = new BigNumber(reward);
    if (
      !redirect ||
      !bigAmount ||
      bigAmount.lt('0.000000000000000001') ||
      bigReward.gt(bigAmount)
    ) {
      error({
        statusCode: 400,
        message: app.i18n.t('Pay.label.invalidTransaction'),
      });
      return {};
    }

    return apiGetUserMinByMerchantId(merchantId)
      .then((res) => {
        const {
          avatar,
          displayName,
          wallet,
        } = res.data;
        return {
          amount,
          avatar,
          displayName,
          wallet,
          reward,
        };
      })
      .catch(() => {
        error({
          statusCode: 404,
          message: app.i18n.t('Pay.label.merchantNotFound'),
        });
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
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getIsInTransaction',
      'getLocalWallet',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getMetamaskError',
      'getWeb3Type',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
    ]),
    maskedWallet() {
      return this.wallet.replace(/(0x.{10}).*(.{10})/, '$1...$2');
    },
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
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
    async onSubmit() {
      if (this.getMetamaskError) {
        this.showLoginWindow();
        return;
      }
      try {
        if (!EthHelper.getWallet()) return;
        const from = EthHelper.getWallet();
        const to = this.wallet;
        let balance = 0;

        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          return;
        }

        balance = await EthHelper.queryLikeCoinBalance(from);
        const valueToSend = ONE_LIKE.multipliedBy(new BigNumber(this.amount));
        if ((new BigNumber(balance)).lt(valueToSend)) {
          this.setErrorMsg(this.$t('Transaction.error.likecoinInsufficient'));
          return;
        }

        const maxRewardToSend = ONE_LIKE.multipliedBy(new BigNumber(this.reward));

        if (!EthHelper.getIsSupportTransferDelegated()) {
          this.setErrorMsg(this.$t('Transaction.error.notSupported'));
        }

        const payload = await EthHelper.signTransferDelegated(
          to,
          valueToSend.minus(maxRewardToSend),
          maxRewardToSend,
        );
        payload.httpReferrer = this.httpReferrer;
        const txHash = await this.sendPayment(payload);
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          const redirectURL = this.$route.query.redirect;
          if (redirectURL) {
            window.location.href = redirectURL;
          } else {
            this.$router.push({
              name: 'in-tx-id',
              params: {
                id: txHash,
                tx: this.getPendingTxInfo,
              },
            });
          }
        }
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }
    },
    onClickSignUpButton() {
      this.$router.push({
        name: 'in-register',
        query: { ...this.$route.query, ref: '' },
      });
    },
  },
  watch: {
    getWeb3Type() {
      this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    },
  },
  mounted() {
    this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    if (this.getUserNeedAuth) {
      this.showLoginWindow();
    }
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.product-details {
  margin: 40px 0 32px;

  &__header {
    h1 {
      color: $like-gray-5;

      font-size: 46px;
      font-weight: 300;

      @media screen and (max-width: 600px) {
        font-size: 36px;
      }
    }
  }

  &__body {
    margin-top: 32px;

    > div {
      display: flex;
      align-items: center;

      margin: -10px;

      @media screen and (max-width: 600px) {
        flex-direction: column;
      }

      > * {
        padding: 10px;
      }
    }

    &__image {
      > img {
        display: block;

        width: 144px;
        height: 144px;
      }
    }

    &__content {
      display: inherit;
      align-items: inherit;

      > div {
        h1 {
          color: #e94f4f;

          font-size: 20px;
          font-weight: 400;

          @media screen and (max-width: 600px) {
            text-align: center;
          }
        }

        p {
          color: $like-gray-5;
        }

        > *:not(:first-child) {
          margin-top: 8px;
        }
      }
    }
  }
}

.recipient-field {
  & + & {
    margin-top: 18px;
  }

  &__title {
    margin-bottom: 8px;

    font-size: 14px;
  }

  &__content {
    overflow: hidden;

    margin: 0 auto;

    white-space: nowrap;
    text-overflow: ellipsis;

    font-size: 19px;
    line-height: 1.2;
  }
}

.transaction-summary {
  > div {
    position: relative;

    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    @media (min-width: 480px + 1px) {
      border-bottom: 2px solid $like-gray-3;
    }

    @media screen and (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__pay-label {
    left: 0;
  }

  &__amount {
    text-align: center;
    word-wrap: break-word;

    color: $like-green;

    font-size: 56px;
    font-weight: 300;
    line-height: 76px;

    @media screen and (min-width: 480px + 1px) {
      max-width: 70%;
    }

    @media screen and (max-width: 480px) {
      max-width: 80vw;

      font-size: 56 / 480 * 100vw;
      line-height: 76 / 480 * 100vw;
    }
  }

  &__currency-label {
    right: 0;

    text-align: right;

    color: $like-green;

    font-size: 14px;
  }

  @media screen and (min-width: 480px + 1px) {
    &__pay-label,
    &__currency-label {
      position: absolute;

      max-width: 15%;
    }
  }
}

.registration-wrapper {
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
}
</style>
