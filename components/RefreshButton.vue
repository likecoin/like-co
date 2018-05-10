<template>
  <div
    :class="[
      'lc-refresh-button',
      {
        outline: isOutline,
        refreshing: isRefreshing,
      },
    ]"
    :style="{ color }">
    <md-button
      class="md-icon-button"
      :disabled="isRefreshing"
      @click="$emit('click')">
      <simple-svg
        :filepath="RefreshIcon"
        width="32px"
        height="32px"
        :fill="color"
        stroke="transparent" />
    </md-button>
  </div>
</template>


<script>
import RefreshIcon from '@/assets/icons/refresh.svg';

export default {
  name: 'refresh-button',
  props: {
    color: {
      type: String,
      default: '#28646E',
    },
    isOutline: {
      type: [Boolean, String],
      default: false,
    },
    isRefreshing: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      RefreshIcon,
    };
  },
};
</script>


<style lang="scss" scoped>
.lc-refresh-button {
  @keyframes rotation {
    0% { transform: rotateZ(0deg) };
    100% { transform: rotateZ(360deg) };
  }

  > * {
    animation-name: rotation;
    animation-duration: .5s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-play-state: paused;
  }

  &.outline {
    border-radius: 50%;
    border: solid 2px currentColor;
  }

  &.refreshing {
    pointer-events: none;

    > * {
      animation-play-state: running;
    }
  }
}

.md-icon-button {
  margin: 0;
}
</style>
