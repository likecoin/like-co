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
      v-if="getUserIsRegistered && !isUsingKeplr"
      href="#"
      style="text-align: center; font-size: 14px; color: #aaf1e7; margin: 10px; text-decoration: underline;"
      @click.prevent="onClickConnectKeplr"
    >
      {{ $t('ISCNARWidget.ISCN.keplr') }}
    </a>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  getTransferInfo as getCosmosTransferInfo,
  calculateGas as calculateCosmosGas,
} from '@/util/CosmosHelper';
import Keplr from '@/util/Keplr';
import { getISCNTransferInfo } from '@/util/cosmos/iscn/query';
import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscn/constant';
import { STUB_WALLET } from '@/constant';
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
      toIds: ['like-arweave'],
      amounts: [],
      transactionFee: 0,
      redirectUri: '',
      gasFee: '',
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
      'setReAuthDialogShow',
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
    ]),
    onWindowMessage(event) {
      if (event && event.data && typeof event.data === 'string') {
        if (this.redirectOrigin && event.origin !== this.redirectOrigin) {
          return;
        }
        const { action, data } = JSON.parse(event.data);
        if (action === 'SUBMIT_ISCN_METADATA') {
          this.onReceiveISCNData(data);
        } else if (action === 'SUBMIT_ISCN_FILES') {
          this.onReceiveISCNFiles(data);
        }
      }
    },
    async calculateGasFee() {
      const { feeAmount } = await calculateCosmosGas(this.toUsers);
      this.gasFee = BigNumber(feeAmount[0].amount).dividedBy(1e9).toFixed();
      return this.gasFee;
    },
    async onReceiveISCNFiles() {
      //
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
        fingerprints: [],
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
      this.ISCNTotalFee = await this.calculateISCNTxTotalFee({
        userId: this.getUserId,
        displayName: this.getUserInfo.displayName || this.author,
        authorDescription: this.authorDescription,
        description: this.description,
        cosmosWallet: STUB_WALLET,
        fingerprints,
        name,
        tags,
        type,
        license,
        url,
      });
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
          fingerprints,
          name,
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
    async onClickBeginRegister() {
      if (this.getUserIsRegistered) {
        if (this.getAuthCoreNeedReAuth) {
          this.setReAuthDialogShow(true);
          return;
        }
        this.beginLikePay();
      } else {
        await this.onClickConnectKeplr();
      }
    },
    async onClickConnectKeplr() {
      const res = await Keplr.initKeplr();
      if (!res) {
        throw new Error('FAILED_CONNECT_TO_KEPLR');
      }
      this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
      this.isUsingKeplr = true;
      await this.beginLikePay();
    },
    async beginLikePay() {
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
      try {
        const amount = new BigNumber(this.totalAmount);
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
      this.mainStatus = 'registerISCN';
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
        }
      }
      this.submitISCNTransfer();
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
