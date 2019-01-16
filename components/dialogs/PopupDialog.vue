<template>
  <base-dialog
    :is-show="isShowDialog"
    :md-props="{
      mdClickOutsideToClose: allowClose,
      mdCloseOnEsc: allowClose,
      mdFullscreen: false,
      mdClosed: onClosed,
      mdClickOutside: onClosed,
    }"
    class="popup-dialog"
    @update:isShow="onUpdateIsShow"
  >
    <div class="lc-dialog-container-1">
      <h1
        v-if="header"
        class="lc-font-size-32 lc-margin-bottom-8"
      >
        {{ header }}
      </h1>

      <p
        v-if="message"
        class="lc-font-size-16 lc-color-like-gray-4"
        v-html="message"
      />

      <div class="lc-button-group lc-margin-top-16">
        <div>
          <md-button
            v-if="confirmText"
            class="md-likecoin"
            @click="onConfirm"
          >
            {{ confirmText }}
          </md-button>
          <md-button
            v-if="cancelText"
            class="md-likecoin lc-cancel"
            @click="onCancel"
          >
            {{ cancelText }}
          </md-button>
        </div>
      </div>
    </div>

    <slot name="footer" />

  </base-dialog>
</template>


<script>
import BaseDialog from '~/components/dialogs/BaseDialog';

export default {
  name: 'popup-dialog',
  components: {
    BaseDialog,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    allowClose: {
      type: Boolean,
      default: false,
    },
    header: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isShowDialog: this.isShow,
    };
  },
  watch: {
    isShow(isShow) {
      this.isShowDialog = isShow;
    },
    isShowDialog(isShowDialog) {
      this.$emit('update:isShow', isShowDialog);
    },
  },
  methods: {
    onConfirm() {
      this.isShowDialog = false;
      this.$emit('confirm');
      this.onClosed();
    },
    onCancel() {
      this.isShowDialog = false;
      this.$emit('cancel');
      this.onClosed();
    },
    onClosed() {
      this.$emit('closed');
    },
    onUpdateIsShow(isShow) {
      this.isShowDialog = isShow;
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';

.lc-dialog {
  :global(.lc-dialog-header::before) {
    background: linear-gradient(246deg, #d2f0f0, #f0e6b4);
  }
}

.lc-button-group {
  display: flex;
  align-items: center;
  flex-direction: column;

  > div {
    display: inherit;
    align-items: inherit;
    flex-direction: inherit;

    > .md-button {
      width: 100%;
      margin: 6px;
    }
  }
}
</style>
