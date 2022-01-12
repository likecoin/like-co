<!-- eslint-disable max-len -->
<template>
  <div
    v-if="mainStatus === 'registerISCN'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <IconStar />
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Sign  (2/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center">
            <h3 style="color: #9B9B9B;">Upload succeeded. Please sign again to complete.</h3>
          </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB" />
        </div>
        <div class="likepay-panel__section-meta" style="margin-top: 5px; display: flex; flex-direction: row;">
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-left: 75px;"> {{ ISCNTotalFee }} LIKE </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px">
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitTransfer"
        >
          Retry
        </button>
      </section>
    </div>
    <div style="display: flex; flex-direction: row; margin: 52px 0px; position: absolute; top: 590px">
      <div>
        <IconExclamation />
      </div>
      <div style="margin: 0 10px">
        <IconLedger />
      </div>
      <div>
        <div>Do not connect to Ledger hardware wallets for signing.</div>
        <div>Ledger service temporarily unavailable.</div>
      </div>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'directRegisterISCN'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <IconStar />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; color: #28646E; padding-left: 10px"
          >{{ 'Sign  (2/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">Please sign with your wallet. </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB"> </div>
        </div>
        <div class="likepay-panel__section-meta" style="margin-top: 5px; display: flex; flex-direction: row;">
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-left: 75px;"> {{ ISCNTotalFee }} LIKE </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px">
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitISCNTransfer"
        >
          Retry
        </button>
      </section>
    </div>
  </div>
  <div
    v-else-if="getIsSignFinishedState"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <IconStar />
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Uploading...' }}</div>
        </header>
        <div class="likepay-panel__section-meta">
          <div style="display: flex; margin: 40px">
            <div
              class="loading-track"
              style="margin: auto"
            >
              <div class="loading-progress" />
            </div>
          </div>
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">Please do not close window. </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB" />
        </div>
        <div class="likepay-panel__section-meta">
          <div style="font-size: 14px">
            <div>Depend on the file size, it may take several minutes. </div>
            <div>You will request to sign again before finish. </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'onLIKEPay'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <IconStar />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; color: #28646E; padding-left: 10px"
          >{{ 'Sign  (1/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">Please sign with your wallet. </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB" />
        </div>
        <div
          class="likepay-panel__section-meta"
          style="margin-top: 5px; display: flex; flex-direction: row;"
        >
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-left: 75px;"> {{ amounts[0] }} LIKE </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px">
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitTransfer"
        >
          Retry
        </button>
      </section>
    </div>
    <div style="display: flex; flex-direction: row; margin: 52px 0px; position: absolute; top: 590px">
      <div>
        <IconExclamation />
      </div>
      <div style="margin: 0 10px">
        <IconLedger />
      </div>
      <div>
        <div>Do not connect to Ledger hardware wallets for signing.</div>
        <div>Ledger service temporarily unavailable.</div>
      </div>
    </div>
  </div>
  <div
    v-else
    key="panel"
    class="likepay-body"
  >
    <div class="wordpress-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <IconStar />
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Register ISCN' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> ISCN Title </div>
          <div style="margin-top: 10px"> <p> {{ title }} </p> </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> Fee </div>
          <div style="margin-top: 10px"> <p> {{ amounts[0] }} LIKE </p> </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px">
        <div style="margin: auto 0 auto auto; color: #9B9B9B;"> Fee: {{ amounts[0] }} LIKE </div>
        <button
          style="display: flex; flex-direction: row; background-color: #AAF1E7;
                 color: #28646E; border-radius: 12px; border: none; margin: 10px;
                 padding: 10px 15px; cursor: pointer"
          @click="onClickRedirectToKeplrSign"
        >
          <p style="margin: auto 10px auto auto; font-weight: 600;">Register</p>
          <IconArrowRight />
        </button>
      </section>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  IS_TESTNET, LIKER_LAND_URL, IS_CHAIN_UPGRADING,
} from '@/constant';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  getTransferInfo as getCosmosTransferInfo,
  calculateGas as calculateCosmosGas,
} from '@/util/CosmosHelper';
import User from '@/util/User';
import {
  apiGetUserMinById,
} from '@/util/api/api';
import Keplr from '@/util/Keplr';
import { getISCNTransferInfo } from '@/util/cosmos/iscn/query';
import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscn/constant';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      LIKER_LAND_URL,
      toIds: [],
      toUsers: [],
      amounts: [],
      agentId: '',
      agentUser: null,
      agentFee: '',
      redirectUri: '',
      showDetails: false,
      blocking: false,
      state: '',
      gasFee: '',
      isUsingKeplr: false,
      mainStatus: 'initial',
      fingerprints: [],
      title: '',
      type: 'article',
      tags: [],
      license: '',
      publisher: '',
      memo: '',
      url: '',
      ISCNTotalFee: 0.00,
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
      opener,
      fingerprint,
      tags: tagsString = '',
      url,
      publisher,
    } = query;
    let {
      remarks = `LIKE pay${agentId ? ` via ${agentId}` : ''}`, title, license,
    } = query;
    const tags = tagsString ? tagsString.split(',') : [];
    let fingerprints = fingerprint ? fingerprint.split(',') : [];
    fingerprints = fingerprints.map((f) => {
      let contentFingerprint = f;
      if (f.startsWith('Qm') && f.length === 46) {
        contentFingerprint = `ipfs://${f}`; // support old wordpress plugin
      }
      return contentFingerprint;
    });
    if (publisher) {
      if (!ISCN_PUBLISHERS[publisher]) {
        return error({ statusCode: 400, message: 'INVALID_PUBLISHER' });
      }
      ({ license } = ISCN_PUBLISHERS[publisher]);
    }
    if (license) {
      if (!ISCN_LICENSES[license]) {
        return error({ statusCode: 400, message: 'INVALID_LICENSE' });
      }
    } else {
      license = ISCN_PUBLISHERS.default;
    }
    if (title) {
      title = title.substring(0, 255);
    }
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
    promises.push(agentId ? apiGetUserMinById(agentId, { type: 'payment' }) : Promise.resolve(null));
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
      if (agentUser && !agentUser.cosmosWallet) {
        error({ statusCode: 400, message: 'VIA_USER_HAS_NO_WALLET' });
      }

      if (toUsers.some(u => !u.cosmosWallet)) {
        error({ statusCode: 400, message: 'RECEIPIENT_HAS_NO_WALLET' });
      }

      let redirectWhitelistError = null;
      let isRedirectURLWhiteListed = false;
      if (redirectUri) {
        if (agentId) {
          const {
            paymentRedirectWhiteList: agentWhiteList = [],
          } = agentUser;
          if (!IS_TESTNET && (!agentWhiteList || !agentWhiteList.length)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'AGENT_NOT_SETUP_PAYMENT_REDIRECT' };
          }
          if (agentWhiteList.length && !agentWhiteList.includes(redirectUri)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' };
          }
        } else {
          if (toUsers.length > 1) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'CANNOT_REDIRECT_MULTIPLE_RECEIPIENTS' };
          }
          const {
            paymentRedirectWhiteList: userWhiteList = [],
          } = toUsers[0];
          if (!IS_TESTNET && (!userWhiteList || !userWhiteList.length)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'USER_NOT_SETUP_PAYMENT_REDIRECT' };
          }
          if (userWhiteList.length && !userWhiteList.includes(redirectUri)) {
            redirectWhitelistError = redirectWhitelistError || { statusCode: 400, message: 'REDIRECT_URI_NOT_WHITELIST' };
          }
        }
        isRedirectURLWhiteListed = !redirectWhitelistError;
      }
      const hasOpener = opener && opener !== '0';
      const shouldThrowRedirectWhitelistError = redirectUri && !hasOpener;
      if (redirectWhitelistError && shouldThrowRedirectWhitelistError) {
        error(redirectWhitelistError);
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
        opener: hasOpener,
        isRedirectURLWhiteListed,
        title,
        tags,
        url,
        fingerprints,
        license,
        publisher,
      };
    }).catch((e) => {
      console.error(e);
      error({ statusCode: 404, message: e.message });
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
      'getIsSignFinishedState',
    ]),
    redirectOrigin() {
      const url = new URL(this.redirectUri, true);
      return url.origin;
    },
    windowOpener() {
      if (!window) return null;
      return window.opener;
    },
    isChainUpgrading() {
      return IS_CHAIN_UPGRADING;
    },
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
    likePayMetadata() {
      const {
        toIds,
        amounts,
        agentId,
        agentFee,
        redirectUri,
        remarks,
        blocking,
        state,
      } = this;
      return {
        likePay: {
          toIds,
          amounts,
          agentId,
          agentFee,
          redirectUri,
          remarks,
          blocking,
          state,
        },
      };
    },
  },
  async mounted() {
    const {
      fingerprints,
      title,
      tags,
      type,
      license,
      url,
    } = this;
    const { cosmosWallet } = this.getUserInfo;
    if (!this.isChainUpgrading) {
      this.calculateGasFee();
    }
    if (!this.getLikeCoinUsdNumericPrice) {
      await this.queryLikeCoinUsdPrice();
    }
    if (this.opener && !window.opener) {
      this.$nuxt.error({ statusCode: 400, message: 'Cannot access window opener' });
    }
    this.ISCNTotalFee = await this.calculateISCNTxTotalFee({
      userId: this.getUserId,
      displayName: this.getUserInfo.displayName,
      cosmosWallet,
      fingerprints,
      name: title,
      tags,
      type,
      license,
      url,
    });
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'sendCosmosPayment',
      'setErrorMsg',
      'queryLikeCoinUsdPrice',
      'fetchCurrentCosmosWallet',
      'prepareCosmosTxSigner',
      'setDefaultCosmosWalletSource',
      'calculateISCNTxTotalFee',
      'sendISCNSignature',
    ]),
    toggleDetails() {
      const isCollapsing = !this.showDetails;
      const tl = new this.$gsap.TimelineMax({
        onComplete: () => {
          this.showDetails = !this.showDetails;
        },
      });
      tl.to(this.$refs.dropdownBody, 0.5, {
        height: isCollapsing ? 0 : this.$refs.dropdownBody.scrollHeight,
        ease: 'easeOutPower4',
        clearProps: isCollapsing ? '' : 'height',
      }, 0);
      tl.to(this.$refs.dropdownArrow, 0.2, {
        rotationZ: isCollapsing ? 0 : 180,
        ease: 'easeOutPower4',
      }, 0);
    },
    maskedWallet(wallet) {
      return wallet.replace(/((?:cosmos1|0x).{4}).*(.{10})/, '$1...$2');
    },
    async calculateGasFee() {
      let feeAmount;
      if (this.isMultiSend) {
        const tos = this.toUsers.map(u => u.cosmosWallet);
        const values = [...this.amounts];
        if (this.hasAgentFee) {
          tos.push(this.agentUser.cosmosWallet);
          values.push(this.agentFee);
        }
        ({ feeAmount } = await calculateCosmosGas(tos));
      } else {
        ({ feeAmount } = await calculateCosmosGas(this.toUsers));
      }
      this.gasFee = BigNumber(feeAmount[0].amount).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async onArweaveUploadSuccessStartRegisterISCNMessage(event) {
      const { action, data } = JSON.parse(event.data);
      if (action === 'ARWEAVE_UPLOAD_SUCCESS_ON_REGISTER_ISCN') {
        this.mainStatus = 'registerISCN';
        const {
          fingerprints, tags, url, type, license,
        } = data;
        this.fingerprints = fingerprints;
        this.tags = tags;
        this.url = url;
        this.type = type;
        this.license = license;
        await this.submitISCNTransfer();
      }
    },
    async submitISCNTransfer() {
      // try {
      const from = await this.fetchCurrentCosmosWallet();
      if (!from) {
        throw new Error('PLEASE_RELOGIN');
      }
      if (!this.isUsingKeplr) {
        const { cosmosWallet } = this.getUserInfo;
        const userWallet = cosmosWallet;
        if (userWallet !== undefined && from !== userWallet) {
          this.setErrorMsg(this.$t('Transaction.error.authcoreWalletNotMatch'));
          throw new Error('VALIDATION_FAIL');
        }
      }
      const signer = await this.prepareCosmosTxSigner();
      const {
        fingerprints,
        title,
        tags,
        type,
        license,
        url,
      } = this;
      const txHash = await this.sendISCNSignature({
        cosmosWallet: from,
        userId: this.getUserId || '',
        displayName: this.getUserInfo.displayName || '',
        fingerprints,
        name: title,
        tags,
        type,
        license,
        url,
        signer,
        isWordPressSideBar: true,
      });
      await this.postISCNTransaction({ txHash });
      // } catch (error) {
      //   if (error.message !== 'VALIDATION_FAIL') console.error(error);
      // }
    },
    async postISCNTransaction({ txHash, error } = {}) {
      if (this.opener || this.redirectUri) {
        const ISCNTransferInfo = await getISCNTransferInfo(txHash, { blocking: true });
        const { isFailed, iscnId } = ISCNTransferInfo;
        const success = !isFailed;
        const { state } = this;
        const payload = {};
        if (txHash) payload.tx_hash = txHash;
        if (iscnId) payload.iscnId = iscnId;
        if (error) payload.error = error;
        if (state) payload.state = state;
        if (success !== undefined) payload.success = success;
        if (this.opener) {
          const message = JSON.stringify({
            action: 'ISCN_SUBMITTED',
            data: payload,
          });
          window.opener.postMessage(message, this.redirectOrigin);
          const iscnIdString = encodeURIComponent(iscnId);
          window.location.href = `https://app.rinkeby.like.co/view/${iscnIdString}`;
        }
      }
    },
    async onClickRedirectToKeplrSign() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
      // Direct register ISCN flow
      if (this.actualSendAmount === 0 || this.actualSendAmount === '0') {
        this.mainStatus = 'directRegisterISCN';
        this.submitISCNTransfer();
        return;
      }
      // pay LIKE Pay
      this.mainStatus = 'onLIKEPay';
      await this.submitTransfer();
    },
    async submitTransfer() {
      if (this.isChainUpgrading) return;
      try {
        const { cosmosWallet } = this.getUserInfo;
        const amount = new BigNumber(this.totalAmount);
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('PLEASE_RELOGIN');
        }
        const userWallet = cosmosWallet;
        if (userWallet !== undefined && from !== userWallet && !this.isUsingKeplr) {
          this.setErrorMsg(this.$t('Transaction.error.authcoreWalletNotMatch'));
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
        const isWait = !!this.blocking;
        const metadata = this.likePayMetadata;
        // LIKEPay -> Upload Arweave -> Register ISCN flow
        const txHash = await this.sendCosmosPayment({
          signer,
          from,
          to,
          value: this.actualSendAmount,
          memo: this.remarks,
          showDialogAction: false,
          isWait,
          metadata,
          isWordPressSideBar: true,
        });
        // UI will change when getIsSignFinishedState is true.
        // Hence, no need to set mainStatus = onUploadArweave.
        this.postTransaction({ txHash });
      } catch (error) {
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      }
    },
    async postTransaction({ txHash, error } = {}) {
      if (this.redirectUri) {
        let success;
        if (this.blocking) {
          const { isFailed } = await getCosmosTransferInfo(txHash, { blocking: true });
          success = !isFailed;
        }
        const { state, remarks } = this;
        if (this.opener) {
          const payload = {};
          if (txHash) payload.tx_hash = txHash;
          if (error) payload.error = error;
          if (state) payload.state = state;
          if (remarks) payload.remarks = remarks;
          if (success !== undefined) payload.success = success;
          const message = JSON.stringify({
            action: 'TX_SUBMITTED',
            data: payload,
          });
          window.opener.postMessage(message, this.redirectOrigin);


          window.addEventListener(
            'message',
            this.onArweaveUploadSuccessStartRegisterISCNMessage,
            false,
          );
        } else if (this.isRedirectURLWhiteListed) {
          const url = new URL(this.redirectUri, true);
          if (txHash) url.query.tx_hash = txHash;
          if (error) url.query.error = error;
          if (state) url.query.state = state;
          if (remarks) url.query.remarks = remarks;
          if (success !== undefined) url.query.success = success;
          url.set('query', url.query);
          window.location.href = url.toString();
        }
      }
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    async onClickConnectKeplrButton() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
      await this.$router.push({
        name: 'in-widget-keplr',
        query: {
          to: 'like-arweave', amount: '1', remarks: 'lala', opener: 1, redirect_url: 'localhost:8080',
        },
      });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
  },
};
</script>

<style>
  @keyframes loading-progress-animation {
    0% {
      transform: translateX(-40px);
    }
    100% {
      transform: translateX(200px);
    }
  }
  .loading-track {
    overflow: hidden;

    width: 150px;
    height: 20px;

    border-radius: 10px;

    background-color: #AAF1E7;
  }
  .loading-progress {
    width: 60px;
    height: inherit;

    animation-name: loading-progress-animation;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

    border-radius: inherit;

    background-color: #50E3C2;
  }
</style>
