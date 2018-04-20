<template>
  <md-dialog
    class="lc-dialog"
    v-bind="getMdProps"
    :md-active.sync="isShowDialog">

    <header class="lc-dialog-header">
      <div class="left">
        <slot name="header-left" />
      </div>

      <slot name="header-center" />

      <div class="right">
        <slot name="header-right" />

        <md-button
          v-if="isShowCloseButton"
          class="md-icon-button lc-mobile-show"
          @click="hide">
          <md-icon>close</md-icon>
        </md-button>
      </div>
    </header>

    <md-dialog-content class="lc-dialog-content">

      <slot />

    </md-dialog-content>

  </md-dialog>
</template>


<script>
export default {
  name: 'base-dialog',
  props: {
    isShowCloseButton: {
      type: Boolean,
      default: false,
    },
    mdProps: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isShowDialog: false,
    };
  },
  computed: {
    getMdProps() {
      return {
        mdCloseOnEsc: true,
        mdFullscreen: true,
        ...this.mdProps,
      };
    },
  },
  methods: {
    show() {
      this.isShowDialog = true;
    },
    hide() {
      this.isShowDialog = false;
    },
    onDismiss() {
      this.hide();
    },
  },
};
</script>


<style lang="scss">
@import "~assets/variables";

$lc-dialog-header-height: 48px;

$lc-dialog-icon-size: 110px;
$lc-dialog-icon-size-small: 72px;

.lc-dialog {
  overflow: visible;

  max-width: 450px;

  &:not(.md-dialog-fullscreen) {
    border-radius: 8px;
  }

  :global(.md-dialog-container) {
    overflow: visible;
  }
}

.lc-dialog-header {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: space-between;

  min-height: $lc-dialog-header-height;

  padding: 0 8px;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;

    height: $lc-dialog-header-height;

    content: "";

    background-image: linear-gradient(252deg, #d2f0f0, #f0e6b4);

    .lc-dialog:not(.md-dialog-fullscreen) & {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
}

.lc-dialog-icon {
  position: absolute;
  z-index: 30;
  top: calc(50% - #{$lc-dialog-icon-size} / 2);
  left: calc(50% - #{$lc-dialog-icon-size} / 2);

  width: $lc-dialog-icon-size;
  height: $lc-dialog-icon-size;

  @media (max-width: 600px) {
    top: 8px;
    left: calc(50% - #{$lc-dialog-icon-size-small} / 2);

    width: $lc-dialog-icon-size-small;
    height: $lc-dialog-icon-size-small;
  }
}

.lc-dialog-content {
  padding-top: 16px;

  .lc-dialog.with-icon & {
    padding-top: ($lc-dialog-icon-size - $lc-dialog-header-height) / 2 + 16px;

    @media (max-width: 600px) {
      padding-top: 8px + $lc-dialog-icon-size-small - $lc-dialog-header-height + 16px;
    }
  }
}
</style>
