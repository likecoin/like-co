<template>
  <div class="pay-widget-page">
    <div />
    <div class="widget-body">
      <h2>{{ $t('PaymentWidget.title') }}</h2>
      <hr>
      <h1>{{ actualSendAmount }} LIKE</h1>
      <section>
        <section>
          <p>{{ $t('PaymentWidget.label.to') }}</p>
          <div
            v-for="u in toUsers"
            :key="u.user"
          >
            <lc-avatar
              v-if="u.avatar"
              :src="u.avatar"
              size="64"
            />
            <nuxt-link :to="{ name: 'id', params: { id: u.user } }">
              {{ u.displayName }}
            </nuxt-link>
          </div>
        </section>
        <section v-if="agentId">
          <p>{{ $t('PaymentWidget.label.via') }}</p>
          <lc-avatar
            v-if="agentUser.avatar"
            :src="agentUser.avatar"
            size="16"
          />
          <nuxt-link :to="{ name: 'id', params: { id: agentUser.user } }">
            {{ agentUser.displayName }}
          </nuxt-link>
        </section>
      </section>
      <section class="detail">
        <h3>{{ $t('PaymentWidget.label.details') }}</h3>
        <section v-if="showDetails">
          <div>
            <div v-if="remarks">{{ $t('PaymentWidget.label.remarks', { remarks }) }}</div>
            <div>{{ $t('PaymentWidget.label.receiveSum', {
              users: toUsers.map(u => u.user).join(', '),
              amount: sumOfToAmount,
            }) }}</div>
            <div v-if="agentId">{{ $t('PaymentWidget.label.agentFee', {
              user: agentUser.user,
              amount: agentFee,
            }) }}</div>
            <div v-if="gasFee">{{ $t('PaymentWidget.label.gasFee', { amount: gasFee }) }}</div>
            <div>{{ $t('PaymentWidget.label.total', { amount: totalAmount }) }}</div>
          </div>
        </section>
        <a
          v-else
          href="#"
          @click.prevent="showDetails = !showDetails"
        >
          Show
        </a>
      </section>
      <section>
        <div
          v-if="isLoading"
          class="lc-margin-top-8 lc-text-align-center"
        >
          {{ $t('General.loading') }}
        </div>
        <div v-else-if="!getUserIsRegistered">
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
            class="md-likecoin"
            @click="submitTransfer"
          >
            {{
              $t('General.button.confirm')
            }}
          </md-button>
        </div>
      </section>
    </div>
    <div />
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { IS_TESTNET } from '@/constant';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  transfer as cosmosTransfer,
  transferMultiple as cosmosTransferMultiple,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
} from '@/util/api/api';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'register',
  data() {
    return {
      toIds: [],
      toUsers: [],
      amounts: [],
      agentId: '',
      agentUser: null,
      agentFee: '',
      redirectUri: '',
      isLoading: true,
      showDetails: false,
      blocking: false,
      state: '',
      gasFee: '',
    };
  },
  async asyncData({
    query,
    error,
    redirect,
  }) {
    const {
      to: toString,
      amount: amountString,
      via: agentId,
      fee: agentFee,
      redirect_uri: redirectUri,
      blocking,
      state,
    } = query;
    let {
      remarks,
    } = query;
    if (!Object.keys(query).length) {
      return redirect('https://docs.like.co/developer/like-pay/web-widget/reference');
    }
    if (!toString) {
      return error({ statusCode: 400, message: 'INVALID_RECIPIENT' });
    }
    if (!amountString) {
      return error({ statusCode: 400, message: 'INVALID_AMOUNT' });
    }
    const toIds = toString.split(',');
    const amounts = amountString.split(',');
    if (toIds.length !== amounts.length) {
      return error({ statusCode: 400, message: 'RECIPIENT_AND_AMOUNT_SIZE_MISMATCH' });
    }
    if (!agentId && (agentFee)) {
      return error({ statusCode: 400, message: 'MISSING_VIA' });
    }

    if (remarks) {
      remarks = remarks.substring(0, 255);
    }

    let promises = [];
    promises.push(agentId ? apiGetUserMinById(agentId, { type: 'payment' }) : () => null);
    promises = promises.concat(toIds.map(id => apiGetUserMinById(id, { type: 'payment' })));

    return Promise.all(promises).then((res) => {
      const [agentRes, ...toRes] = res;
      let agentUser;
      if (agentRes) {
        agentUser = {
          ...agentRes.data,
          avatarHalo: User.getAvatarHaloType(agentRes.data),
        };
      }
      const toUsers = toRes.map((u) => {
        const {
          user,
          cosmosWallet,
          avatar,
          displayName,
          paymentRedirectWhiteList,
        } = u.data;
        return {
          user,
          cosmosWallet,
          avatar,
          displayName,
          avatarHalo: User.getAvatarHaloType(u.data),
          paymentRedirectWhiteList,
        };
      });

      if (redirectUri) {
        if (agentId) {
          const {
            paymentRedirectWhiteList: agentWhiteList = [],
          } = agentUser;
          if (!IS_TESTNET && (!agentWhiteList || !agentWhiteList.length)) {
            error({ statusCode: 400, message: 'AGENT_NOT_SETUP_PAYMENT_REDIRECT' });
          }
          if (agentWhiteList.length && !agentWhiteList.includes(redirectUri)) {
            error({ statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' });
          }
        } else {
          if (toUsers.length > 1) {
            error({ statusCode: 400, message: 'CANNOT_REDIRECT_MULTIPLE_RECEIPIENTS' });
          }
          const {
            paymentRedirectWhiteList: userWhiteList = [],
          } = toUsers[0];
          if (!IS_TESTNET && (!userWhiteList || !userWhiteList.length)) {
            error({ statusCode: 400, message: 'USER_NOT_SETUP_PAYMENT_REDIRECT' });
          }
          if (userWhiteList.length && !userWhiteList.includes(redirectUri)) {
            error({ statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' });
          }
        }
      }

      return {
        toIds,
        amounts,
        toUsers,
        agentId,
        agentUser,
        agentFee,
        redirectUri,
        remarks,
        blocking,
        state,
      };
    }).catch((e) => { // eslint-disable-line no-unused-vars
      console.error(e);
      error({ statusCode: 404, message: 'RECEIPIENT_NOT_FOUND' });
    });
  },
  head() {
    return {
      title: 'LIKE pay',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getLikeCoinUsdNumericPrice',
      'getUserInfo',
      'getAuthCoreNeedReAuth',
      'getIsShowingTxPopup',
      'getPendingTxInfo',
    ]),
    httpReferrer() {
      return this.$route.query.referrer || document.referrer || undefined;
    },
    sumOfToAmount() {
      if (!this.amounts) return '0';
      const amount = this.amounts.reduce(
        (acc, a) => acc.plus(a),
        new BigNumber(0),
      );
      return amount.toFixed();
    },
    actualSendAmount() {
      let amount = new BigNumber(this.sumOfToAmount);
      if (this.agentUser && this.agentFee) {
        amount = amount.plus(this.agentFee);
      }
      return amount.toFixed();
    },
    totalAmount() {
      let amount = new BigNumber(this.actualSendAmount);
      if (this.gasFee) amount = amount.plus(this.gasFee);
      return amount.toFixed();
    },
    isMultiSend() {
      return this.toIds.length > 1 || this.hasAgentFee;
    },
    hasAgentFee() {
      return this.agentUser && this.agentFee && this.agentFee !== '0';
    },
    usdTransferStrValue() {
      if (this.getLikeCoinUsdNumericPrice && this.totalAmount) {
        const value = new BigNumber(this.totalAmount);
        const usdValue = value.times(this.getLikeCoinUsdNumericPrice);
        let decimalPlace = 2;
        if (usdValue.lt(0.01)) decimalPlace = 4;
        return value.times(this.getLikeCoinUsdNumericPrice).toFixed(decimalPlace);
      }
      return null;
    },
  },
  async mounted() {
    this.calculateGasFee();
    if (!this.getLikeCoinUsdNumericPrice) {
      await this.queryLikeCoinUsdPrice();
    }
    this.isLoading = false;
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'doUserAuth',
      'sendCosmosPayment',
      'setErrorMsg',
      'closeTxDialog',
      'queryLikeCoinUsdPrice',
      'fetchAuthCoreCosmosWallet',
      'prepareCosmosTxSigner',
    ]),
    maskedWallet(wallet) {
      return wallet.replace(/((?:cosmos1|0x).{4}).*(.{10})/, '$1...$2');
    },
    async calculateGasFee() {
      let gas;
      const from = await this.fetchAuthCoreCosmosWallet();
      const to = this.toUsers[0].cosmosWallet;
      if (this.isMultiSend) {
        const tos = this.toUsers.map(u => u.cosmosWallet);
        const values = [...this.amounts];
        if (this.hasAgentFee) {
          tos.push(this.agentUser.cosmosWallet);
          values.push(this.agentFee);
        }
        ({ gas } = await cosmosTransferMultiple(
          { from, tos, values },
          null,
          { memo: this.remarks, simulate: true },
        ));
      } else {
        ({ gas } = await cosmosTransfer(
          {
            from,
            to,
            value: this.actualSendAmount,
          },
          null,
          { memo: this.remarks, simulate: true },
        ));
      }
      this.gasFee = new BigNumber(gas).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async submitTransfer() {
      this.isLoading = true;
      try {
        const { cosmosWallet } = this.getUserInfo;
        const amount = new BigNumber(this.totalAmount);
        const from = await this.fetchAuthCoreCosmosWallet();
        if (!from) {
          throw new Error('VALIDATION_FAIL');
        }
        const userWallet = cosmosWallet;
        if (from !== userWallet) {
          this.setErrorMsg(this.$t('Transaction.error.metamaskWalletNotMatch'));
          throw new Error('VALIDATION_FAIL');
        }
        const to = this.toUsers[0].cosmosWallet;
        if (from === to) {
          this.setErrorMsg(this.$t('Transaction.error.sameUser'));
          throw new Error('VALIDATION_FAIL');
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        if (amount.gt(balance)) {
          this.setErrorMsg(
            this.$t('Transaction.error.likecoinInsufficient'),
          );
          throw new Error('VALIDATION_FAIL');
        }
        const signer = await this.prepareCosmosTxSigner();
        let txHash;
        const showDialogAction = !this.redirectUri;
        const isWait = !!this.blocking;
        if (this.isMultiSend) {
          const tos = this.toUsers.map(u => u.cosmosWallet);
          const values = [...this.amounts];
          if (this.hasAgentFee) {
            tos.push(this.agentUser.cosmosWallet);
            values.push(this.agentFee);
          }
          txHash = await this.sendCosmosPayment({
            signer,
            from,
            tos,
            values,
            memo: this.remarks,
            showDialogAction,
            isWait,
          });
        } else {
          txHash = await this.sendCosmosPayment({
            signer,
            from,
            to,
            value: this.actualSendAmount,
            memo: this.remarks,
            showDialogAction,
            isWait,
          });
        }
        this.postTransaction({ txHash });
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    postTransaction({ txHash, error } = {}) {
      if (this.redirectUri) {
        const { state, remarks } = this;
        const url = new URL(this.redirectUri, true);
        if (txHash) url.query.tx_hash = txHash;
        if (error) url.query.error = error;
        if (state) url.query.state = state;
        if (remarks) url.query.remarks = remarks;
        url.set('query', url.query);
        window.location.href = url.toString();
      } else if (this.getIsShowingTxPopup) {
        this.closeTxDialog();
        this.$router.push({
          name: 'in-tx-id',
          params: { id: txHash, tx: this.getPendingTxInfo },
        });
      }
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";

$lc-dialog-border-radius: 8px;

.pay-widget-page {
  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 100vh;

  background-color: #28646E;

  .widget-body {
    min-width: 312px;
    padding: 20px;

    border-radius: $lc-dialog-border-radius;

    background-color: #FFFF;
  }
  .detail {
    background-color: #d2f0f0;
  }
}
</style>
