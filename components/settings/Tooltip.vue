<template>
  <div class="lc-tooltip">
    <div
      ref="activator"
      @click="onClickActivator"
      @mouseover="setContentVisibility(true)"
      @mouseleave="setContentVisibility(false)"
    >
      <slot name="activator" />
    </div>

    <transition name="lc-tooltip__content-">
      <div
        v-if="isVisible && !!$slots.default"
        :class="['lc-tooltip__content']"
        @mouseover="setContentVisibility(true)"
        @mouseleave="setContentVisibility(false)"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'tooltip',
  props: {
    closeDelay: {
      type: Number,
      default: 300,
    },
    links: {
      type: Object,
      default: () => {},
    },
    openDelay: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      if (this.openTimer) {
        clearTimeout(this.openTimer);
        this.openTimer = null;
      }
      if (this.closeTimer) {
        clearTimeout(this.closeTimer);
        this.closeTimer = null;
      }
    },
    setContentVisibility(isVisible, delay) {
      if (isVisible) {
        this.clearTimer();
        this.openTimer = setTimeout(() => {
          this.isVisible = true;
        }, delay >= 0 ? delay : this.openDelay);
      } else {
        this.clearTimer();
        this.closeTimer = setTimeout(() => {
          this.isVisible = false;
        }, delay >= 0 ? delay : this.openDelay);
      }
    },
    onClickActivator() {
      if (this.isVisible) {
        this.setContentVisibility(false, 0);
      } else {
        this.setContentVisibility(true, 0);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

$arrow-size: 6px;

.lc-tooltip {
  position: relative;

  &__content {
    position: absolute;
    z-index: 10;
    top: 18px;

    padding: 4px;

    color: $like-green;
    border: 1px solid $gray-9b;
    border-radius: 4px;
    background-color: $like-white;

    // little arrow
    &:before,
    &:after {
      position: absolute;
      left: 8px;

      content: " ";

      border-width: 0 $arrow-size $arrow-size $arrow-size;
      border-style: solid;
    }

    &:before {
      top: -#{$arrow-size + 1};

      border-color: transparent transparent $gray-9b transparent;
    }
    &:after {
      top: -#{$arrow-size};

      border-color: transparent transparent $like-white transparent;
    }

    &-- {
      &enter-active {
        transition-timing-function: ease-out;
        transition-duration: 0.15s;
      }
      &leave-active {
        transition-timing-function: ease-in;
        transition-duration: 0.15s;
      }
      &enter {
        transform: translateY(0);

        opacity: 1;
      }
      &enter,
      &leave-to {
        transform: translateY(-8px);

        opacity: 0;
      }
    }
  }
}
</style>
