<template>
  <base-dialog
    :is-show="showDialog"
    :md-props="{
      mdClickOutsideToClose: allowClose,
      mdCloseOnEsc: allowClose,
      mdFullscreen: false,
      mdClosed: clearMessage,
      mdClickOutside: clearMessage,
    }"
    class="popup-dialog"
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
        <md-button
          v-if="confirmText"
          class="md-likecoin"
          @click="onDialogConfirm"
        >
          {{ confirmText }}
        </md-button>
        <br>
        <md-button
          v-if="cancelText"
          class="md-likecoin lc-cancel"
          @click="onDialogCancel"
        >
          {{ cancelText }}
        </md-button>
      </div>

      <div
        v-if="subMessage"
        class="lc-padding-top-8 lc-text-align-center"
      >
        <a
          href="#"
          @click.prevent="onSubMessageClick"
        >{{ subMessage }}</a>
      </div>
    </div>
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
    subMessage: {
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
      showDialog: false,
    };
  },
  watch: {
    message(e) {
      this.showDialog = !!e;
    },
  },
  mounted() {
    this.showDialog = !!this.message;
  },
  methods: {
    toggleSync() {
      this.showDialog = !this.showDialog;
    },
    onDialogConfirm() {
      this.$emit('onConfirm');
      this.clearMessage();
    },
    onDialogCancel() {
      this.$emit('onCancel');
      this.clearMessage();
    },
    onSubMessageClick() {
      this.$emit('onSubMessageClick');
      this.clearMessage();
    },
    clearMessage() {
      this.$emit('update:message', '');
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';

.lc-dialog {
  :global(.lc-dialog-header::before) {
    background: #e6e6e6;
  }
}
</style>
