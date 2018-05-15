<template>
  <div class="lc-mission-completed-banner">

    <div class="banner-content lc-dialog-container-1">
      <div class="lc-dialog-container-2 lc-padding-vertical-32 lc-mobile">
        <div class="mission-description md-layout md-alignment-center-center">

          <h1 class="lc-font-size-32 lc-font-weight-400 lc-color-white lc-padding-bottom-4">
            {{ $t('Mission.completedBanner.label.completed') }}
          </h1>

          <p v-if="isShowDescription" class="lc-font-size-16 lc-color-white lc-text-align-center">
            {{ $t('Mission.completedBanner.label.bonusTransferShortly') }}
          </p>

        </div>
      </div>
    </div>

    <div class="completed-button-wrapper" @click="$emit('click')">
      <mission-state-icon state="completed" layout="large" />
    </div>

  </div>
</template>


<script>
import MissionStateIcon from './StateIcon';

export default {
  name: 'mission-completed-banner',
  props: {
    isShowDescription: {
      default: true,
      type: Boolean,
    },
  },
  components: {
    MissionStateIcon,
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

@keyframes mission-completed {
  0% {
    transform: scale(20);

    opacity: 0;
  }
  20% {
    opacity: 0;
  }
  79% {
    transform: scale(1);

    opacity: 1;
  }
  80% {
    transform: translateY(3px);
  }
  85% {
    transform: translateX(-2px);
  }
  90% {
    transform: translateY(-2px);
  }
  95% {
    transform: translateX(1px);
  }
  100% {
    transform: none;
  }
}

.lc-mission-completed-banner {
  .banner-content {
    padding-bottom: 26px;

    background-image: linear-gradient(51deg, #E7E75E, #3B8324);
  }

  .completed-button-wrapper {
    cursor: pointer;

    > * {
      margin: -26px auto 0;

      animation: mission-completed;
      animation-duration: .7s;
      animation-timing-function: ease-in;
      animation-iteration-count: 1;
    }
  }
}
</style>
