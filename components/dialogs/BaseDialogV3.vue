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
        <main>
          <slot />
        </main>
      </div>
    </div>
  </Transition>
</template>

<script>
// import { ResizeObserver } from 'resize-observer';

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
  },
};
</script>
<style lang="scss">
$max-width: 420px;

.base-dialog-v3 {
  position: relative;
  z-index: 1000;

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

    width: 100%;
    max-width: $max-width;

    padding: 32px 24px;

    background-color: white;

    @media screen and (min-width: $max-width + 1px) {
      margin: 104px auto 16px;

      border-radius: 24px;
    }

    > * {
      z-index: -1;
    }
  }
}
</style>
