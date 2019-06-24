<template>
  <Transition name="base-dialog-v2-">
    <div
      v-if="isShow"
      ref="root"
      :class="rootClass"
      @click="onClickDialog"
    >
      <div
        ref="contentContainer"
        class="base-dialog-v2__content-container"
      >

        <header
          v-if="isShowHeader"
          class="lc-dialog-header lc-section-header base-dialog-v2__corner-block--top"
        >
          <div class="left">
            <slot name="header-left" />
          </div>

          <slot name="header-center" />

          <div class="right">
            <slot name="header-right" />

            <md-button
              v-if="isShowCloseButton"
              class="md-icon-button lc-mobile-show"
              @click="hide"
            >
              <md-icon>close</md-icon>
            </md-button>
          </div>
        </header>

        <main>
          <slot />
        </main>

      </div>
    </div>
  </Transition>
</template>

<script>
import { ResizeObserver } from 'resize-observer';

export default {
  props: {
    isShow: {
      type: [Boolean, String],
      default: false,
    },
    isShowBackdrop: {
      type: [Boolean, String],
      default: true,
    },
    isShowHeader: {
      type: [Boolean, String],
      default: true,
    },
    isShowCloseButton: {
      type: [Boolean, String],
      default: false,
    },
    isClosable: {
      type: [Boolean, String],
      default: true,
    },
  },
  computed: {
    rootClass() {
      return {
        'base-dialog-v2': true,
        'base-dialog-v2--absolute': true,
        'base-dialog-v2--with-backdrop': this.isShowBackdrop,
      };
    },
  },
  watch: {
    isShow(isShow) {
      if (isShow) {
        this.$nextTick(this.observeResizing);
      } else {
        this.resizeObserver.unobserve(document.documentElement);
        this.resizeObserver.unobserve(this.$refs.contentContainer);
      }
    },
  },
  mounted() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.$nextTick(this.observeResizing);
    this.$nextTick(this.updateRootHeight);
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
  },
  methods: {
    observeResizing() {
      if (this.resizeObserver && this.$refs.contentContainer) {
        this.resizeObserver.observe(document.documentElement, { box: 'border-box' });
        this.resizeObserver.observe(this.$refs.contentContainer, { box: 'border-box' });
      }
    },
    updateRootHeight() {
      if (this.$refs.root && this.$refs.contentContainer) {
        this.$refs.root.style.height = `${window.innerHeight + this.$refs.contentContainer.offsetHeight}px`;
      }
    },
    onResize() {
      if (!this.$refs.contentContainer) return;
      const windowHeight = window.innerHeight;
      const contentContainerHeight = this.$refs.contentContainer.offsetHeight;

      // Align the dialog to the vertical center of window
      this.$refs.contentContainer.style.marginTop = contentContainerHeight < windowHeight ? (
        `${Math.min((windowHeight - contentContainerHeight) / 2, 128)}px`
      ) : 0;

      this.updateRootHeight();
    },
    onClickDialog(e) {
      if (e.target.contains(this.$refs.contentContainer)) {
        this.onClickOutside(e);
      }
    },
    onClickOutside(e) {
      if (this.isClosable) {
        this.$emit('click-outside', e);
        this.$emit('update:isShow', false);
      }
    },
  },
};
</script>

<style lang="scss">
$corner-radius: 0.4rem;
$max-width: 536px;

.base-dialog-v2 {
  position: relative;
  z-index: 1000;

  width: 100%;

  &-- {
    &enter,
    &leave-to {
      opacity: 0;
    }

    &enter-active,
    &leave-active {
      transition-duration: 0.25s;
      transition-property: opacity, transform !important;
    }
    &enter-active {
      transition-timing-function: ease-out;
    }
    &leave-active {
      transition-timing-function: ease-in;
    }
  }

  &--absolute {
    position: absolute;
    top: 0;
    left: 0;
  }

  &--with-backdrop {
    &::before {
      position: fixed;
      top: -50vh;
      right: -50vw;
      bottom: 0;
      left: -50vw;

      content: '';

      background: linear-gradient(to bottom, rgba(black, 0.2) 80%, rgba(black, 0) 100%);
    }
  }

  &__content-container {
    position: relative;

    width: 100%;
    max-width: $max-width;

    background-color: white;

    box-shadow: 0 4px 25px 0 rgba(black, 0.4);

    @media screen and (min-width: $max-width + 1px) {
      margin: 104px auto 56px;

      border-radius: $corner-radius;
    }

    > * {
      z-index: -1;
    }
  }

  &__corner-block {
    @media screen and (min-width: $max-width + 1px) {
      border-radius: $corner-radius;

      &--top {
        border-top-left-radius: $corner-radius;
        border-top-right-radius: $corner-radius;
      }

      &--bottom {
        border-bottom-right-radius: $corner-radius;
        border-bottom-left-radius: $corner-radius;
      }

      &,
      &--top,
      &--bottom {
        &::before,
        &::after {
          border-radius: inherit;
        }
      }
    }
  }
}
</style>
