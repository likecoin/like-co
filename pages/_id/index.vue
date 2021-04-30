<template>
  <div class="payment-page">
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">

              <narrow-page-header
                :icon="avatar"
                :avatar-halo="avatarHalo"
              />

            </div>
          </div>
        </div>

        <div :class="['lc-container-2-extend']">
          <div class="lc-container-3-extend-bg" />
          <div class="lc-container-3">
            <div class="lc-padding-top-32 lc-padding-bottom-16">
              <section class="lc-text-align-center">
                <i18n
                  path="Transaction.label.sendTo"
                  tag="h1"
                  class="lc-font-size-42 lc-font-weight-300 lc-mobile"
                >
                  <span place="coin">{{ 'LikeCoin' }}</span>
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
                @submit.prevent="submitTransfer"
              >
                <input
                  v-model="wallet"
                  hidden
                  required
                  disabled
                >
                <div class="number-input lc-padding-bottom-32">
                  <number-input
                    :currencyTitle="''"
                    :amount="amount"
                    :isBadAmount="isBadAmount"
                    :label="$t('Transaction.label.amountToSend',
                               { coin: 'LikeCoin' })"
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
                <div
                  v-if="isSigning"
                  class="lc-margin-top-8 lc-text-align-center"
                >
                  {{ $t('General.signing') }}
                </div>
                <div
                  v-else-if="isLoading"
                  class="lc-margin-top-8 lc-text-align-center"
                >
                  {{ $t('General.loading') }}
                </div>
                <no-ssr v-else>
                  <div
                    v-if="!getUserIsRegistered"
                    class="create-account-wrapper"
                  >
                    <md-button
                      class="md-likecoin"
                      @click="onClickSignInButton"
                    >
                      {{ $t('Home.Header.button.signIn') }}
                    </md-button>
                  </div>
                  <div
                    v-else-if="getAuthCoreNeedReAuth"
                    class="create-account-wrapper"
                  >
                    <md-button
                      class="md-likecoin"
                      @click="onClickAuthCoreReAuth"
                    >
                      {{ $t('AuthCore.button.reAuthNeeded') }}
                    </md-button>
                  </div>

                  <div v-else>
                    <md-button
                      id="payment-confirm"
                      :class="['md-raised',
                               'md-likecoin',
                      ]"
                      :disabled="getIsInTransaction"
                      type="submit"
                      form="paymentInfo"
                    >
                      {{
                        $t('General.button.confirm')
                      }}
                    </md-button>
                    <p
                      v-if="gasFee"
                    >
                      {{ $t('Transaction.label.gasFee', { gasFee }) }}
                    </p>
                    <div id="authcore-cosmos-container" />
                  </div>
                </no-ssr>
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
import NarrowPageHeader from '~/components/header/NarrowPageHeader';
import SocialMediaConnect from '~/components/SocialMediaConnect';

import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  transfer as cosmosTransfer,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
  apiGetSocialListById,
} from '@/util/api/api';

