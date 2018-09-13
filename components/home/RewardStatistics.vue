<template>
  <div class="reward-statistics">
    <div class="reward-statistics__total-reward-wrapper">
      <span class="lc-font-size-18">
        {{ $t('Home.RewardStatistics.label.rewarded') }}
      </span>
      <h2
        v-if="getTotalLIKERewardedStatistic"
        class="reward-statistics__rewarded-amount-label"
      >
        {{ totalLIKEStrValue }}
        <span class="reward-statistics__unit-label">LIKE</span>
      </h2>
      <div
        v-if="getLikeCoinUsdNumericPrice && getTotalLIKERewardedStatistic"
        class="reward-statistics__rewarded-amount-usd-label lc-color-gray-9b"
      >(USD {{ totalLIKEUSDStrValue }})</div>
    </div>

    <div class="reward-statistics__details-wrapper lc-margin-top-32 lc-mobile">
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

export default {
  name: 'reward-statistics',
  props: {
    isShowAccountButton: {
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
          title: this.$t('Home.RewardStatistics.label.from'),
          content: this.$t('Home.RewardStatistics.label.readers'),
          value: (this.getTotalLikerStatistic || 0).toLocaleString(),
        },
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
      ];
    },
    totalLIKEStrValue() {
      return Math.round(this.getTotalLIKERewardedStatistic || 0).toLocaleString();
    },
    totalLIKEUSDStrValue() {
      return (
        (this.getTotalLIKERewardedStatistic || 0) * this.getLikeCoinUsdNumericPrice
      ).toFixed(2);
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
    align-items: center;
    flex-direction: column;

    @media (min-width: 600px + 1px) {
      min-height: 145px;
    }

    > * {
      color: $like-green;

      font-weight: 600;
    }
  }

  &__rewarded-amount-label {
    animation: fade-in 0.35s ease-in;

    font-size: 66px;

    @media (max-width: 600px) {
      font-size: 36px;
    }
  }

  &__rewarded-amount-usd-label {
    padding: 4px 16px;

    animation: fade-in 0.35s ease-in;

    border-bottom: 2px solid $like-gray-3;

    @media (max-width: 600px) {
      padding: 2px 0;

      font-size: 12px;
    }
  }

  &__unit-label {
    position: absolute;
    top: 54px;
    right: 0;

    font-size: 22px;

    @media (max-width: 600px) {
      top: 38px;

      font-size: 16px;
    }
  }

  &__details-wrapper {
    display: flex;

    > * {
      flex: 1;
    }

    > div:first-child {
      span {
        color: $gray-9b;
      }
      .reward-statistics__stat-content {
        color: $gray-9b;
        border-left: 2px solid $gray-e6;
      }
    }
  }

  &__stat {
    &-title {
      color: $gray-9b;

      font-size: 12px;
      font-weight: 600;

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
