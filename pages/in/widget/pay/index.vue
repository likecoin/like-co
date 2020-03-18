<template>
  <div>
    <div>
      <h2>Send</h2>
      <h1>{{ totalAmount }} LIKE</h1>
      <section>
        <section>
          <p> to: </p>
          <div
            v-for="u in toUsers"
            :key="u.id"
          >
            <lc-avatar
              v-if="u.avatar"
              :src="u.avatar"
              size="64"
            />
            {{ u.displayName }}
          </div>
        </section>
        <section v-if="agentUser">
          <p> Via </p>
          <div>{{ agentUser.displayName }}</div>
        </section>
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
      </section>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
} from '@/util/api/api';

export default {
  name: 'payment',
  layout: 'narrowWithHeader',
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
    };
  },
  async asyncData({
    query,
    error,
  }) {
    const {
      to: toString,
      amount: amountString,
      via: agentId,
      fee: agentFee,
      redirect_uri: redirectUri,
    } = query;
    let {
      remarks,
    } = query;
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
    if (!agentId && (agentFee || redirectUri)) {
      return error({ statusCode: 400, message: 'MISSING_VIA' });
    }

    // invalid redirect_uri
    // if (redirectUri) {
    //   error({ statusCode: 400, message: 'INVALID_REDIRECT_URI' });
    // }

    if (remarks) {
      remarks = remarks.substring(0, 255);
    }

    let promises = [];
    promises.push(agentId ? apiGetUserMinById(agentId) : () => null);
    promises = promises.concat(toIds.map(id => apiGetUserMinById(id)));

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
          cosmosWallet,
          avatar,
          displayName,
        } = u.data;
        return {
          cosmosWallet,
          avatar,
          displayName,
          avatarHalo: User.getAvatarHaloType(u.data),
        };
      });
      return {
        toIds,
        amounts,
        toUsers,
        agentId,
        agentUser,
        agentFee,
        redirectUri,
        remarks,
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
    totalAmount() {
      if (!this.amounts) return '0';
      let amount = this.amounts.reduce(
        (acc, a) => acc.plus(a),
        new BigNumber(0),
      );
      if (this.agentUser && this.agentFee) {
        amount = amount.plus(this.agentFee);
      }
      return amount.toFixed();
    },
    isMultiSend() {
      return this.toIds.length > 1 || this.agentId;
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
        const to = this.wallet;
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
        if (this.isMultiSend) {
          const tos = this.toUsers.map(u => u.cosmosWallet);
          const values = [...this.amounts];
          if (this.agentUser) {
            tos.push(this.agentUser.cosmosWallet);
            values.push(this.agentFee);
          }
          txHash = await this.sendCosmosPayment({
            signer,
            from,
            tos,
            values,
            memo: this.remarks,
            showDialog: false,
            isWait: false,
          });
        } else {
          txHash = await this.sendCosmosPayment({
            signer,
            from,
            to: this.toIds[0],
            value: this.totalAmount,
            memo: this.remarks,
            showDialog: false,
            isWait: false,
          });
        }
        this.postTransaction({ txHash });
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    postTransaction({ txHash, remarks, error } = {}) {
      if (this.redirectUri) {
        const url = new URL(this.redirectUri, true);
        if (txHash) url.query.tx_hash = txHash;
        if (error) url.query.error = error;
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
