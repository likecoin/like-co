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

              <section
                v-if="displayName"
                class="recipient-field"
              >
                <div class="recipient-field__title">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <div class="recipient-field__content">
                  {{ displayName }}
                </div>
              </section>

              <section
                v-if="wallet"
                class="recipient-field"
              >
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

          <no-ssr>
            <transition name="fade">
              <div
                v-if="getUserIsReady || getUserNeedAuth"
                class="lc-container-3 lc-margin-vertical-16"
              >
                <div class="lc-container-4">

                  <div
                    v-if="getUserNeedAuth"
                    class="action-section"
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
                    class="action-section"
                  >
                    <p class="lc-text-align-center lc-color-gray-9b">
                      {{ $t('Pay.label.dontWorryWithoutLikeCoin') }}
                    </p>
                    <md-button
                      :href="registrationTutorialLink"
                      class="md-likecoin"
                    >
                      {{ $t('Pay.button.registrationTutorial') }}
                    </md-button>
                  </div>

                  <div
                    v-else
                    class="action-section"
                  >
                    <p v-if="!isSupportTransferDeleteaged">
                      {{ $t('Transaction.error.notSupported') }}
                    </p>
                    <md-button
                      id="payment-confirm"
                      :disabled="(
                        getIsInTransaction
                        || !isSupportTransferDeleteaged
                        || (!getLocalWallet)
                      )"
                      class="md-likecoin"
                      @click="onSubmit"
                    >
                      {{ $t('General.button.confirm') }}
                    </md-button>
                  </div>

                </div>
              </div>
            </transition>
          </no-ssr>

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
      'getCurrentLocale',
      'getIsInTransaction',
      'getLocalWallet',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getMetamaskError',
      'getWeb3Type',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
      'getUserIsReady',
    ]),
    maskedWallet() {
      return this.wallet.replace(/(0x.{10}).*(.{10})/, '$1...$2');
    },
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
    registrationTutorialLink() {
      switch (this.getCurrentLocale) {
        case 'zh':
          return 'https://help.like.co/likecoin-%E5%B8%B8%E8%A6%8B%E5%95%8F%E9%A1%8C/%E6%96%B0%E6%89%8B%E4%B8%8A%E8%B7%AF/%E5%A6%82%E4%BD%95%E5%9C%A8%E9%9B%BB%E8%85%A6%E8%A8%BB%E5%86%8A-likecoin-id';
        case 'cn':
          return 'https://help.like.co/likecoin-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98/%E6%96%B0%E6%89%8B%E4%B8%8A%E8%B7%AF/%E5%A6%82%E4%BD%95%E5%9C%A8%E7%94%B5%E8%84%91%E6%B3%A8%E5%86%8C-likecoin-id';
        default:
          return 'https://help.like.co/likecoin-faq/newbies/registering-likecoin-id-on-computer';
      }
    },
  },
  watch: {
    getWeb3Type() {
      this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    },
    getUserNeedAuth(value) {
      if (value) {
        this.showLoginWindow();
      }
    },
  },
  mounted() {
    this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    if (this.getUserNeedAuth) {
      this.showLoginWindow();
    }
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
        if (!this.isSupportTransferDeleteaged) {
          this.setErrorMsg(this.$t('Transaction.error.notSupported'));
          return;
        }

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

        const payload = await EthHelper.signTransferDelegated(
          to,
          valueToSend.minus(maxRewardToSend),
          maxRewardToSend,
        );
        const { payload: userPayload } = this.$route.query;
        payload.userPayload = userPayload;
        payload.httpReferrer = this.httpReferrer;
        payload.isWait = false;
        const txHash = await this.sendPayment(payload);
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
        }
        try {
          const redirectURL = new URL(this.$route.query.redirect);
          redirectURL.searchParams.append('txhash', txHash);
          if (userPayload) {
            redirectURL.searchParams.append('payload', userPayload);
          }
          window.location.href = redirectURL.href;
        } catch (error) {
          this.$router.push({
            name: 'in-tx-id',
            params: {
              id: txHash,
              tx: this.getPendingTxInfo,
            },
          });
        }
      } catch (error) {
        console.error(error); // eslint-disable-line no-console
      }
    },
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

.action-section {
  text-align: center;

  .md-button {
    &:not(a) {
      display: block;
    }

    margin: 16px auto;
  }

  a:not(.md-button) {
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
