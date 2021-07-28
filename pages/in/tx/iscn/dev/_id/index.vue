<template>
  <div class="iscn-body">
    <header class="iscn-body__header">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 30"
        width="30"
      >
        <path
          :d="`
            M20.16,9.55,15.58,5
            C11.22.61,2.42-1.06.68.68
            S.61,11.22,5,15.58
            l4.58,4.58
            a12.29,12.29,0,0,0,2.69,9.44,1.09,1.09,0,0,0,1.6.09
            l2.62-2.62,1.83-1.83,1.55.91,6.3-6.3-.91-1.55,1.83-1.83,2.62-2.62
            a1.08,1.08,0,0,0-.1-1.6,12.3,12.3,0,0,0-9.43-2.7
          `"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
      <h1>ISCN</h1>
    </header>

    <div
      v-if="failReason > 0"
      class="iscn-panel"
    >
      <section
        class="iscn-panel__section-container iscn-panel__section-container--failed"
      >
        <h1>
          <md-icon class="status-icon error-icon">error</md-icon>
          {{ $t(
            failReason === 2
              ? 'Transaction.header.label.timeout'
              : 'Transaction.header.label.failed'
          ) }}
        </h1>
      </section>
    </div>

    <div
      v-else-if="!timestamp"
      class="iscn-panel"
    >
      <section
        class="iscn-panel__section-container iscn-panel__section-container--pending"
      >
        <h1>
          {{ $t('Transaction.header.label.pending') }}
        </h1>
      </section>
      <section class="iscn-panel__section-container">
        {{ $t('Dialog.transaction.label.waiting') }}
      </section>
    </div>

    <template v-else-if="!isNotFound">
      <div class="iscn-panel">
        <section
          class="iscn-panel__section-container iscn-panel__section-container--success"
        >
          <h1>
            <img :src="TickIcon">
            {{ $t('Transaction.header.label.completed') }}
          </h1>
        </section>

        <section class="iscn-panel__section-container">
          <div class="iscn-panel__section-meta">
            <div class="iscn-panel__section-meta-label">
              {{ $t('Transaction.label.senderAddress') }}
            </div>
            <div
              :class="[
                'iscn-panel__section-meta-grid-item-value',
                'iscn-panel__section-meta-grid-item-value--fingerprint',
              ]"
            >
              <a
                :href="getAccountViewerUrl(from)"
                target="_blank"
                rel="noopener"
              >{{ from }}</a>
            </div>
          </div>

          <div class="iscn-panel__section-meta iscn-panel__section-meta--full">
            <div class="iscn-panel__section-meta-label">
              {{ $t('ISCNWidget.label.timestamp') }}
            </div>
            <div class="iscn-panel__section-meta-value">
              {{ formatDate(timestamp * 1000) }}
            </div>
          </div>
        </section>
      </div>

      <div class="iscn-panel">
        <section class="iscn-panel__section-container">
          <div class="iscn-panel__section-meta">
            <div class="iscn-panel__section-meta-label">
              {{ $t('ISCNWidget.label.creator') }}
            </div>
            <a
              :href="getCreatorPortfolioURL(creatorId)"
              target="_blank"
              rel="noopener"
              class="iscn-panel__user"
            >
              <lc-avatar
                v-if="creatorAvatar"
                :src="creatorAvatar"
                :halo="creatorAvatarHalo"
                size="32"
              />
              <div class="iscn-panel__user-display-name">
                {{ creatorName }}
              </div>
            </a>
          </div>
          <div class="iscn-panel__section-meta iscn-panel__section-meta--full">
            <div class="iscn-panel__section-meta-label">
              {{ $t('ISCNWidget.label.title') }}
            </div>
            <div class="iscn-panel__section-meta-value">{{ title }}</div>
          </div>

          <div class="iscn-panel__section-meta">
            <div class="iscn-panel__section-meta-grid">
              <div
                class="iscn-panel__section-meta-grid-item iscn-panel__section-meta-grid-item--half"
              >
                <div class="iscn-panel__section-meta-grid-item-label">
                  {{ $t('ISCNWidget.label.contentType') }}
                </div>
                <div class="iscn-panel__section-meta-grid-item-value">
                  {{ type }}
                </div>
              </div>
              <div
                class="iscn-panel__section-meta-grid-item iscn-panel__section-meta-grid-item--half"
              >
                <div class="iscn-panel__section-meta-grid-item-label">
                  {{ $t('ISCNWidget.label.contentTimestamp') }}
                </div>
                <div class="iscn-panel__section-meta-grid-item-value">
                  {{ formatDate(contentTimestamp) }}
                </div>
              </div>

              <div class="iscn-panel__section-meta-grid-item">
                <div class="iscn-panel__section-meta-grid-item-label">
                  {{ $t('ISCNWidget.label.iscnId') }}
                </div>
                <div
                  :class="[
                    'iscn-panel__section-meta-grid-item-value',
                    'iscn-panel__section-meta-grid-item-value--fingerprint',
                  ]"
                >
                  {{ iscnId }}
                </div>
              </div>

              <div class="iscn-panel__section-meta-grid-item">
                <div class="iscn-panel__section-meta-grid-item-label">
                  {{ $t('ISCNWidget.label.fingerprint') }}
                </div>
                <div
                  :class="[
                    'iscn-panel__section-meta-grid-item-value',
                    'iscn-panel__section-meta-grid-item-value--fingerprint',
                  ]"
                >
                  <a
                    :href="ipfsURL"
                    target="_blank"
                    rel="noopener"
                  >{{ fingerprint }}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="iscn-panel__section-separator">

        <section class="iscn-panel__section-container">
          <div
            v-if="tags && tags.length"
            class="iscn-panel__section-meta"
          >
            <div class="iscn-panel__section-meta-label">
              {{ $t('ISCNWidget.label.tags') }}
            </div>
            <div class="iscn-panel__section-meta-value">
              <ul class="iscn-panel__tag-list">
                <li
                  v-for="tag in tags"
                  :key="tag"
                  class="iscn-panel__tag-list-item"
                >{{ tag }}</li>
              </ul>
            </div>
          </div>
        </section>

        <hr class="iscn-panel__section-separator">

        <section class="iscn-panel__section-container">
          <div class="iscn-panel__section-meta">
            <div class="iscn-panel__section-meta-label">
              {{ $t('ISCNWidget.label.rights') }}
            </div>
            <div
              v-for="r in rights"
              :key="r"
              class="iscn-panel__section-meta-grid"
            >
              <div class="iscn-panel__section-meta-grid-item">
                <div
                  :class="[
                    'iscn-panel__section-meta-grid-item-value',
                    'iscn-panel__section-meta-grid-item-value--fingerprint',
                  ]"
                >
                  {{ r }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="iscn-panel__section-separator">

        <section class="iscn-panel__section-container">
          <div class="iscn-panel__section-meta iscn-panel__section-meta--full">
            <div class="iscn-panel__section-meta-label">
              {{ $t('ISCNWidget.label.stakeholders') }}
            </div>
            <ul class="iscn-panel__stakeholders-list">
              <li
                v-for="s in stakeholders"
                :key="s.entity.id"
                class="iscn-panel__stakeholders-list-item"
              >
                <div
                  class="iscn-panel__stakeholders-list-item-bg"
                  :style="`width:${100 * s.rewardProportion / totalStakeholdersShares}%`"
                />
                <div class="iscn-panel__stakeholders-list-item-content">
                  <span class="type">{{ s.contributionType }}</span>

                  <div class="iscn-panel__stakeholders-list-item-content-right">
                    <a
                      v-if="s.entity.id"
                      :to="getCreatorPortfolioURL(s.entity.id)"
                    >{{ s.entity.name }}</a>
                    <span v-else>{{ s.entity.name }}</span>
                    <span class="sharing">
                      {{ s.rewardProportion }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </template>

    <footer class="iscn-panel__footer">
      <a
        class="iscn-block-button"
        :href="`https://node.iscn-dev.like.co/txs/${txId}`"
        target="_blank"
        rel="noopener"
      >{{ $t('ISCNWidget.button.rawTx') }}</a>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import dateFormat from 'date-fns/format';

