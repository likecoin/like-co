<template>
  <base-dialog
    :is-show="show"
    :md-props="{
      mdClickOutsideToClose: false,
      mdCloseOnEsc: false,
      mdFullscreen: false,
    }"
    class="blocker-dialog"
  >
    <div class="lc-dialog-container-1 lc-padding-bottom-24">
      <h1 class="lc-font-size-32 lc-margin-bottom-8">
        {{ $t('Dialog.blocker.title') }}
      </h1>
      <p class="lc-font-size-16 lc-color-like-gray-4">
        {{ $t('Dialog.blocker.content') }}
      </p>
    </div>
  </base-dialog>
</template>


<script>
import BaseDialog from '~/components/dialogs/BaseDialog';

export default {
  name: 'blocker-dialog',
  components: {
    BaseDialog,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/mixin";

.blocker-dialog {
  :global(.lc-dialog-header::before) {
    @include background-image-sliding-animation-x(
      linear-gradient(to right, #ed9090, #ee6f6f 20%, #ecd7d7, #ed9090)
    );
  }
}
</style>
