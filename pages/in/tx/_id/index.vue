<template>
  <div>
    <popup-dialog
      ref="urlWarningDialog"
      :is-show.sync="isOpenUrlWarningDialog"
      :allowClose="true"
      :header="$t('General.label.caution')"
      :message="$t('Transaction.label.openReferrerWarning')"
      :cancelText="$t('General.button.cancel')"
    >
      <div
        slot="footer"
        class="lc-dialog-container-1 lc-padding-top-8 lc-text-align-center"
      >
        <a
          href="#"
          @click.prevent="onOpenReferrerConfirm"
        >{{ $t('Transaction.label.openReferrerConfirmMessage') }}</a>
      </div>
    </popup-dialog>

    <div class="lc-container-0 lc-narrow">
      <section class="lc-container-1 lc-section-block">
        <transaction-header
          :isNotFound="isNotFound"
          :failReason="failReason"
          :isEth="isEth"
          :icon="toAvatar"
          :toId="toId"
          :toName="toName ? toName : displayToId"
          :toAddress="to"
          :toAvatarHalo="toAvatarHalo"
          :timestamp="timestamp"
          :amount="amount"
          :filterAddress="filterAddress"
        />

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div
              v-if="!isNotFound"
              class="tx-container lc-padding-bottom-8"
            >
              <section
                v-if="isMultipleTx"
                class="section-container"
              >
                <div class="key">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <span class="lc-font-size-20">{{ $t('Transaction.label.multipleId') }}</span>
              </section>
              <section
                v-else-if="toId"
                class="section-container"
              >
                <div class="key">
                  {{ $t('Transaction.label.recipientId') }}
                </div>
                <nuxt-link :to="{ name: 'id', params: { id: displayToId } }">
                  <div class="value lc-font-size-20">
                    {{ displayToId }}
                  </div>
                </nuxt-link>
              </section>
              <section
                v-if="!isMultipleTx"
                class="section-container"
              >
                <div class="key">
                  {{ $t('Transaction.label.recipientAddress') }}
                </div>
                <a
                  :href="`${ETHERSCAN_HOST}/address/${to}#tokentxns`"
                  target="_blank"
                  rel="noopener"
                >
                  <div class="address value lc-font-size-20">
                    {{ Array.isArray(to) ? to[0] : to }}
                  </div>
                </a>
              </section>
            </div>
          </div>
        </div>

        <div class="lc-container-2 lc-margin-top-16">
          <div class="lc-container-3 lc-bg-gray-1">
            <div
              v-if="!isNotFound"
              class="tx-container lc-padding-top-32 lc-padding-bottom-16"
            >
              <section
                v-if="fromId"
                class="section-container"
              >
                <div class="key">
                  {{ $t('Transaction.label.senderName') }}
                </div>
                <nuxt-link :to="{ name: 'id', params: { id: fromId } }">
                  <div class="value lc-font-size-20">
                    {{ fromName }}
                  </div>
                </nuxt-link>
              </section>
              <section class="section-container">
                <div class="key">
                  {{ $t('Transaction.label.senderAddress') }}
                </div>
                <a
                  :href="`${ETHERSCAN_HOST}/address/${from}#tokentxns`"
                  target="_blank"
                  rel="noopener"
                >
                  <div class="address value lc-font-size-20">
                    {{ from }}
                  </div>
                </a>
              </section>
              <section
                v-if="remarks"
                class="section-container"
              >
                <div class="key">
                  {{ $t('Transaction.label.remarks') }}
                </div>
                <i18n
                  v-if="typeof remarks === 'object' && remarks.type === 'civic-referral'"
                  path="CivicLikerReferral.success"
                  tag="div"
                  class="remark lc-font-size-16"
                >
                  <span place="referee">
                    {{ remarks.referee }}
                  </span>
                </i18n>
                <div
                  v-else
                  class="remark lc-font-size-16"
                >
                  {{ remarks }}
                </div>
              </section>
              <section
                v-if="httpReferrer"
                class="section-container"
              >
                <div class="key">
                  {{ $t('Transaction.label.httpReferrer') }}
                </div>
                <div class="source-url lc-font-size-16">
                  <a
                    :href="httpReferrer"
                    target="_blank"
                    rel="noopener"
                    @click.prevent="onClickReferrer"
                  >{{ httpReferrer }}</a>
                </div>
              </section>
            </div>
          </div>
        </div>

      </section>
    </div>
    <view-etherscan :transaction="txId" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import BigNumber from 'bignumber.js';

import EthHelper from '@/util/EthHelper';
import { ETHERSCAN_HOST } from '@/constant';
import { LIKE_COIN_ICO_ADDRESS } from '@/constant/contract/likecoin-ico';

import TransactionHeader from '~/components/header/TransactionHeader';
import ViewEtherscan from '~/components/ViewEtherscan';
import PopupDialog from '~/components/dialogs/PopupDialog';

import { apiGetTxById, apiGetUserMinById } from '@/util/api/api';
import { openURL } from '~/util/client';
import UserUtil from '~/util/User';

