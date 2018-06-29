<template>
  <md-dialog
    :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false"
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
          id="btn-confirm"
          @click="onDialogConfirm"
        >
          {{ buttonText }}
        </material-button>
      </section>
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
  props: ['allowClose', 'header', 'message', 'confirmText'],
  data() {
    return {
      showDialog: false,
    };
  },
  computed: {
    buttonText() {
      if (this.confirmText) return this.confirmText;
      return this.$t('General.button.confirm');
    },
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
}
</style>
