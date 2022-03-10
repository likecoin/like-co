<!-- eslint-disable max-len -->
<template>
  <div
    v-if="isLoading"
    key="loading"
    class="likepay-body likepay-body--center iscn-body"
  >
    <span class="likepay-text-panel">{{ $t('General.loading') }}</span>
  </div>
  <div
    v-else-if="mainStatus === 'initial'"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <span class="likepay-text-panel">{{ 'Please send ISCN data as postMessage, refer to docs.like.co for more info' }}</span>
      </section>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'pending'"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <span class="likepay-text-panel">{{ 'Ready. Waiting for ISCN Data...' }}</span>
      </section>
    </div>
  </div>
  <div
    v-else-if="getIsSignFinishedState || mainStatus === 'uploading'"
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
    v-else-if="mainStatus === 'registerISCN'"
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
          >{{ 'Sign  (2/2)' }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.ISCN.articleTitleTitle') }} </div>
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.ISCN.articleTitleValue', { title: iscnName }) }} </p> </div>
        </div>
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
      <section v-if="error">{{ error }}</section>
      <section
        v-if="transactionStatus !== 'pending'"
        style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px"
      >
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="onClickContinueRegister"
        >
          <span v-if="transactionStatus === 'failed'">
            {{ $t('ISCNARWidget.transaction.retry') }}
          </span>
          <span v-else>
            {{ $t('ISCNARWidget.transaction.submit') }}
          </span>
        </button>
      </section>
      <a
        v-if="showKeplrOverrideButton"
        href="#"
        style="text-align: center; font-size: 14px; color: #aaf1e7; margin: 10px; text-decoration: underline;"
        @click.prevent="onClickContinueRegister({ forceKeplr: true })"
      >
        {{ $t('ISCNARWidget.ISCN.keplr') }}
      </a>
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
    v-else-if="mainStatus === 'LIKEPaying'"
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
          <div style="margin-left: 75px;"> {{ $t('ISCNARWidget.LIKEPay.amount', { amount: arweaveFee }) }} </div>
        </div>
      </section>
      <section v-if="error">{{ error }}</section>
      <section
        v-if="transactionStatus !== 'pending'"
        style="display: flex; flex-direction: row; padding: 10px 10px 30px 10px"
      >
        <button
          style="
            color: #4A4A4A; border-radius: 12px; border: 2px solid #9B9B9B; margin: auto;
            padding: 10px 16px; background-color: white; cursor: pointer;"
          @click="submitTransfer"
        >
          <span v-if="transactionStatus === 'failed'">
            {{ $t('ISCNARWidget.transaction.retry') }}
          </span>
          <span v-else>
            {{ $t('ISCNARWidget.transaction.submit') }}
          </span>
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
    v-else-if="mainStatus === 'LIKEPay'"
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
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.ISCN.articleTitleValue', { title: iscnName }) }} </p> </div>
        </div>
        <div class="likepay-panel__section-meta">
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.LIKEPay.title') }} </div>
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.LIKEPay.amount', { amount: arweaveFee }) }} </p> </div>
        </div>
      </section>
      <section style="display: flex; flex-direction: row; padding: 10px">
        <div style="margin: auto 0 auto auto; color: #9B9B9B;"> {{ $t('ISCNARWidget.LIKEPay.titleAndAmount', { amount: arweaveFee }) }} </div>
        <button
          style="display: flex; flex-direction: row; background-color: #AAF1E7;
                 color: #28646E; border-radius: 12px; border: none; margin: 10px;
                 padding: 10px 15px; cursor: pointer"
          @click="onClickBeginRegister"
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
    <a
      v-if="showKeplrOverrideButton"
      href="#"
      style="text-align: center; font-size: 14px; color: #aaf1e7; margin: 10px; text-decoration: underline;"
      @click.prevent="onClickBeginRegister({ forceKeplr: true })"
    >
      {{ $t('ISCNARWidget.ISCN.keplr') }}
    </a>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import mime from 'mime-types';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  calculateGas as calculateCosmosGas,
} from '@/util/CosmosHelper';
import {
  apiArweaveEstimate,
  apiArweaveUpload,
} from '@/util/api/api';
import Keplr from '@/util/Keplr';
import { getISCNTransferInfo } from '@/util/cosmos/iscn/query';
import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscn/constant';
import { IS_TESTNET, STUB_WALLET } from '@/constant';
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
      isLoading: false,
      error: '',
      showWalletOption: true,
      arweaveFee: '0',
      arweaveGasFee: '',
      arweavePaymentInfo: null,
      arweaveResult: null,
      redirectUri: '',
      isUsingKeplr: false,
      mainStatus: 'initial',
      transactionStatus: 'initial',
      ISCNData: null,
      ISCNTotalFee: 0.00,
      ArrowRightNewIcon,
      ExclamationIcon,
      LedgerIcon,
      StarIcon,
    };
  },
  async asyncData({
    query,
    redirect,
  }) {
    const {
      redirect_uri: redirectUri,
      opener,
    } = query;
    if (!Object.keys(query).length) {
      return redirect('https://docs.like.co/developer/like-pay/web-widget/reference');
    }
    const hasOpener = opener && opener !== '0';
    return {
      redirectUri,
      opener: hasOpener,
    };
  },
  head() {
    return {
      title: 'ISCN Arweave widget',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getAuthCoreNeedReAuth',
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
    iscnName() {
      return (this.ISCNData && this.ISCNData.name);
    },
    fingerprints() {
      const f = (this.ISCNData && this.ISCNData.fingerprints) || [];
      if (this.arweaveResult) {
        if (this.arweaveResult.arweaveId) f.push(`ar://${this.arweaveResult.arweaveId}`);
        if (this.arweaveResult.ipfsHash) f.push(`ipfs://${this.arweaveResult.ipfsHash}`);
      }
      return f;
    },
    showKeplrOverrideButton() {
      return this.showWalletOption && this.getUserIsRegistered && !this.isUsingKeplr;
    },
  },
  async mounted() {
    if (this.opener && !window.opener) {
      this.$nuxt.error({ statusCode: 400, message: 'Cannot access window opener' });
    }
    window.addEventListener(
      'message',
      this.onWindowMessage,
      false,
    );
  },
  methods: {
    ...mapActions([
      'sendCosmosPayment',
      'fetchCurrentCosmosWallet',
      'prepareCosmosTxSigner',
      'setDefaultCosmosWalletSource',
      'calculateISCNTxTotalFee',
      'sendISCNSignature',
      'setReAuthDialogShow',
    ]),
    onWindowMessage(event) {
      if (event && event.data && typeof event.data === 'string') {
        // if (this.redirectOrigin && event.origin !== this.redirectOrigin) {
        //   return;
        // }
        const { action, data } = JSON.parse(event.data);
        if (action === 'SUBMIT_ISCN_DATA') {
          const {
            metadata = {},
            files = [],
          } = data;
          this.onReceiveISCNData(metadata);
          this.onReceiveISCNFiles(files);
        } else if (action === 'INIT_WIDGET') {
          if (this.mainStatus === 'initial') {
            this.mainStatus = 'pending';
          }
        }
      }
    },
    async onReceiveISCNFiles(data) {
      if (!Array.isArray(data)) return;
      if (!data.every(d => d.filename && d.data)) return;
      const dataWithBlob = await Promise.all(data.map(async (d) => {
        const mimeType = d.mimeType || mime.lookup(d.filename) || 'text/plain';
        const resData = await fetch(`data:${mimeType};base64,${d.data}`);
        const blob = await resData.blob();
        return {
          filename: d.filename,
          blob,
        };
      }));
      this.ISCNFiles = dataWithBlob.reduce((acc, cur) => {
        acc[cur.filename] = cur.blob;
        return acc;
      }, {});
      try {
        this.isLoading = true;
        const { data: resData } = await apiArweaveEstimate(this.ISCNFiles);
        this.arweavePaymentInfo = resData;
        this.prepareLikePayWidget();
      } finally {
        this.isLoading = false;
      }
    },
    async onReceiveISCNData(data) {
      const {
        fingerprints = [],
        tags = [],
        url,
        publisher,
        author,
        authorDescription,
        description,
      } = data;
      let {
        license,
        type,
        name,
      } = data;
      type = type || 'article';
      if (publisher) {
        if (!ISCN_PUBLISHERS[publisher]) {
          this.$nuxt.error({ statusCode: 400, message: 'INVALID_PUBLISHER' });
        }
        ({ license } = ISCN_PUBLISHERS[publisher]);
      }
      if (license) {
        if (!ISCN_LICENSES[license]) {
          this.$nuxt.error({ statusCode: 400, message: 'INVALID_LICENSE' });
        }
      } else {
        license = '';
      }
      if (name) {
        name = name.substring(0, 255);
      }
      const ISCNData = {
        fingerprints,
        name,
        type,
        author,
        authorDescription,
        description,
        tags,
        license,
        publisher,
        url,
      };
      this.ISCNData = ISCNData;
    },
    async prepareLikePayWidget() {
      const {
        LIKE,
        arweaveId,
        ipfsHash,
      } = this.arweavePaymentInfo;
      if (arweaveId || !LIKE || LIKE === '0') {
        if (arweaveId) this.arweaveResult = { arweaveId, ipfsHash };
        this.prepareISCNWidget();
        return;
      }
      this.arweaveFee = LIKE;
      await this.calculateGasFee();
      this.mainStatus = 'LIKEPay';
    },
    async prepareISCNWidget() {
      this.mainStatus = 'registerISCN';
      const {
        name,
        type,
        author,
        authorDescription,
        description,
        tags,
        license,
        publisher,
        url,
      } = this.ISCNData;
      this.ISCNTotalFee = await this.calculateISCNTxTotalFee({
        userId: this.getUserId,
        displayName: this.getUserInfo.displayName || author,
        authorDescription,
        description,
        cosmosWallet: STUB_WALLET,
        fingerprints: this.fingerprints,
        name,
        tags,
        type,
        license,
        publisher,
        url,
      });
      if (!this.showWalletOption) this.submitISCNTransfer();
    },
    async submitISCNTransfer() {
      this.showWalletOption = false;
      this.error = '';
      this.transactionStatus = 'pending';
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
          name,
          tags,
          type,
          license,
          url,
        } = this.ISCNData;
        const txHash = await this.sendISCNSignature({
          cosmosWallet: from,
          userId: this.getUserId || '',
          displayName: this.getUserInfo.displayName || this.author || '',
          authorDescription: this.authorDescription,
          description: this.description,
          fingerprints: this.fingerprints,
          name,
          tags,
          type,
          license,
          url,
          signer,
          shouldShowTxDialog: false,
        });
        this.transactionStatus = 'done';
        this.mainStatus = 'uploading';
        if (txHash) await this.postISCNTransaction({ txHash });
      } catch (error) {
        this.transactionStatus = 'failed';
        this.error = error;
        console.error(error);
      }
    },
    async postISCNTransaction({ txHash, error } = {}) {
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
        }
        const iscnIdString = encodeURIComponent(iscnId);
        window.location.href = `https://app.${IS_TESTNET ? 'rinkeby.' : ''}like.co/view/${iscnIdString}?layout=popup`;
      }
    },
    async onClickContinueRegister({ forceKeplr = false } = {}) {
      if (!this.isUsingKeplr) {
        if (!forceKeplr && this.getUserIsRegistered) {
          if (this.getAuthCoreNeedReAuth) {
            this.setReAuthDialogShow(true);
            return;
          }
        } else {
          await this.connectKeplr();
        }
      }
      this.submitISCNTransfer();
    },
    async onClickBeginRegister({ forceKeplr = false } = {}) {
      if (!forceKeplr && this.getUserIsRegistered) {
        if (this.getAuthCoreNeedReAuth) {
          this.setReAuthDialogShow(true);
          return;
        }
      } else {
        await this.connectKeplr();
      }
      this.beginLikePay();
    },
    async connectKeplr() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
    },
    async beginLikePay() {
      this.mainStatus = 'LIKEPaying';
      await this.submitTransfer();
    },
    async calculateGasFee() {
      const { feeAmount } = await calculateCosmosGas([STUB_WALLET]);
      this.arweaveGasFee = BigNumber(feeAmount[0].amount).dividedBy(1e9).toFixed();
      return this.arweaveGasFee;
    },
    async submitTransfer() {
      this.showWalletOption = false;
      this.error = '';
      this.transactionStatus = 'pending';
      const {
        memo,
        address: to,
      } = this.arweavePaymentInfo;
      try {
        const amount = new BigNumber(this.arweaveFee).plus(this.arweaveGasFee);
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('PLEASE_RELOGIN');
        }
        if (!this.isUsingKeplr) {
          const { cosmosWallet } = this.getUserInfo;
          const userWallet = cosmosWallet;
          if (userWallet !== undefined && from !== userWallet && !this.isUsingKeplr) {
            throw new Error('VALIDATION_FAIL');
          }
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        if (amount.gt(balance)) {
          throw new Error('INSUFFICIENT_BALANCE');
        }
        const signer = await this.prepareCosmosTxSigner();
        const txHash = await this.sendCosmosPayment({
          signer,
          from,
          to,
          value: this.arweaveFee,
          memo,
          showDialogAction: false,
          shouldShowTxDialog: false,
        });
        this.transactionStatus = 'done';
        this.postArweaveTxTransaction({ txHash });
      } catch (error) {
        this.transactionStatus = 'failed';
        this.error = error;
        if (error.message !== 'VALIDATION_FAIL') console.error(error);
      }
    },
    async postArweaveTxTransaction({ txHash, error } = {}) {
      if (this.redirectUri) {
        try {
          if (this.opener) {
            const payload = {};
            if (txHash) payload.tx_hash = txHash;
            if (error) payload.error = error;
            const message = JSON.stringify({
              action: 'TX_SUBMITTED',
              data: payload,
            });
            window.opener.postMessage(message, this.redirectOrigin);
          }
        } catch (err) {
          console.error(err);
        }
      }
      try {
        this.mainStatus = 'uploading';
        const { data: resData } = await apiArweaveUpload(this.ISCNFiles, txHash);
        this.arweaveResult = resData;
        if (this.opener) {
          try {
            const message = JSON.stringify({
              action: 'ARWEAVE_SUBMITTED',
              data: resData,
            });
            window.opener.postMessage(message, this.redirectOrigin);
          } catch (err) {
            console.error(err);
          }
        }
        this.prepareISCNWidget();
      } finally {
        this.isLoading = false;
      }
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
