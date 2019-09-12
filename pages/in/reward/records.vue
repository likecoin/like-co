<template>
  <div class="reward-records-tab">

    <section class="lc-margin-top-48 lc-mobile">
      <div class="lc-container-0">
        <div class="lc-container-1">

          <section class="transaction-history-section lc-container-0">
            <div class="lc-container-1">

              <div class="lc-container-header">
                <div class="lc-container-2 lc-container-header-overlay">
                  <div class="lc-container-3 lc-bg-gray-1" />
                </div>
                <div class="lc-container-2">
                  <div class="lc-container-3">
                    <div class="lc-container-4">
                      <div class="lc-container-header-title">
                        <h1 class="lc-font-size-32 lc-mobile">
                          {{ $t('RewardRecords.title') }}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="lc-container-2">
                <!-- Empty Placeholder -->
                <div
                  v-if="!isFetchingRecords && isFetchedRecords && isEmptyList"
                  class="lc-container-3 lc-padding-vertical-64 lc-bg-gray-1"
                >
                  <div class="lc-container-4">
                    <div class="lc-text-align-center">
                      {{ $t('TransactionHistory.label.noRecord') }}
                    </div>
                  </div>
                </div>

                <!-- Record List -->
                <div
                  v-else-if="!isEmptyList"
                  class="lc-padding-top-32 lc-padding-bottom-16 lc-bg-gray-1 lc-mobile"
                >
                  <md-table>
                    <md-table-row>
                      <md-table-head>
                        {{ $t('TransactionHistory.header.time') }}
                      </md-table-head>
                      <md-table-head>
                        {{ $t('TransactionHistory.header.value') }}
                      </md-table-head>
                    </md-table-row>

                    <md-table-row
                      v-for="record in records"
                      :key="record.ts"
                      class=""
                    >
                      <md-table-cell>
                        {{ record.ts }}
                      </md-table-cell>

                      <md-table-cell>
                        <span class="lc-font-size-14">{{ record.value[0] }}</span><span
                          v-if="record.value[1]"
                          class="lc-font-size-12"
                        >.{{ record.value[1] }}</span>
                        <span class="currency">LIKE</span>
                      </md-table-cell>
                    </md-table-row>
                  </md-table>
                </div>

                <!-- Progress Bar & More Button -->
                <div
                  :class="[
                    'lc-container-3 lc-bg-gray-1 lc-mobile',
                    isEmptyList ? 'lc-padding-vertical-64' : 'lc-padding-bottom-32',
                  ]"
                >
                  <div
                    v-if="isFetchingRecords"
                    class="lc-container-4"
                  >
                    <md-progress-bar md-mode="indeterminate" />
                  </div>
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>
    </section>

  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import dateFormat from 'date-fns/format';

import { apiGetUserPendingLikeHistory } from '~/util/api/api';

export default {
  name: 'reward-records-tab',
  layout: 'in',
  head() {
    return {
      title: this.$t('RewardRecords.title'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('RewardRecords.title'),
        },
      ],
    };
  },
  asyncData({ store, redirect }) {
    const user = store.getters.getUserInfo;
    if (user.wallet || user.cosmosWallet || store.getters.getUserLikeCoinAmountIsZero) {
      redirect('/in');
    }
  },
  data() {
    return {
      isFetchedRecords: false,
      isFetchingRecords: false,
      records: [],
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getUserLikeCoinAmountInBigNumber',
    ]),
    isEmptyList() {
      return !(this.records && this.records.length);
    },
  },
  mounted() {
    if (this.getUserIsRegistered) {
      this.updateInfo();
    }
  },
  methods: {
    async updateInfo() {
      this.isFetchingRecords = true;
      try {
        const records = await apiGetUserPendingLikeHistory();
        this.records = records.map(record => ({
          ts: dateFormat(new Date(record.ts), 'D-M-YYYY'),
          value: record.LIKE.split('.'),
        }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        this.isFetchingRecords = false;
        this.isFetchedRecords = true;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~assets/variables";
@import "~assets/mixin";

.reward-records-tab {
  .md-table {
    -webkit-overflow-scrolling: touch;

    background-color: transparent;

    /deep/ .md-scrollbar::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    /deep/ .md-table-head-label {
      height: 14px;
    }

    /deep/ .md-table-head-label,
    /deep/ .md-table-cell-container {
      padding-left: 0;

      line-height: 14px;
    }

    /deep/ .md-table-head-container {
      height: initial;
      padding: 6px 0;
    }

    /deep/ .md-table-content {
      @include padding-x(40 + 8);

      background-color: transparent;

      @media (max-width: 600px) {
        @include padding-x(24 + 8)
      }
    }

    .md-table-head {
      color: $like-dark-brown-1;

      font-size: 14px;
      font-weight: normal;
    }

    .md-table-row {
      &:hover {
        .md-table-cell {
          background-color: rgba(255, 255, 255, .8);
        }
      }

      &:last-child {
        border-bottom: 1px solid #E6E6E6;
      }

      .md-table-cell {
        white-space: nowrap;

        color: $like-dark-brown-1;
        border-top-color: #E6E6E6;
      }
    }
  }
}
</style>
