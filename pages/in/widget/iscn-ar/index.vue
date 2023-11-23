<!-- eslint-disable max-len -->
<template>
  <div
    v-if="isLoading"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <div class="likepay-text-panel">{{ $t('General.loading') }}</div>
      </section>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'initial'"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E"
          >{{ $t('ISCNARWidget.title') }}</div>
        </header>
        <div
          class="likepay-panel__section-meta"
          style="color: #462405"
        >
          {{ $t('ISCNARWidget.Introduction.initial') }}
        </div>
        <div
          class="likepay-panel__section-meta"
          style="text-decoration: underline;"
        >
          <a
            href="https://docs.like.co/developer/iscn/web-widget/iscn-ar/reference"
            target="_blank"
          >{{ $t('ISCNARWidget.Introduction.document') }}</a>
        </div>
      </section>
    </div>
  </div>
  <div
    v-else-if="mainStatus === 'pending'"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E"
          >{{ $t('ISCNARWidget.title') }}</div>
        </header>
        <div class="likepay-panel__section-meta">
          <div style="text-align:left ">
            <h3 style="color: #9B9B9B;">{{ $t('ISCNARWidget.Introduction.ready') }}</h3>
          </div>
        </div>
      </section>
      <KeplrNotFound v-if="isKeplrNotFound" />
    </div>
  </div>

  <div
    v-else-if="mainStatus === 'IscnUploading'"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E"
          >{{ $t('ISCNARWidget.ISCN.registering') }}</div>
        </header>
        <div class="likepay-panel__section-meta">
          <div
            style="display: flex;

 margin-top: 32px; margin-bottom: 20px;"
          >
            <div
              class="loading-track"
              style="margin: auto"
            >
              <div class="loading-progress" />
            </div>
          </div>
          <div
            style=" margin-bottom: 24px;

text-align: center;"
          > <h3 style="color: #9B9B9B">{{ $t('ISCNARWidget.transaction.doNotCloseReminder') }} </h3></div>
        </div>
      </section>
    </div>
  </div>

  <div
    v-else-if="mainStatus === 'uploading'"
    class="likepay-body likepay-body--center"
  >
    <div class="iscn-ar-panel">
      <section class="likepay-panel__section-container">
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E"
          >{{ $t('ISCNARWidget.upload.inProcess') }}</div>
        </header>
        <div class="likepay-panel__section-meta">
          <div
            style="display: flex;

 margin-top: 32px; margin-bottom: 20px;"
          >
            <div
              class="loading-track"
              style="margin: auto"
            >
              <div class="loading-progress" />
            </div>
          </div>
          <div
            style=" margin-bottom: 24px;

