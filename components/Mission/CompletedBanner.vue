<template>
  <div class="lc-mission-completed-banner">
    <div class="lc-dialog-container-1">
      <div class="lc-dialog-container-2 lc-padding-vertical-32 lc-mobile">

        <div class="mission-description md-layout md-alignment-center-center">
          <h1 class="lc-font-size-32 lc-font-weight-400 lc-color-white lc-padding-bottom-4">
            {{ $t('Mission.completedBanner.label.completed') }}
          </h1>
          <p v-if="isShowDescription" class="lc-font-size-16 lc-color-white">
            {{ $t('Mission.completedBanner.label.bonusTransferShortly') }}
          </p>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'mission-completed-banner',
  props: {
    isShowDescription: {
      default: false,
      type: Boolean,
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.lc-mission-completed-banner {
  background-image: linear-gradient(51deg, #e7e75e, #3b8324);

  .mission-description {
    flex-direction: column;
  }
}
</style>
