<template>
  <div>
    <div class="lc-container-0 lc-narrow">
      <section class="lc-container-1 lc-section-block">
        <tokensale-header
          :isNotFound="isNotFound"
          :failReason="failReason"
          :isEth="isEth"
          :icon="toAvatar"
          :toId="toId"
          :toName="toName"
          :toAddress="to"
          :timestamp="timestamp"
          :amount="amount"
        />

        <div class="lc-container-2 lc-margin-top-16">
          <div class="lc-container-3 lc-bg-gray-1">
            <div
              v-if="!isNotFound"
              class="tx-container lc-padding-top-32 lc-padding-bottom-16"
            >
              <section class="tx-info">
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
                    <div class="address value">
                      {{ from }}
                    </div>
                  </a>
                </section>
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

import TokensaleHeader from '~/components/header/TokensaleHeader';
import ViewEtherscan from '~/components/ViewEtherscan';

import { apiGetTxById, apiCheckIsUser } from '@/util/api/api';

const ONE_LIKE = new BigNumber(10).pow(18);
const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'narrowWithHeader',
  components: {
    TokensaleHeader,
    ViewEtherscan,
  },
  data() {
    return {
      isEth: false,
      isNotFound: false,
      /* failReason : 0 = none, 1 = failed, 2 = timeout */
      failReason: 0,
      status: 'pending',
      from: '',
      to: '',
      fromId: '',
      fromName: '',
      toId: '',
      toName: '',
      toAvatar: '',
      timestamp: 0,
      value: '', // BN in string
      amount: 0,
      updateTimer: null,
      ETHERSCAN_HOST,
    };
  },
  asyncData({ params, redirect }) {
    if (params.tx && params.tx !== {}) {
      const { to, from, value } = params.tx;
      if (to !== LIKE_COIN_ICO_ADDRESS) {
        return redirect({
          name: 'in-tx-id',
          params,
        });
      }
      return { to, from, value };
    }
    return apiGetTxById(params.id)
      .then((res) => {
        const {
          to,
          from,
          value,
          status,
        } = res.data;
        if (to !== LIKE_COIN_ICO_ADDRESS) {
          return redirect({
            name: 'in-tx-id',
            params,
          });
        }
        return {
          to,
          from,
          value,
          status,
        };
      })
      .catch(e => ({})); // eslint-disable-line no-unused-vars
  },
  head() {
    return {
      title: this.$t('Transaction.label.viewTx'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Transaction.label.viewTx'),
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
  },
  async mounted() {
    this.timestamp = 0;
    if (this.to) this.updateUI(this.from, this.to);
    if (this.value) {
      this.amount = new BigNumber(this.value).div(ONE_LIKE).toFixed();
    }
    if (this.status === 'timeout') this.failReason = 2;
    try {
      const tx = await EthHelper.getTransferInfo(this.txId, { blocking: true });
      this.isEth = tx.isEth;
      if (!this.failReason) this.failReason = tx.isFailed ? 1 : 0;
      /* eslint-disable no-underscore-dangle */
      if (tx._value !== undefined) this.amount = new BigNumber(tx._value).div(ONE_LIKE).toFixed();
      if (tx._to !== LIKE_COIN_ICO_ADDRESS) {
        this.$nextTick(() => {
          this.$router.replace({ name: 'in-tx-id', params: this.$route.params });
        });
        return;
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
      this.startLoading();
      const [fromData, toData] = await Promise.all([
        apiCheckIsUser(from).catch(() => {}),
        apiCheckIsUser(to).catch(() => {}),
      ]);
      this.stopLoading();
      if (fromData && fromData.data) {
        this.fromId = fromData.data.user;
        this.fromName = fromData.data.displayName || fromData.data.user;
      }
      if (toData && toData.data) {
        this.toId = toData.data.user;
        this.toName = toData.data.displayName || toData.data.user;
        this.toAvatar = toData.data.avatar;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

  a {
    &:hover {
      text-decoration: none;
    }

    .address.value {
      font-size: 19.5px;
    }
  }
}
</style>