text-align: center;"
          > <h3 style="color: #9B9B9B">{{ $t('ISCNARWidget.transaction.doNotCloseReminder') }} </h3></div>
        </div>
        <div class="likepay-panel__section-meta">
          <div
            style="width: 32px;

 border: 2px solid #EBEBEB; background-color:#EBEBEB"
          />
        </div>
        <div class="likepay-panel__section-meta">
          <div style="font-size: 14px">
            <div>{{ $t('ISCNARWidget.upload.waiting') }} </div>
            <div>{{ $t('ISCNARWidget.upload.signAgain') }} </div>
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
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E;"
          >{{ $t('ISCNARWidget.transaction.secondStep') }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div style="text-align: left">
            <h3 style="color: #9B9B9B;">{{ $t('ISCNARWidget.upload.success') }}</h3>
          </div>
        </div>

        <div
          class="likepay-panel__section-meta"
          style="margin-top: 16px;"
        >
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.ISCN.articleTitleTitle') }} </div>
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.ISCN.articleTitleValue', { title: iscnName }) }} </p> </div>
        </div>

        <div
          class="likepay-panel__section-meta"
          style=" display: flex; flex-direction: column;

margin-top: 16px;"
        >
          <div
            class="likepay-panel__section-meta-label"
          > {{ $t('ISCNARWidget.ISCN.feeTitle') }} </div>
          <div
            v-if="ISCNTotalFee"
            style="margin-top: 10px"
          >
            {{ $t('ISCNARWidget.ISCN.feeAmount', { ISCNTotalFee }) }}
          </div>
        </div>
      </section>

      <KeplrNotFound v-if="isKeplrNotFound" />
      <section
        v-if="error && !isKeplrNotFound"
        class="likepay-panel__section-container"
      >
        <div class="likepay-panel__section-meta">
          {{ error }}
        </div>
      </section>

      <section
        v-if="transactionStatus !== 'pending'"
        style="display: flex; flex-direction: row;

 padding: 10px 10px 30px 10px"
      >
        <button
          style=" margin: auto;
            padding: 10px 15px;

 cursor: pointer;

            color: #28646E; border: none; border-radius: 12px;background-color: #AAF1E7"
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
    </div>
    <a
      v-if="showKeplrOverrideButton"
      href="#"
      style=" margin: 10px;

text-align: center; text-decoration: underline;

 color: #aaf1e7;

 font-size: 14px;"
      @click.prevent="onClickContinueRegister({ forceKeplr: true })"
    >
      {{ $t('ISCNARWidget.ISCN.keplr') }}
    </a>
    <div v-if="getUserIsRegistered">
      <nuxt-link
        :to="{ name: 'in-logout' }"
        style=" margin: 10px;

text-align: center; text-decoration: underline;

 color: #aaf1e7;

 font-size: 14px;"
      >
        {{ $t('Menu.item.logout') }}
      </nuxt-link>
    </div>
    <div
      style=" position: absolute; top: 590px;

display: flex; flex-direction: row;

 margin: 52px 0px"
    >
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
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E"
          >{{ $t('ISCNARWidget.transaction.firstStep') }}</div>
        </header>

        <div class="likepay-panel__section-meta">
          <div
            style=" margin-top: 32px; margin-bottom: 32px;

text-align: left;"
          > <h3 style="color: #9B9B9B">{{ $t('ISCNARWidget.transaction.reminder') }} </h3></div>
        </div>
        <div
          class="likepay-panel__section-meta"
          style=" display: flex; flex-direction: column;

margin-top: 16px;"
        >
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.LIKEPay.fee') }} </div>
          <div
            v-if="arweaveFee"
            style="margin-top: 10px"
          > {{ $t('ISCNARWidget.LIKEPay.amount', { amount: arweaveFee }) }} </div>
        </div>
      </section>

      <KeplrNotFound v-if="isKeplrNotFound" />
      <section
        v-if="error && !isKeplrNotFound"
        class="likepay-panel__section-container"
      >
        <div class="likepay-panel__section-meta">
          {{ error }}
        </div>
      </section>

      <section
        v-if="transactionStatus !== 'pending'"
        style="display: flex; flex-direction: row;

 padding: 10px 10px 30px 10px"
      >
        <button
          style=" margin: auto;
            padding: 10px 15px;

 cursor: pointer;

            color: #28646E; border: none; border-radius: 12px;background-color: #AAF1E7"
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
    <div
      style=" position: absolute; top: 590px;

display: flex; flex-direction: row;

 margin: 52px 0px"
    >
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
        <header
          class="likepay-panel__section-header"
          style="margin-bottom: 24px"
        >
          <simple-svg
            :filepath="StarIcon"
            width="20"
            height="20"
          />
          <div
            class="likepay-panel__header-title"
            style="margin-right: auto; padding-left: 10px;

 color: #28646E"
          >{{ $t('ISCNARWidget.ISCN.action') }}</div>
        </header>
        <div
          class="likepay-panel__section-meta"
          style=" display: flex; flex-direction: column;

margin-top: 16px;"
        >
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.ISCN.articleTitleTitle') }} </div>
          <div style="margin-top: 10px"> <p> {{ $t('ISCNARWidget.ISCN.articleTitleValue', { title: iscnName }) }} </p> </div>
        </div>
        <div
          class="likepay-panel__section-meta"
          style=" display: flex; flex-direction: column;

margin-top: 16px;"
        >
          <div class="likepay-panel__section-meta-label"> {{ $t('ISCNARWidget.LIKEPay.fee') }} </div>
          <div
            v-if="arweaveFee"
            style="margin-top: 10px"
          > <p> {{ $t('ISCNARWidget.LIKEPay.amount', { amount: arweaveFee }) }} </p> </div>
        </div>
      </section>


      <KeplrNotFound v-if="isKeplrNotFound" />
      <section
        v-if="error && !isKeplrNotFound"
        class="likepay-panel__section-container"
      >
        <div class="likepay-panel__section-meta">
          {{ error }}
        </div>
      </section>

      <section
        style="display: flex; flex-direction: row; justify-content: flex-end;

 padding: 10px"
      >
        <button
          style="display: flex; flex-direction: row;

 margin: 10px;
                 padding: 10px 15px;

 cursor: pointer;

                 color: #28646E; border: none; border-radius: 12px; background-color: #AAF1E7"
          @click="onClickBeginRegister"
        >
          <p
            style="margin: auto 10px auto auto;

 font-weight: 600;"
          >{{ $t('ISCNARWidget.ISCN.register') }}</p>
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
      style=" margin: 10px;

text-align: center; text-decoration: underline;

 color: #aaf1e7;

 font-size: 14px;"
      @click.prevent="onClickBeginRegister({ forceKeplr: true })"
    >
      {{ $t('ISCNARWidget.ISCN.keplr') }}
    </a>
    <div v-if="getUserIsRegistered">
      <nuxt-link
        :to="{ name: 'in-logout' }"
        style=" margin: 10px;

text-align: center; text-decoration: underline;

 color: #aaf1e7;

 font-size: 14px;"
      >
        {{ $t('Menu.item.logout') }}
      </nuxt-link>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import mime from 'mime-types';
import querystring from 'querystring';
import { timeout } from '@/util/misc';
import { checkIsMobileClient } from '~/util/client';
import { checkISCNIdValid } from '~/util/ValidationHelper';
import {
  queryLikeCoinBalance as queryCosmosLikeCoinBalance,
  calculateGas as calculateCosmosGas,
} from '@/util/CosmosHelper';
import {
  apiArweaveEstimate,
  apiArweaveUpload,
} from '@/util/api/api';
import Keplr from '@/util/Keplr';
import { getISCNTransferInfo, getISCNInfoById } from '@/util/cosmos/iscn/query';
import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscn/constant';
import { IS_CHAIN_UPGRADING, IS_TESTNET, STUB_WALLET } from '@/constant';
import ArrowRightNewIcon from '@/assets/icons/arrow-right-new.svg';
import ExclamationIcon from '@/assets/icons/exclamation.svg';
import LedgerIcon from '@/assets/icons/ledger-new.svg';
import StarIcon from '@/assets/icons/star.svg';
import KeplrNotFound from '~/components/KeplrNotFound';

const URL = require('url-parse');

export default {
  name: 'payment',
  layout: 'likepay',
  components: {
    KeplrNotFound,
  },
  data() {
    return {
      isLoading: false,
      error: '',
      showWalletOption: true,
      arweaveFee: '0',
      arweaveGasFee: '',
      arweavePaymentInfo: null,
      arweaveResult: null,
      iscnId: this.$route.query.iscn_id,
      mintNFT: this.$route.query.mint,
      redirectUri: this.$route.query.redirect_uri,
      opener: this.$route.query.opener && this.$route.query.opener !== '0',
      isUsingKeplr: false,
      mainStatus: 'initial',
      transactionStatus: 'initial',
      ISCNData: null,
      ISCNFiles: [],
      ISCNTotalFee: null,
      ArrowRightNewIcon,
      ExclamationIcon,
      LedgerIcon,
      StarIcon,
      isMobileClient: false,
      existingISCNInfo: null,
      isKeplrNotFound: false,
    };
  },
  async asyncData({
    query,
  }) {
    const {
      redirect_uri: redirectUri,
      opener,
      iscn_id: iscnId,
    } = query;
    const hasOpener = opener && opener !== '0';
    return {
      redirectUri,
      opener: hasOpener,
      iscnId,
    };
  },
  head() {
    return {
      title: this.$t('ISCNARWidget.title'),
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getAuthCoreNeedReAuth',
      'getUserInfo',
      'getIsTxFailed',
    ]),
    isChainUpgrading() {
      return IS_CHAIN_UPGRADING;
    },
    redirectOrigin() {
      const url = new URL(this.redirectUri, true);
      return url.origin;
    },
    windowOpener() {
      if (!window) return null;
      return window.opener;
    },
    isUpdateMode() {
      return !!this.iscnId;
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
      return [...new Set(f)];
    },
    existingOwner() {
      return this.existingISCNInfo && this.existingISCNInfo.owner;
    },
    showKeplrOverrideButton() {
      return this.showWalletOption
        && (this.isMobileClient || this.getUserIsRegistered)
        && !this.isUsingKeplr;
    },
    viewISCNPageURL() {
      const iscnIdString = encodeURIComponent(this.iscnId);
      const {
        // eslint-disable-next-line no-unused-vars
        iscn_id: iscnId,
        // eslint-disable-next-line no-unused-vars
        language,
        ...queries
      } = this.$route.query;
      return `https://app.${IS_TESTNET ? 'rinkeby.' : ''}like.co/view/${iscnIdString}?layout=popup&${querystring.stringify(queries)}`;
    },
    mintISCNPageURL() {
      const iscnIdString = encodeURIComponent(this.iscnId);
      const {
        // eslint-disable-next-line no-unused-vars
        iscn_id: iscnId,
        // eslint-disable-next-line no-unused-vars
        language,
        ...queries
      } = this.$route.query;
      return `https://app.${IS_TESTNET ? 'rinkeby.' : ''}like.co/nft/iscn/${iscnIdString}?layout=popup&${querystring.stringify(queries)}`;
    },
  },
  async mounted() {
    if (this.opener && !window.opener) {
      this.$nuxt.error({ statusCode: 400, message: this.$t('Error.NO_OPENER') });
      return;
    }
    this.isMobileClient = checkIsMobileClient();
    if (this.iscnId) {
      if (!checkISCNIdValid(this.iscnId)) {
        this.$nuxt.error({ statusCode: 400, message: 'Invalid ISCN ID' });
        return;
      }
      try {
        this.isLoading = true;
        this.existingISCNInfo = await getISCNInfoById(this.iscnId);
      } catch (err) {
        console.error(err);
        this.$nuxt.error({ statusCode: 400, message: 'Error fetching ISCN ID Info' });
        return;
      } finally {
        this.isLoading = false;
      }
    }
    window.addEventListener(
      'message',
      this.onWindowMessage,
      false,
    );
    // eslint-disable-next-line no-console
    console.info('ISCN_WIDGET_READY');
    if (this.opener) {
      try {
        const message = JSON.stringify({
          action: 'ISCN_WIDGET_READY',
        });
        window.opener.postMessage(message, this.redirectOrigin);
      } catch (err) {
        console.error(err);
      }
    }
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
      'popupAuthDialogInPlace',
    ]),
    onWindowMessage(event) {
      if (event && event.data && typeof event.data === 'string') {
        if (this.redirectOrigin && event.origin !== this.redirectOrigin) {
          return;
        }
        const { action, data } = JSON.parse(event.data);
        if (action === 'SUBMIT_ISCN_DATA') {
          // eslint-disable-next-line no-console
          console.info('Received SUBMIT_ISCN_DATA');
          const {
            metadata = {},
            files = [],
          } = data;
          this.onReceiveISCNData(metadata);
          this.onReceiveISCNFiles(files);
        } else if (action === 'INIT_WIDGET') {
          // eslint-disable-next-line no-console
          console.info('Received INIT_WIDGET');
          if (this.mainStatus === 'initial') {
            this.mainStatus = 'pending';
          }
        }
      }
    },
    async onReceiveISCNFiles(data) {
      if (!data || !data.length) {
        // eslint-disable-next-line no-console
        console.info('Received no files for upload');
        this.arweavePaymentInfo = {
          LIKE: '0',
        };
        this.prepareLikePayWidget();
        return;
      }
      // eslint-disable-next-line no-console
      console.info(`Received ${data.length} files for upload`);
      const files = data.filter(d => d.filename && d.data);
      const filesWithBlob = await Promise.all(files.map(async (d) => {
        const mimeType = d.mimeType || mime.lookup(d.filename) || 'text/plain';
        const resData = await fetch(`data:${mimeType};base64,${d.data}`);
        const blob = await resData.blob();
        return {
          filename: d.filename,
          blob,
        };
      }));
      this.ISCNFiles = filesWithBlob.reduce((acc, cur) => {
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
        stakeholders,
      } = data;
      let {
        publisher,
        license,
        type,
        name,
        description,
        author,
        authorDescription,
        url,
        tags = [],
        recordNotes,
        memo,
      } = data;
      type = type || 'article';
      if (publisher) {
        if (typeof publisher === 'string' && ISCN_PUBLISHERS[publisher]) {
          license = ISCN_PUBLISHERS[publisher].license || license;
          publisher = ISCN_PUBLISHERS[publisher];
        }
      }
      if (license) {
        if (typeof license === 'string') {
          license = ISCN_LICENSES[license] || license;
        }
      }
      if (name) {
        name = name.substring(0, 255);
      }
      if (description) {
        description = description.substring(0, 2048);
      }
      if (author) {
        author = author.substring(0, 255);
      }
      if (authorDescription) {
        authorDescription = authorDescription.substring(0, 1024);
      }
      if (url) {
        url = url.substring(0, 2048);
      }
      if (recordNotes) {
        recordNotes = recordNotes.substring(0, 255);
      }
      if (memo) {
        memo = memo.substring(0, 200);
      }
      if (!tags) {
        tags = [];
      } else if (typeof tags === 'string') {
        tags = tags.split(',');
      }

      const ISCNData = {
        fingerprints,
        stakeholders,
        name,
        type,
        author,
        authorDescription,
        description,
        tags,
        license,
        publisher,
        url,
        recordNotes,
        memo,
      };
      this.ISCNData = ISCNData;
      // eslint-disable-next-line no-console
      console.info(`Received metadata: ${JSON.stringify(ISCNData)}`);
    },
    async prepareLikePayWidget() {
      const {
        LIKE,
        arweaveId,
        ipfsHash,
      } = this.arweavePaymentInfo;
      if (arweaveId || !LIKE || LIKE === '0') {
        if (arweaveId) {
          this.arweaveResult = { arweaveId, ipfsHash };
          if (this.opener) {
            try {
              const message = JSON.stringify({
                action: 'ARWEAVE_SUBMITTED',
                data: this.arweaveResult,
              });
              window.opener.postMessage(message, this.redirectOrigin);
            } catch (err) {
              console.error(err);
            }
          }
        }
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
        stakeholders,
        url,
        recordNotes,
        memo,
      } = this.ISCNData;
      this.ISCNTotalFee = await this.calculateISCNTxTotalFee({
        userId: this.getUserId,
        displayName: this.getUserInfo.displayName,
        author,
        authorDescription,
        description,
        cosmosWallet: STUB_WALLET,
        fingerprints: this.fingerprints,
        stakeholders,
        name,
        tags,
        type,
        license,
        publisher,
        url,
        recordNotes,
        memo,
      });
      if (!this.showWalletOption) this.submitISCNTransfer();
    },
    async submitISCNTransfer() {
      if (this.isChainUpgrading) return;
      this.showWalletOption = false;
      this.error = '';
      this.transactionStatus = 'pending';
      try {
        const from = await this.fetchCurrentCosmosWallet();
        if (!from) {
          throw new Error('PLEASE_RELOGIN');
        }
        if (!this.isUsingKeplr) {
          const { cosmosWallet, likeWallet } = this.getUserInfo;
          if ((cosmosWallet || likeWallet) && from !== cosmosWallet && from !== likeWallet) {
            throw new Error('VALIDATION_FAIL');
          }
        }
        const balance = await queryCosmosLikeCoinBalance(from);
        if (new BigNumber(this.ISCNTotalFee).gt(balance)) {
          throw new Error('INSUFFICIENT_BALANCE');
        }
        const signer = await this.prepareCosmosTxSigner();
        const {
          name,
          type,
          author,
          authorDescription,
          description,
          tags,
          license,
          publisher,
          stakeholders,
          url,
          recordNotes,
          memo,
        } = this.ISCNData;
        const txHash = await this.sendISCNSignature({
          cosmosWallet: from,
          userId: this.getUserId || '',
          displayName: this.getUserInfo.displayName || '',
          author,
          authorDescription,
          description,
          fingerprints: this.fingerprints,
          name,
          tags,
          type,
          license,
          url,
          publisher,
          stakeholders,
          recordNotes,
          memo,
          iscnId: this.iscnId,
          signer,
          shouldShowTxDialog: false,
        });
        this.transactionStatus = 'done';
        this.mainStatus = 'IscnUploading';
        if (txHash) {
          await this.postISCNTransaction({ txHash });
        } else {
          throw new Error('TX_HASH_NOT_FOUND');
        }
      } catch (error) {
        this.transactionStatus = 'failed';
        this.error = error;
        console.error(error);
      }
    },
    async postISCNTransaction({ txHash, error } = {}) {
      const ISCNTransferInfo = await getISCNTransferInfo(txHash, { blocking: true });
      const {
        isFailed, iscnId, iscnVersion, timestamp,
      } = ISCNTransferInfo;
      if (this.opener) {
        const success = !isFailed;
        const payload = {};
        if (txHash) payload.tx_hash = txHash;
        if (iscnId) payload.iscnId = iscnId;
        if (iscnVersion) payload.iscnVersion = iscnVersion;
        if (timestamp) payload.timestamp = timestamp;
        if (error) payload.error = error;
        if (success !== undefined) payload.success = success;
        try {
          const message = JSON.stringify({
            action: 'ISCN_SUBMITTED',
            data: payload,
          });
          window.opener.postMessage(message, this.redirectOrigin);
        } catch (err) {
          console.error(err);
        }
      }
      await timeout(3000);
      this.iscnId = iscnId;
      window.location.href = this.mintNFT ? this.mintISCNPageURL : this.viewISCNPageURL;
    },
    async handleAutheticate() {
      if (this.getUserIsRegistered) {
        if (this.getAuthCoreNeedReAuth) {
          this.setReAuthDialogShow(true);
          return true;
        }
      } else if (this.isMobileClient) {
        this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
        return true;
      } else {
        await this.connectKeplr();
      }
      return false;
    },
    async onClickContinueRegister({ forceKeplr = false } = {}) {
      if (!this.isUsingKeplr) {
        if (!forceKeplr) {
          if (await this.handleAutheticate()) return;
        } else {
          await this.connectKeplr();
        }
      }
      this.submitISCNTransfer();
    },
    async onClickBeginRegister({ forceKeplr = false } = {}) {
      if (!forceKeplr) {
        if (await this.handleAutheticate()) return;
      } else {
        await this.connectKeplr();
      }
      this.beginLikePay();
    },
    async connectKeplr() {
      this.error = '';
      this.isKeplrNotFound = false;
      const res = await Keplr.initKeplr();
      if (res) {
        this.setDefaultCosmosWalletSource({ source: 'keplr', persistent: false });
        this.isUsingKeplr = true;
        return;
      }
      this.isKeplrNotFound = true;
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
      if (this.isChainUpgrading) return;
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
          const { cosmosWallet, likeWallet } = this.getUserInfo;
          if ((cosmosWallet || likeWallet)
            && from !== cosmosWallet && from !== likeWallet && !this.isUsingKeplr) {
            throw new Error('VALIDATION_FAIL');
          }
        }
        if (this.isUpdateMode && this.existingOwner !== from) {
          throw new Error('NOT_OWNER_OF_ISCN');
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
