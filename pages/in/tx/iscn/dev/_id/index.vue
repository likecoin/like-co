<template>
  <div>
    <div class="lc-container-0 lc-narrow">
      <section class="lc-container-1 lc-section-block">
        <transaction-header
          :isNotFound="isNotFound"
          :failReason="failReason"
          :isEth="false"
          :icon="creatorAvatar"
          :toId="creatorId"
          :toName="creatorName ? creatorName : creatorId"
          :toAddress="creatorAddress"
          :toAvatarHalo="creatorAvatarHalo"
          :timestamp="timestamp"
          amount="ISCN"
        />
        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div
              v-if="!isNotFound"
              class="tx-container lc-padding-bottom-8"
            >
              <section
                class="section-container"
              >
                <div class="key">
                  {{ $t('ISCNWidget.label.title') }}
                </div>
                <div class="value lc-font-size-20">
                  {{ title }}
                </div>
              </section>
              <section
                class="section-container"
              >
                <div class="key">
                  {{ $t('ISCNWidget.label.fingerprint') }}
                </div>
                <a
                  :href="ipfsURL"
                  target="_blank"
                  rel="noopener"
                >
                  <div class="address value lc-font-size-20">
                    {{ fingerprint }}
                  </div>
                </a>
              </section>
              <section
                class="section-container"
              >
                <div class="key">
                  {{ $t('ISCNWidget.label.tags') }}
                </div>
                <div class="address value lc-font-size-20">
                  <span
                    v-for="t in tags"
                    :key="t"
                  >{{ t }}</span>
                </div>
              </section>
              <section
                class="section-container"
              >
                <div class="key">
                  {{ $t('ISCNWidget.label.contentType') }}
                </div>
                <div class="address value lc-font-size-20">
                  {{ contentType }}
                </div>
              </section>
              <section
                class="section-container"
              >
                <div class="key">
                  {{ $t('ISCNWidget.label.rights') }}
                </div>
                <div
                  v-for="r in rights"
                  :key="r.terms.hash"
                  class="address value lc-font-size-20"
                >
                  <a
                    :href="`${IPFS_HOST}${r.terms.hash}`"
                    target="_blank"
                    rel="noopener"
                  >
                    <div class="address value lc-font-size-20">
                      {{ r.type }}: {{ r.terms.hash }}
                    </div>
                  </a>
                  <div class="value lc-font-size-20">
                    <nuxt-link
                      v-if="r.holder.likerID"
                      :to="{ name: 'id', params: { id: r.holder.likerID } }"
                    >
                      @{{ r.holder.name }}
                    </nuxt-link>
                    <template v-else>@{{ r.holder.name }}</template>
                  </div>
                  <div class="value lc-font-size-20">from {{ r.period.from }}</div>
                </div>
              </section>
              <section
                class="section-container"
              >
                <div class="key">
                  {{ $t('ISCNWidget.label.stakeholders') }}
                </div>
                <div
                  v-for="s in stakeholders"
                  :key="s.stakeholder.id"
                  class="address value lc-font-size-20"
                >
                  <div class="value lc-font-size-20">
                    {{ s.type }} -
                    <nuxt-link
                      v-if="s.stakeholder.likerID"
                      :to="{ name: 'id', params: { id: s.stakeholder.likerID } }"
                    >
                      {{ s.stakeholder.name }}
                    </nuxt-link>
                    <template v-else>{{ s.stakeholder.name }}</template>
                    - {{ s.sharing }}
                  </div>
                </div>
              </section>
              <section class="section-container">
                <div class="key">
                  {{ $t('Transaction.label.contentTimestamp') }}
                </div>
                <div class="address value lc-font-size-20">
                  {{ contentTimestamp }}
                </div>
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
              <section class="section-container">
                <div class="key">
                  {{ $t('Transaction.label.senderAddress') }}
                </div>
                <a
                  :href="getAccountViewerUrl(from)"
                  target="_blank"
                  rel="noopener"
                >
                  <div class="address value lc-font-size-20">
                    {{ from }}
                  </div>
                </a>
              </section>
            </div>
          </div>
        </div>

      </section>
    </div>
    <a
      :href="`https://node.iscn-dev.like.co/txs/${txId}`"
      target="_blank"
      rel="noopener"
    >
      <div class="address value lc-font-size-20">
        View raw transaction
      </div>
    </a>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
// import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscnConstant';
import {
  getISCNTransferInfo,
  getISCNTransactionCompleted,
} from '@/util/cosmos/iscn';
import { BIGDIPPER_HOST } from '@/constant';
import TransactionHeader from '~/components/header/TransactionHeader';

import { apiGetUserMinById } from '@/util/api/api';
import UserUtil from '~/util/User';

const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'narrowWithHeader',
  components: {
    TransactionHeader,
  },
  data() {
    return {
      IPFS_HOST: 'https://ipfs.io/ipfs/',
      isNotFound: false,
      /* failReason : 0 = none, 1 = failed, 2 = timeout */
      failReason: 0,
      status: 'pending',
      from: '',
      creatorName: '',
      creatorAddress: '',
      creatorId: '',
      creatorAvatar: '',
      creatorAvatarHalo: 'none',
      fingerprint: '',
      tags: [],
      title: '',
      contentType: '',
      rights: [],
      stakeholders: [],
      contentTimestamp: 0,
      timestamp: 0,
    };
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
    ipfsURL() {
      return `https://ipfs.io/ipfs/${this.fingerprint}`;
    },
  },
  async mounted() {
    this.timestamp = 0;
    if (this.status === 'timeout') this.failReason = 2;
    try {
      const tx = await getISCNTransferInfo(this.txId, {
        blocking: true,
      });
      this.updateUI(tx);
      if (!this.failReason) this.failReason = tx.isFailed ? 1 : 0;
      /* eslint-disable no-underscore-dangle */
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
        const { ts, isFailed } = await getISCNTransactionCompleted(this.txId);
        if (!ts) {
          this.setupTimer();
        } else {
          this.timestamp = ts;
          this.failReason = isFailed ? 1 : 0;
        }
      }, PENDING_UPDATE_INTERVAL);
    },
    async updateUI(tx) {
      this.startLoading();
      const {
        from,
        fingerprint,
        tags,
        title,
        type,
        contentType,
        isFailed,
        rights,
        stakeholders,
        contentTimestamp,
        timestamp,
      } = tx;
      this.from = from;
      this.fingerprint = fingerprint;
      this.tags = tags;
      this.title = title;
      this.type = type;
      this.contentType = contentType;
      this.isFailed = isFailed;
      this.rights = rights;
      this.stakeholders = stakeholders;
      this.contentTimestamp = contentTimestamp;
      this.timestamp = timestamp;
      const creatorUser = this.stakeholders.find(s => s.type === 'Creator');
      if (creatorUser) {
        this.creatorAddress = creatorUser.stakeholder.id;
        this.creatorId = creatorUser.stakeholder.likerID;
        const [creatorData] = await Promise.all([
          apiGetUserMinById(this.creatorId).catch(() => ({})),
        ]);
        if (creatorData && creatorData.data) {
          this.creatorName = creatorData.data.displayName || creatorData.data.user;
          this.creatorAvatar = creatorData.data.avatar;
          this.creatorAvatarHalo = UserUtil.getAvatarHaloType(creatorData.data);
        }
      }
      this.stopLoading();
    },
    getAccountViewerUrl(address) {
      return `${BIGDIPPER_HOST}/account/${address}`;
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
