<template>
  <div class="mission-bonus-countdown">
    <i18n
      v-if="displayName"
      path="Mission.common.label.userJoinedLikeCoin"
      class="title-label"
      tag="h1"
    >
      <nuxt-link
        :to="{ name: 'id', params: { id } }"
        class="lc-font-weight-600"
      >{{ displayName }}</nuxt-link>
    </i18n>

    <span>
      {{ $t('Mission.common.label.waitForBonus') }}
    </span>

    <div class="mission-bonus-countdown__timer">
      <div class="mission-bonus-countdown__clock">
        <mission-clock />
      </div>
      <mission-countdown-timer
        :date="bonusCooldown"
        @finish="$emit('finish')"
      />
    </div>
  </div>
</template>


<script>
import MissionClock from '~/components/Mission/Clock';
import MissionCountdownTimer from '~/components/Mission/CountdownTimer';

export default {
  name: 'mission-bonus-countdown',
  components: {
    MissionClock,
    MissionCountdownTimer,
  },
  props: {
    bonusCooldown: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      default: '',
    },
    displayName: {
      type: String,
      default: '',
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.mission-bonus-countdown {
  color: $like-gray-4;

  h1 {
    margin-bottom: 12px;

    font-size: 32px;
  }

  span {
    font-size: 16px;
  }

  &__timer {
    position: relative;

    padding: 32px 0;
  }

  &__clock {
    position: absolute;
    top: 50%;

    width: 52px;
    height: 52px;
    padding: 8px;

    transform: translateY(-50%) translateX(8px);

    border: 2px solid $gray-e6;
    border-radius: 50%;
  }

  .mission-countdown-timer {
    font-size: 48px !important;
    font-weight: 300;
    line-height: 1;

    /deep/ li:after {
      margin-left: -10px;
      padding-right: 6px;
    }

    @media (max-width: 600px) {
      font-size: 32px !important;
    }
  }
}
</style>
