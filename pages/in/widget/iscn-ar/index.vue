<!-- eslint-disable max-len -->
<template>
  <div
    v-if="mainStatus === 'registerISCN'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ 'Sign  (2/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center">
            <h3 style="color: #9B9B9B;">{{ $t('ISCNARWidget.upload.success') }}</h3>
          </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB" />
        </div>
        <div
          class="likepay-panel__section-meta"
          style="margin-top: 5px; display: flex; flex-direction: row;"
        >
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.ISCN.feeTitle') }} </div>
          <div style="margin-left: 75px;"> {{ $t('ISCNARWidget.ISCN.feeAmount', { ISCNTotalFee }) }} </div>
        </div>
      </section>
      <section
        v-if="getIsTxFailed && transactionStatus === 'failed'"
        style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px"
      >
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
    <div style="display: flex; flex-direction: row; margin: 52px 0px; position: absolute; top: 590px">
      <div>
        <simple-svg
          :filepath="ExclamationIcon"
          width="25"
          height="24"
        />
      </div>
      <div style="margin: 0 10px">
        <simple-svg
          :filepath="LedgerIcon"
          width="101"
          height="20"
        />
      </div>
      <div>
        <div>{{ $t('ISCNARWidget.ledger.warning') }}</div>
        <div>{{ $t('ISCNARWidget.ledger.unavailable') }}</div>
      </div>
    </div>
  </div>
  <div
    v-else-if="getIsSignFinishedState"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div class="likepay-panel__header-title" style="margin-right: auto; color: #28646E; padding-left: 10px">{{ $t('ISCNARWidget.upload.inProcess') }}</div>
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
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">{{ $t('ISCNARWidget.transaction.doNotCloseReminder') }} </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB" />
        </div>
        <div class="likepay-panel__section-meta">
          <div style="font-size: 14px">
            <div>{{ $t('ISCNARWidget.upload.waiting') }} </div>
            <div>{{ $t('ISCNARWidget.transaction.signAgain') }} </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'LIKEPay'"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; color: #28646E; padding-left: 10px"
          >{{ $t('ISCNARWidget.transaction.firstStep') }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: center"> <h3 style="color: #9B9B9B; margin: 0 -6px">{{ $t('ISCNARWidget.transaction.reminder') }} </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div style="width: 32px; border: 2px solid #EBEBEB; background-color:#EBEBEB" />
        </div>
        <div
          class="likepay-panel__section-meta"
          style="margin-top: 5px; display: flex; flex-direction: row;"
        >
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.LIKEPay.title') }} </div>
          <div style="margin-left: 75px;"> {{ $t('ISCNARWidget.LIKEPay.amount', { amount: amounts[0] }) }} </div>
        </div>
      </section>
      <section
        v-if="getIsTxFailed && transactionStatus === 'failed'"
        style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px"
      >
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitTransfer"
        >
          {{ $t('ISCNARWidget.transaction.retry') }}
        </button>
      </section>
    </div>
    <div style="display: flex; flex-direction: row; margin: 52px 0px; position: absolute; top: 590px">
      <div>
        <simple-svg
          :filepath="ExclamationIcon"
          width="25"
          height="24"
        />
      </div>
      <div style="margin: 0 10px">
        <simple-svg
          :filepath="LedgerIcon"
          width="101"
          height="20"
        />
      </div>
      <div>
        <div>{{ $t('ISCNARWidget.ledger.warning') }}</div>
        <div>{{ $t('ISCNARWidget.ledger.unavailable') }}</div>
      </div>
    </div>
  </div>
  <div
    v-else
    key="panel"
    class="likepay-body"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header class="likepay-panel__section-header">
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; color: #28646E; padding-left: 10px"
          >{{ $t('ISCNARWidget.ISCN.action') }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.ISCN.articleTitleTitle') }} </div>
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.ISCN.articleTitleValue', { title }) }} </p> </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.LIKEPay.title') }} </div>
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.LIKEPay.amount', { amount: transactionFee }) }} </p> </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px">
        <div style="margin: auto 0 auto auto; color: #9B9B9B;"> {{ $t('ISCNARWidget.LIKEPay.titleAndAmount', { amount: transactionFee }) }} </div>
        <button
          style="display: flex; flex-direction: row; background-color: #AAF1E7;
                 color: #28646E; border-radius: 12px; border: none; margin: 10px;
                 padding: 10px 15px; cursor: pointer"
          @click="onClickRedirectToKeplrSign"
        >
          <p style="margin: auto 10px auto auto; font-weight: 600;">{{ $t('ISCNARWidget.ISCN.register') }}</p>
          <simple-svg
            :filepath="ArrowRightNewIcon"
            width="16"
            height="16"
          />
        </button>
      </section>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  IS_CHAIN_UPGRADING,
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
import ArrowRightNewIcon from '@/assets/icons/arrow-right-new.svg';
import ExclamationIcon from '@/assets/icons/exclamation.svg';
import LedgerIcon from '@/assets/icons/ledger-new.svg';
import StarIcon from '@/assets/icons/star.svg';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      toIds: [],
      toUsers: [],
      amounts: [],
      transactionFee: 0,
      redirectUri: '',
      showDetails: false,
      gasFee: '',
      isUsingKeplr: false,
      mainStatus: 'initial',
      transactionStatus: 'initial',
      fingerprints: [],
      title: '',
      type: 'article',
      author: '',
      authorDescription: '',
      ISCNDescription: '',
      tags: [],
      license: '',
      publisher: '',
      memo: '',
      url: '',
      ISCNTotalFee: 0.00,
      ArrowRightNewIcon,
      ExclamationIcon,
      LedgerIcon,
      StarIcon,
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
      redirect_uri: redirectUri,
      opener,
      fingerprint,
      tags: tagsString = '',
      url,
      publisher,
      author,
      author_description: authorDescription,
      ISCN_description: ISCNDescription,
    } = query;
    let {
      remarks = '', title, license,
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
      license = '';
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
    if (remarks) {
      remarks = remarks.substring(0, 255);
    }
    let promises = [];
    promises.push(Promise.resolve(null));
    promises = promises.concat(toIds.map(id => apiGetUserMinById(id, { type: 'payment' })));

    return Promise.all(promises).then((res) => {
      const [, ...toRes] = res;
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
      if (toUsers.some(u => !u.cosmosWallet)) {
        error({ statusCode: 400, message: 'RECEIPIENT_HAS_NO_WALLET' });
      }
      const hasOpener = opener && opener !== '0';

      return {
        toIds,
        amounts,
        toUsers,
        redirectUri,
        remarks,
        opener: hasOpener,
        title,
        author,
        authorDescription,
        ISCNDescription,
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
      'getUserInfo',
      'getIsSignFinishedState',
      'getIsTxFailed',
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
    sumOfToAmount() {
      if (!this.amounts) return '0';
      const amount = this.amounts.reduce(
        (acc, a) => acc.plus(a),
        new BigNumber(0),
      );
      return amount.toFixed();
    },
    actualSendAmount() {
      const amount = new BigNumber(this.sumOfToAmount);
      return amount.toFixed();
    },
    shouldSkipLIKEPay() {
      return this.actualSendAmount === '0';
    },
    totalAmount() {
      let amount = new BigNumber(this.actualSendAmount);
      if (this.gasFee) amount = amount.plus(this.gasFee);
      return amount.toFixed();
    },
    likePayMetadata() {
      const {
        toIds,
        amounts,
        redirectUri,
        remarks,
      } = this;
      return {
        likePay: {
          toIds,
          amounts,
          redirectUri,
          remarks,
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
    if (this.opener && !window.opener) {
      this.$nuxt.error({ statusCode: 400, message: 'Cannot access window opener' });
    }
    this.ISCNTotalFee = await this.calculateISCNTxTotalFee({
      userId: this.getUserId,
      displayName: this.getUserInfo.displayName || this.author,
      authorDescription: this.authorDescription,
      ISCNDescription: this.ISCNDescription,
      cosmosWallet,
      fingerprints,
      name: title,
      tags,
      type,
      license,
      url,
    });
    this.transactionFee = this.shouldSkipLIKEPay ? this.ISCNTotalFee : this.amounts[0];
  },
  methods: {
    ...mapActions([
      'sendCosmosPayment',
      'fetchCurrentCosmosWallet',
      'prepareCosmosTxSigner',
      'setDefaultCosmosWalletSource',
      'calculateISCNTxTotalFee',
      'sendISCNSignature',
    ]),
    async calculateGasFee() {
      const { feeAmount } = await calculateCosmosGas(this.toUsers);
      this.gasFee = BigNumber(feeAmount[0].amount).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async onStartRegisterISCNMessage(event) {
      if (event && event.data && typeof event.data === 'string') {
        const { action, data } = JSON.parse(event.data);
        if (action === 'REGISTER_ISCN') {
          this.mainStatus = 'registerISCN';
          const {
            fingerprints, tags, url, type, license, author, authorDescription, ISCNDescription,
          } = data;
          this.fingerprints = fingerprints;
          this.tags = tags;
          this.url = url;
          this.type = type;
          this.license = license;
          this.author = author;
          this.authorDescription = authorDescription;
          this.ISCNDescription = ISCNDescription;
          await this.submitISCNTransfer();
        }
      }
    },
    async submitISCNTransfer() {
      this.transactionStatus = 'restart';
      try {
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('PLEASE_RELOGIN');
        }
        if (!this.isUsingKeplr) {
          const { cosmosWallet } = this.getUserInfo;
          const userWallet = cosmosWallet;
          if (userWallet !== undefined && from !== userWallet) {
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
          displayName: this.getUserInfo.displayName || this.author || '',
          authorDescription: this.authorDescription,
          ISCNDescription: this.ISCNDescription,
          fingerprints,
          name: title,
          tags,
          type,
          license,
          url,
          signer,
          shouldShowTxDialog: false,
        });
        if (txHash) await this.postISCNTransaction({ txHash });
      } catch (error) {
        this.transactionStatus = 'failed';
        console.error(error);
      }
    },
    async postISCNTransaction({ txHash, error } = {}) {
      this.transactionStatus = 'done';
      if (this.opener || this.redirectUri) {
        const ISCNTransferInfo = await getISCNTransferInfo(txHash, { blocking: true });
        const {
          isFailed, iscnId, iscnVersion, timestamp,
        } = ISCNTransferInfo;
        const success = !isFailed;
        const payload = {};
        if (txHash) payload.tx_hash = txHash;
        if (iscnId) payload.iscnId = iscnId;
        if (iscnVersion) payload.iscnVersion = iscnVersion;
        if (timestamp) payload.timestamp = timestamp;
        if (error) payload.error = error;
        if (success !== undefined) payload.success = success;
        if (this.opener) {
          const message = JSON.stringify({
            action: 'ISCN_SUBMITTED',
            data: payload,
          });
          window.opener.postMessage(message, this.redirectOrigin);
          const iscnIdString = encodeURIComponent(iscnId);
          window.location.href = `https://app.like.co/view/${iscnIdString}?layout=popup`;
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
      if (this.shouldSkipLIKEPay) {
        this.mainStatus = 'registerISCN';
        this.submitISCNTransfer();
        return;
      }
      // pay LIKE Pay
      this.mainStatus = 'LIKEPay';
      [this.transactionFee] = this.amounts;
      await this.submitTransfer();
    },
    async submitTransfer() {
      this.transactionStatus = 'restart';
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
          throw new Error('VALIDATION_FAIL');
        }
        const to = this.toUsers[0].cosmosWallet;
        if (from === to) {
          throw new Error('VALIDATION_FAIL');
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        if (amount.gt(balance)) {
          throw new Error('INSUFFICIENT_BALANCE');
        }
        const signer = await this.prepareCosmosTxSigner();
        const metadata = this.likePayMetadata;
        // LIKEPay -> Upload Arweave -> Register ISCN flow
        const txHash = await this.sendCosmosPayment({
          signer,
          from,
          to,
          value: this.actualSendAmount,
          memo: this.remarks,
          showDialogAction: false,
          metadata,
          shouldShowTxDialog: false,
        });
        // UI will change when getIsSignFinishedState is true.
        // Hence, no need to set mainStatus = onUploadArweave.
        this.postTransaction({ txHash });
      } catch (error) {
        this.transactionStatus = 'failed';
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      }
    },
    async postTransaction({ txHash, error } = {}) {
      this.transactionStatus = 'done';
      if (this.redirectUri) {
        const { isFailed } = await getCosmosTransferInfo(txHash, { blocking: true });
        const success = !isFailed;
        const { remarks } = this;
        if (this.opener) {
          const payload = {};
          if (txHash) payload.tx_hash = txHash;
          if (error) payload.error = error;
          if (remarks) payload.remarks = remarks;
          if (success !== undefined) payload.success = success;
          const message = JSON.stringify({
            action: 'TX_SUBMITTED',
            data: payload,
          });
          window.opener.postMessage(message, this.redirectOrigin);
          window.addEventListener(
            'message',
            this.onStartRegisterISCNMessage,
            false,
          );
        }
      }
    },
    async onClickConnectKeplrButton() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
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
