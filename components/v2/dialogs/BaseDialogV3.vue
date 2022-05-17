<template>
  <Transition name="base-dialog-v3-">
    <div
      v-if="isShow"
      ref="root"
      :class="rootClass"
      @click="onClickDialog"
    >
      <div
        ref="contentContainer"
        class="base-dialog-v3__content-container"
      >
        <button
          v-if="shouldShowCloseButton"
          class="base-dialog-v3__close-button"
          @click="$emit('click-close-button')"
        >
          <CloseIcon />
        </button>
        <main>
          <slot />
        </main>
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
  computed: {
    rootClass() {
      return {
        'base-dialog-v3': true,
        'base-dialog-v3--absolute': true,
        'base-dialog-v3--with-backdrop': this.isShowBackdrop,
      };
    },
    shouldShowCloseButton() {
      return this.isClosable || this.isShowCloseButton;
    },
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
  },
};
</script>
<style lang="scss">
.base-dialog-v3 {
  position: relative;
  z-index: 1000;

  display: flex;
  align-items: center;
  flex-direction: column;

  width: 100%;
  &-- {
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

        content: "";

        background: linear-gradient(
          to bottom,
          rgba(black, 0.2) 80%,
          rgba(black, 0) 100%
        );
      }
    }
  }

  &__content-container {
    position: relative;

    padding: 32px 24px;

    background-color: white;

    @media screen and (max-width: 420px) {
      width: 100%;
    }

    @media screen and (min-width: 421px) {
      min-width: 420px;
      margin: 104px auto 16px;

      border-radius: 24px;
    }

    > * {
      z-index: -1;
    }
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