const DEFAULT_P2P_AMOUNT_IN_USD = 0.25;

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
    NarrowPageHeader,
    SocialMediaConnect,
  },
  data() {
    return {
      isBadAddress: false,
      isBadAmount: false,
      isSupportTransferDeleteaged: true,
      isP2pUnavailable: false,
      isLoading: true,
      isSigning: false,
      platforms: {},
      gasFee: '',
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
    return Promise.all([
      apiGetUserMinById(params.id),
      apiGetSocialListById(params.id).catch(() => ({})),
    ]).then((res) => {
      const {
        cosmosWallet,
        avatar,
        displayName,
      } = res[0].data;
      const amount = formatAmount(params.amount || 1);
      return {
        wallet: cosmosWallet,
        avatar,
        id: params.id,
        displayName: displayName || params.id,
        amount,
        avatarHalo: User.getAvatarHaloType(res[0].data),
        platforms: res[1].data,
      };
    }).catch((e) => { // eslint-disable-line no-unused-vars
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
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
      script: [
        {
          hid: 'schema',
          innerHTML: JSON.stringify({
            '@context': 'http://www.schema.org',
            '@type': 'Person',
            name: this.displayName,
            alternateName: this.id,
            image: this.avatar,
            sameAs: Object.keys(this.platforms || {}).map(s => this.platforms[s].url),
          }),
          type: 'application/ld+json',
        },
      ],
      link: [
        { rel: 'canonical', href: `/${this.id}` },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'getIsInTransaction',
      'getUserIsRegistered',
      'getMetamaskError',
      'getWeb3Type',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
      'getLikeCoinUsdNumericPrice',
      'getUserInfo',
      'getAuthCoreNeedReAuth',
      'getLocalWeb3Wallet',
      'getIsWeb3Polling',
    ]),
    maskedWallet() {
      return this.wallet.replace(/((?:cosmos1|0x).{4}).*(.{10})/, '$1...$2');
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
    totalAmount() {
      let amount = new BigNumber(this.amount);
      if (this.gasFee) amount = amount.plus(this.gasFee);
      return amount.toFixed();
    },
  },
  async mounted() {
    const promises = [];
    if (!this.getLikeCoinUsdNumericPrice) {
      promises.push(this.queryLikeCoinUsdPrice());
    }
    promises.push(this.calculateGasFee());
    if (!this.$route.params.amount && this.getLikeCoinUsdNumericPrice) {
      this.amount = (DEFAULT_P2P_AMOUNT_IN_USD / this.getLikeCoinUsdNumericPrice).toFixed(2);
    }
    await Promise.all(promises);
    this.isLoading = false;
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'doUserAuth',
      'sendPayment',
      'sendCosmosPayment',
      'setErrorMsg',
      'closeTxDialog',
      'queryLikeCoinUsdPrice',
      'fetchCurrentCosmosWallet',
      'prepareCosmosTxSigner',
    ]),
    async calculateGasFee() {
      const from = await this.fetchCurrentCosmosWallet();
      if (!from) return '';
      const to = this.wallet;
      const { gas, gasPrices } = await cosmosTransfer(
        {
          from,
          to,
          value: this.amount,
          memo: this.remarks,
        },
        null,
        { simulate: true },
      );
      this.gasFee = new BigNumber(gas).multipliedBy(gasPrices[0].amount).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async submitTransfer() {
      this.isSigning = true;
      this.isLoading = true;
      try {
        this.isBadAmount = false;
        const { cosmosWallet } = this.getUserInfo;
        const amount = new BigNumber(this.amount);
        if (!amount || amount.lt('0.000000000000000001')) {
          this.isBadAmount = true;
          throw new Error('VALIDATION_FAIL');
        }
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('VALIDATION_FAIL');
        }
        const userWallet = cosmosWallet;
        if (from !== userWallet) {
          this.setErrorMsg(this.$t('Transaction.error.authcoreWalletNotMatch'));
          throw new Error('VALIDATION_FAIL');
        }
        const to = this.wallet;
        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          throw new Error('VALIDATION_FAIL');
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        const totalAmount = new BigNumber(this.totalAmount);
        if (totalAmount.gt(balance)) {
          this.setErrorMsg(
            this.$t('Transaction.error.likecoinInsufficient'),
          );
          throw new Error('VALIDATION_FAIL');
        }
        const valueToSend = amount.toFixed();
        const signer = await this.prepareCosmosTxSigner();
        const txHash = await this.sendCosmosPayment({
          signer,
          from,
          to,
          value: valueToSend,
        });
        this.isSigning = false;
        if (this.getIsShowingTxPopup) {
          this.closeTxDialog();
          this.$router.push({
            name: 'in-tx-id',
            params: { id: txHash, tx: this.getPendingTxInfo },
          });
        }
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      } finally {
        this.isLoading = false;
        this.isSigning = false;
      }
    },
    onAmountInput(value) {
      this.amount = value;
    },
    handleAmountChange(value) {
      this.amount = value;
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    onClickSignUpButton() {
      this.doUserAuth({ router: this.$router, route: this.$route });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
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
