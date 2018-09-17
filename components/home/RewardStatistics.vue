<template>
  <div class="reward-statistics">
    <div class="reward-statistics__total-reward-wrapper">
      <div>
        <div
          v-if="totalBackerStrValue !== '0'"
          class="reward-statistics__rewarded-amount-label"
        >
          <h2>{{ totalBackerStrValue }}</h2>
          <span class="reward-statistics__unit-label">
            {{ $t('Home.RewardStatistics.label.backers') }}
          </span>
        </div>
      </div>
      <!-- !! Uncomment when content civics is ready !! -->
      <!-- <div class="lc-flex lc-align-items-center">
        <md-button
          class="md-likecoin outline lc-font-size-14"
        >Become a Content Civics</md-button>
      </div> -->
      <!-- !! Uncomment when content civics is ready !! -->
    </div>

    <div class="reward-statistics__details-wrapper lc-margin-top-24 lc-mobile">
      <div
        v-for="stat in stats"
        :key="stat.title"
      >
        <span class="reward-statistics__stat-title">
          {{ stat.title }}
        </span>
        <div class="reward-statistics__stat-content">
          <div
            v-if="stat.value !== '0'"
            class="reward-statistics__stat-value"
          >{{ stat.value }}</div>
          <div
            v-else
            class="reward-statistics__stat-value-placeholder"
          />
          <div class="reward-statistics__stat-desc">
            {{ stat.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

function formatNumberWithPrefix(number) {
  const units = [
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'k' },
    { value: 1, symbol: '' },
  ];

  let formattedNumber = '0';
  for (let i = 0; i < units.length; i += 1) {
    if (number >= units[i].value) {
      formattedNumber = `${(number / units[i].value).toFixed().toLocaleString()}${units[i].symbol}`;
      break;
    }
  }
  return formattedNumber;
}

export default {
  name: 'reward-statistics',
  props: {
    isLargeSize: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters([
      'getLikeCoinUsdNumericPrice',
      'getTotalLIKERewardedStatistic',
      'getTotalLikerStatistic',
      'getTotalLikeeStatistic',
      'getTotalLIKEArticleStatistic',
    ]),
    stats() {
      return [
        {
          title: this.$t('Home.RewardStatistics.label.to'),
          content: this.$t('Home.RewardStatistics.label.creators'),
          value: (this.getTotalLikeeStatistic || 0).toLocaleString(),
        },
        {
          title: this.$t('Home.RewardStatistics.label.on'),
          content: this.$t('Home.RewardStatistics.label.contents'),
          value: (this.getTotalLIKEArticleStatistic || 0).toLocaleString(),
        },
        {
          title: this.$t('Home.RewardStatistics.label.rewarded'),
          content: 'LIKE',
          value: this.totalLIKEStrValue,
        },
      ];
    },
    totalBackerStrValue() {
      return (this.getTotalLikerStatistic || 0).toLocaleString();
    },
    totalLIKEStrValue() {
      if (!this.isLargeSize) {
        return formatNumberWithPrefix(this.getTotalLIKERewardedStatistic || 0);
      }
      return Math.round(this.getTotalLIKERewardedStatistic || 0).toLocaleString();
    },
  },
  mounted() {
    this.fetchLikeStatistic();
  },
  methods: {
    ...mapActions([
      'fetchLikeStatistic',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.reward-statistics {
  &__total-reward-wrapper {
    position: relative;

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (min-width: 600px + 1px) {
      min-height: 70px;
    }

    > * {
      color: $like-green;
    }

    .md-button {
      min-width: 190px;
      height: 32px;
      margin: 0;

      color: #4a4a4a !important;
      border: 1px solid currentColor !important;

      :global(.md-ripple) {
        min-height: unset !important;
      }
    }
  }

  &__rewarded-amount-label {
    display: flex;
    align-items: flex-end;

    margin: 8px 0;

    animation: fade-in 0.35s ease-in;

    h2 {
      margin-right: 8px;

      color: $like-green;

      font-size: 64px;
      font-weight: 400;
      line-height: 0.85;

      @media (max-width: 600px) {
        font-size: 36px;
      }
    }
  }

  &__unit-label {
    font-size: 20px;

    @media (max-width: 600px) {
      top: 38px;

      font-size: 16px;
    }
  }

  &__details-wrapper {
    display: flex;

    > * {
      flex: 1;

      &:first-child {
        .reward-statistics__stat-content {
          border-left: 2px solid $gray-e6;
        }
      }

      &:last-child {
        @media (min-width: 1240px + 1px) {
          flex: 2;
        }
      }
    }
  }

  &__stat {
    &-title {
      text-transform: lowercase;

      color: $gray-9b;

      font-size: 12px;

      @media (max-width: 600px) {
        font-size: 10px;
      }
    }

    &-content {
      margin-top: 4px;
      padding-bottom: 8px;

      text-align: center;

      color: $like-green;
      border-right: 2px solid $gray-e6;

      line-height: 1;
    }

    &-value {
      animation: fade-in 0.35s ease-in;

      font-size: 38px;

      font-variant-numeric: oldstyle-nums;

      @media (max-width: 600px) {
        font-size: 20px;
      }
    }

    &-desc {
      margin-top: 12px;

      font-size: 16px;

      @media (max-width: 600px) {
        font-size: 12px;
      }
    }
  }

  &__stat-value-placeholder {
    min-height: 38px;
  }
}
</style>
