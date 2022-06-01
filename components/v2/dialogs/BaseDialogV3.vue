<template>
  <Transition name="base-dialog-v3-">
    <div
      v-if="isShow"
      ref="root"
      :class="rootClass"
      @click="onClickDialog"
    >
      <div
        class="base-dialog-v3__content-container"
        :style="contentContainerStyle"
      >
        <div
          ref="contentContainer"
          :class="contentContainerInnerClass"
        >
          <Transition
            name="fade"
            mode="out-in"
            appear
          >
            <button
              v-if="shouldShowCloseButton"
              class="base-dialog-v3__close-button"
              @click="$emit('click-close-button')"
            >
              <CloseIcon />
            </button>
            <div
              v-else
              key="dummy-for-time-sync"
            />
          </Transition>
          <main>
            <slot />
          </main>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import CloseIcon from '~/components/v2/icons/Close';

export default {
  components: {
    CloseIcon,
  },
  props: {
    isShow: {
      type: [Boolean, String],
      default: false,
    },
    isShowBackdrop: {
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
  data() {
    return {
      innerWidth: 0,
      innerHeight: 0,
    };
  },
  computed: {
    rootClass() {
      return {
        'base-dialog-v3': true,
        'base-dialog-v3--absolute': this.isShowBackdrop,
        'base-dialog-v3--with-backdrop': this.isShowBackdrop,
      };
    },
    shouldShowCloseButton() {
      return this.isClosable || this.isShowCloseButton;
    },
    hasContentContainerInited() {
      return this.innerWidth > 0 || this.innerHeight > 0;
    },
    contentContainerStyle() {
      if (!this.hasContentContainerInited) {
        return null;
      }
      return `width: ${this.innerWidth}px;height: ${this.innerHeight}px`;
    },
    contentContainerInnerClass() {
      return [
        'base-dialog-v3__content-container-inner',
        {
          'base-dialog-v3__content-container-inner--initial': !this.hasContentContainerInited,
        },
      ];
    },
  },
  mounted() {
    this.setupResizeObserver();
  },
  methods: {
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
    onClickCloseButton() {
      if (this.$listeners['click-close-button']) {
        this.$emit('click-close-button');
      } else {
        this.$emit('update:isShow', false);
      }
    },
    setupResizeObserver() {
      const { contentContainer } = this.$refs;
      if (!contentContainer) return;
      const resizeObserver = new ResizeObserver(([entry]) => {
        if (!entry || !entry.borderBoxSize) return;
        const borderBoxSize = Array.isArray(entry.borderBoxSize)
          ? entry.borderBoxSize[0]
          : entry.borderBoxSize;
        const {
          inlineSize: width,
          blockSize: height,
        } = borderBoxSize;
        this.innerWidth = width;
        this.innerHeight = height;
      });
      resizeObserver.observe(contentContainer);
    },
  },
};
</script>
<style>
.base-dialog-v3 {
  position: relative;
  z-index: 1000;

  display: flex;
  align-items: center;
  flex-direction: column;

  width: 100%;
}
.base-dialog-v3.base-dialog-v3--absolute {
  position: absolute;
  top: 0;
  left: 0;
}
.base-dialog-v3.base-dialog-v3--with-backdrop::before {
  position: fixed;
  top: -50vh;
  right: -50vw;
  bottom: 0;
  left: -50vw;

  content: "";

  background: rgba(0, 0, 0, 0.2) 80%;
}

.base-dialog-v3__content-container {
  overflow: hidden;

  transition-timing-function: ease-in-out;
  transition-duration: 0.2s;
  transition-property: width, height;

  background-color: white;
}
@media screen and (min-width: 421px) {
  .base-dialog-v3__content-container {
    margin: 104px auto 16px;

    border-radius: 24px;
  }
}
.base-dialog-v3.base-dialog-v3--absolute .base-dialog-v3__content-container  {
  filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.25));
}
.base-dialog-v3__content-container-inner {
  padding: 32px 24px;
}

.base-dialog-v3__content-container-inner:not(.base-dialog-v3__content-container-inner--initial) {
  position: absolute;
}

@media screen and (max-width: 420px) {
  .base-dialog-v3__content-container-inner {
    width: 100%;
  }
}
@media screen and (min-width: 421px) {
  .base-dialog-v3__content-container-inner {
    min-width: 420px;
  }
}

.base-dialog-v3__close-button {

  position: absolute;
  bottom: 100%;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 8px;

  padding: 14px;

  cursor: pointer;

  transition: all 0.2s ease;

  filter: drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.25));
  color: #28646e;

  border: none;
  border-radius: 50%;
}

.base-dialog-v3__close-button:active {
  transform: translateY(2px);

  filter: drop-shadow(2px 1px 4px rgba(0, 0, 0, 0.25));
}
</style>
