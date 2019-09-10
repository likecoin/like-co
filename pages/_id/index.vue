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
                  v-else-if="!getUserIsRegistered"
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
                  <no-ssr>
                    <p v-if="!isSupportTransferDeleteaged">
                      {{ $t('Transaction.error.notSupported') }}
                    </p>
                  </no-ssr>
                  <no-ssr>
                    <md-button
                      id="payment-confirm"
                      :class="['md-raised',
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
                    <div id="authcore-cosmos-container" />
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
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
  apiGetSocialListById,
} from '@/util/api/api';

import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';


const ONE_LIKE = new BigNumber(10).pow(18);
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
      isWaitingWeb3: false,
      platforms: {},
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
        wallet,
        cosmosWallet,
        avatar,
        displayName,
      } = res[0].data;
      const amount = formatAmount(params.amount || 1);
      if (wallet === LIKE_COIN_ICO_ADDRESS) {
        redirect({
          name: 'in-tokensale',
        });
      }
      return {
        wallet: cosmosWallet || wallet,
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
    isCosmos() {
      return this.wallet.startsWith('cosmos');
    },
    isEth() {
      /* HACK because nuxt cannot easily pass route with params */
      return this.$route.name === 'id-eth' || this.$route.name === 'id-eth-amount';
    },
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
  },
  watch: {
    getWeb3Type() {
      this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();
    },
    getLocalWeb3Wallet() {
      if (this.getIsWeb3Polling && this.isWaitingWeb3) {
        this.submitTransfer();
        this.stopWeb3Polling();
      }
    },
  },
  async mounted() {
    this.isSupportTransferDeleteaged = EthHelper.getIsSupportTransferDelegated();

    if (!this.getLikeCoinUsdNumericPrice) {
      await this.queryLikeCoinUsdPrice();
    }
    if (!this.$route.params.amount && this.getLikeCoinUsdNumericPrice) {
      this.amount = (DEFAULT_P2P_AMOUNT_IN_USD / this.getLikeCoinUsdNumericPrice).toFixed(2);
    }
  },
  methods: {
    ...mapActions([
      'showMetaMaskLoginWindow',
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'doUserAuth',
      'sendPayment',
      'sendCosmosPayment',
      'sendEthPayment',
      'setErrorMsg',
      'closeTxDialog',
      'queryLikeCoinUsdPrice',
      'startWeb3Polling',
      'stopWeb3Polling',
      'fetchAuthCoreCosmosWallet',
      'prepareCosmosTxSigner',
    ]),
    async startPollingForWeb3() {
      this.isWaitingWeb3 = true;
      const isPolling = await this.startWeb3Polling();
      if (!isPolling) {
        this.isWaitingWeb3 = false;
      }
      return isPolling;
    },
    async submitTransfer() {
      if (!this.isCosmos) {
        if (await this.startPollingForWeb3()) return;
        if (this.getMetamaskError) {
          this.showMetaMaskLoginWindow();
          return;
        }
      }
      const { wallet, cosmosWallet } = this.getUserInfo;
      const amount = new BigNumber(this.amount);
      if (!amount || amount.lt('0.000000000000000001')) {
        this.isBadAmount = true;
        return;
      }
      this.isBadAmount = false;
      try {
        let balance = 0;
        const from = this.isCosmos
          ? await this.fetchAuthCoreCosmosWallet() : this.getLocalWeb3Wallet;
        if (!from) {
          return;
        }
        const userWallet = this.isCosmos ? cosmosWallet : wallet;
        if (from !== userWallet) {
          this.setErrorMsg(this.$t('Transaction.error.metamaskWalletNotMatch'));
          return;
        }
        const to = this.wallet;
        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          return;
        }
        let valueToSend;
        if (!this.isCosmos) {
          if (this.isEth) {
            balance = await EthHelper.queryEthBalance(from);
          } else {
            balance = await EthHelper.queryLikeCoinBalance(from);
          }
          valueToSend = ONE_LIKE.multipliedBy(amount);
          if ((new BigNumber(balance)).lt(valueToSend)) {
            this.setErrorMsg(
              this.$t(`Transaction.error.${this.isEth ? 'eth' : 'likecoin'}Insufficient`),
            );
            return;
          }
        } else {
          balance = await queryCosmosLikeCoinBalance(from);
          valueToSend = amount.toFixed();
          if (balance < valueToSend) {
            this.setErrorMsg(
              this.$t(`Transaction.error.${this.isEth ? 'eth' : 'likecoin'}Insufficient`),
            );
            return;
          }
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
        } else if (this.isCosmos) {
          const signer = await this.prepareCosmosTxSigner();
          ({ txHash } = await this.sendCosmosPayment({
            signer,
            from,
            to,
            value: valueToSend,
          }));
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
          this.$router.push({
            name: 'in-tx-id',
            params: { id: txHash, tx: this.getPendingTxInfo },
          });
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
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route });
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
