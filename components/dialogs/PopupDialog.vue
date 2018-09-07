<template>
  <md-dialog
    :md-active.sync="showDialog"
    :md-close-on-esc="allowClose"
    :md-click-outside-to-close="allowClose"
    :md-fullscreen="false"
    @md-closed="clearMessage"
    @md-clicked-outside="clearMessage"
  >
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title v-if="header">
        {{ header }}
      </md-dialog-title>

      <md-dialog-content v-if="message">
        <span v-html="message" />
      </md-dialog-content>

      <section>
        <material-button
          v-if="confirmText"
          id="btn-confirm"
          @click="onDialogConfirm"
        >
          {{ confirmText }}
        </material-button>
        <material-button
          v-if="cancelText"
          id="btn-cancel"
          @click="onDialogCancel"
        >
          {{ cancelText }}
        </material-button>
      </section>
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
  </md-dialog>
</template>


<script>
import MaterialButton from '@/components/MaterialButton';

export default {
  name: 'popup-dialog',
  components: {
    MaterialButton,
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
@import "~assets/dialog";

.md-dialog-container {
  .title-bar {
    background-color: #e6e6e6;
  }

  .dialog-content {
    > section {
      display: flex;
      flex-direction: column;

      margin-top: 36px;
    }
  }

  #btn-cancel {
    background-color: $like-gradient-3;
  }
}
</style>
