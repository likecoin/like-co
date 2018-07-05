<template>
  <div
    :class="[
      'lc-refresh-button',
      {
        outline: isOutline,
        refreshing: isRefreshing,
      },
    ]"
    :style="{ color }"
  >
    <md-button
      :disabled="isRefreshing"
      class="md-icon-button"
      @click="$emit('click')"
    >
      <simple-svg
        :filepath="RefreshIcon"
        :fill="color"
        width="32px"
        height="32px"
        stroke="transparent"
      />
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
    0% { transform: rotateZ(0deg) }
    100% { transform: rotateZ(360deg) }
  }

  > * {
    animation-name: rotation;
    animation-duration: .5s;
    animation-play-state: paused;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  &.outline {
    border: solid 2px currentColor;
    border-radius: 50%;
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