const ONE_LIKE = new BigNumber(10).pow(18);
const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'narrowWithHeader',
  components: {
    TransactionHeader,
    ViewEtherscan,
    PopupDialog,
  },
  data() {
    return {
      isEth: false,
      isNotFound: false,
      isOpenUrlWarningDialog: false,
      /* failReason : 0 = none, 1 = failed, 2 = timeout */
      failReason: 0,
      status: 'pending',
      from: '',
      fromId: '',
      to: '',
      toId: '',
      fromName: '',
      toName: '',
      toAvatar: '',
      toAvatarHalo: 'none',
      remarks: '',
      timestamp: 0,
      value: '', // BN in string
      amount: '0',
      updateTimer: null,
      httpReferrer: undefined,
      ETHERSCAN_HOST,
    };
  },
  asyncData({ params, redirect, query }) {
    if (params.tx && params.tx !== {}) {
      const { to, from, value } = params.tx;
      if (to === LIKE_COIN_ICO_ADDRESS) {
        return redirect({
          name: 'in-tokensale-tx-id',
          params,
        });
      }
      return { to, from, value };
    }
    return apiGetTxById(params.id, query.address)
      .then((res) => {
        const {
          to,
          toId,
          from,
          fromId,
          value,
          status,
          remarks,
          httpReferrer,
        } = res.data;
        if (to === LIKE_COIN_ICO_ADDRESS) {
          return redirect({
            name: 'in-tokensale-tx-id',
            params,
          });
        }
        return {
          to,
          toId,
          from,
          fromId,
          value,
          status,
          remarks,
          httpReferrer,
        };
      })
      .catch(e => ({})); // eslint-disable-line no-unused-vars
  },
  head() {
    return {
      title: this.$t('TransactionHistory.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('TransactionHistory.title'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Transaction.label.viewTx'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Transaction.label.viewTx'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/sale.png',
        },
      ],
    };
  },
  computed: {
    isCompleted() {
      return !!this.timestamp;
    },
    txId() {
      return this.$route.params.id;
    },
    filterAddress() {
      return this.$route.query.address;
    },
    displayToId() {
      if (Array.isArray(this.toId)) {
        return this.toId.length === 1
          ? this.toId[0]
          : this.$t('Transaction.label.multipleId');
      }
      return this.toId;
    },
    isMultipleTx() {
      return Array.isArray(this.toId) && (this.toId.length > 1);
    },
  },
  async mounted() {
    this.timestamp = 0;
    if (this.to) this.updateUI(this.from, this.to);
    if (this.value) {
      this.amount = this.getAmount(this.value);
    }
    if (this.status === 'timeout') this.failReason = 2;
    try {
      const tx = await EthHelper.getTransferInfo(this.txId, {
        blocking: true,
        filterAddress: this.filterAddress,
      });
      this.isEth = tx.isEth;
      if (!this.failReason) this.failReason = tx.isFailed ? 1 : 0;
      /* eslint-disable no-underscore-dangle */
      if (tx._value !== undefined) {
        this.amount = this.getAmount(tx._value);
      }
      this.updateUI(tx._from, tx._to);
      this.timestamp = tx.timestamp;
      if (!this.timestamp) {
        this.setupTimer();
      }
    } catch (err) {
      console.error(err);
      this.isNotFound = true;
    }
  },
  methods: {
    ...mapActions([
      'startLoading',
      'stopLoading',
    ]),
    onClickReferrer() {
      this.isOpenUrlWarningDialog = true;
    },
    onOpenReferrerConfirm() {
      openURL(this, this.httpReferrer, '_blank');
    },
    setupTimer() {
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(async () => {
        const { ts, isFailed } = await EthHelper.getTransactionCompleted(this.txId);
        if (!ts) {
          this.setupTimer();
        } else {
          this.timestamp = ts;
          this.failReason = isFailed ? 1 : 0;
        }
      }, PENDING_UPDATE_INTERVAL);
    },
    async updateUI(from, to) {
      this.from = from;
      this.to = to;
      const isMultipleId = Array.isArray(this.displayToId);
      this.startLoading();
      const [fromData, toData] = await Promise.all([
        apiGetUserMinById(this.fromId).catch(() => ({})),
        isMultipleId ? null : apiGetUserMinById(this.displayToId).catch(() => ({})),
      ]);
      this.stopLoading();
      if (fromData && fromData.data) {
        this.fromName = fromData.data.displayName || fromData.data.user;
      }
      if (toData && toData.data) {
        this.toName = toData.data.displayName || toData.data.user;
        this.toAvatar = toData.data.avatar;
        this.toAvatarHalo = UserUtil.getAvatarHaloType(toData.data);
      }
    },
    getAmount(value) {
      if (!Array.isArray(value)) {
        return new BigNumber(value).div(ONE_LIKE).toFixed();
      }
      let amount = new BigNumber(0);
      value.forEach((v) => {
        amount = amount.plus(new BigNumber(v).div(ONE_LIKE));
      });
      return amount.toFixed();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.section-container {
  margin-bottom: 16px;

  .key {
    color: $like-dark-brown-1;
  }

  .value {
    word-wrap: break-word;

    color: $like-green;
  }

  .remark {
    color: $like-gray-5;
  }

  .source-url {
    color: $like-gray-5;
  }

  a {
    &:hover {
      text-decoration: none;
    }

    .address.value {
      font-size: 19px;
    }
  }
}

</style>