// import { ISCN_LICENSES, ISCN_PUBLISHERS } from '@/util/cosmos/iscn/constant';
import {
  getISCNTransferInfo,
  getISCNTransactionCompleted,
} from '@/util/cosmos/iscn/query';
import { BIGDIPPER_HOST, LIKER_LAND_URL } from '@/constant';

import { apiGetUserMinById } from '@/util/api/api';
import UserUtil from '~/util/User';

import TickIcon from '@/assets/tokensale/tick.svg';

const PENDING_UPDATE_INTERVAL = 1000; // 1s

export default {
  name: 'transaction',
  layout: 'iscn',
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
      iscnId: '',
      tags: [],
      title: '',
      contentType: '',
      rights: [],
      stakeholders: [],
      contentTimestamp: 0,
      timestamp: 0,
      TickIcon,
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
    totalStakeholdersShares() {
      return this.stakeholders.reduce((t, s) => t + s.rewardProportion, 0);
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
    getCreatorPortfolioURL(likerID) {
      return `${LIKER_LAND_URL}/${likerID}?utm_source=tx-iscn`;
    },
    formatDate(date) {
      return dateFormat(date, 'YYYY-MM-DD HH:mm:ss Z');
    },
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
        iscnId,
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
      this.iscnId = iscnId;
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
      const creatorUser = this.stakeholders.find(s => s.contributionType.includes('author'));
      if (creatorUser) {
        this.creatorId = creatorUser.entity.id;
        this.creatorName = creatorUser.entity.name;
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

.iscn-body {
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px 8px;

    &,
    & h1 {
      text-align: center;

      color: $civic-green;

      font-size: 18px;
      font-weight: 600;
    }

    & h1 {
      margin: 0;
      margin-left: 8px;

      line-height: 1.5;
    }
  }
}

.iscn-panel {
  &__tag-list {
    display: flex;
    flex-wrap: wrap;

    margin: -4px;
    padding: 0;
    padding-top: 4px;

    list-style: none;

    &-item {
      margin: 4px;
      padding: 6px 12px;

      color: $like-green;
      border-radius: 9999px;

      background: $like-light-blue;

      font-size: 14px;
      font-weight: 600;
      line-height: 1;
    }
  }

  &__stakeholders-list {
    width: 100%;
    margin: 0;
    padding: 0;

    list-style: none;

    &-item {
      position: relative;

      width: 100%;
      margin: 6px 0;

      border: 2px solid $like-cyan;
      border-radius: 9999px;

      &-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;

        border-radius: inherit;
        background-color: $like-cyan;
      }

      &-content {
        position: relative;

        display: flex;
        justify-content: space-between;

        padding: 4px 12px;

        color: $like-green;

        font-size: 14px;

        &-right {
          display: flex;

          > .sharing {
            width: 40px;

            text-align: right;
          }
        }

        > .type {
          margin-right: 24px;

          font-weight: bold;
        }
      }
    }
  }
}
</style>
