<template>
  <md-dialog
    :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title v-if="header">{{ header }}</md-dialog-title>
      <md-dialog-content v-if="message">
        <span v-html="message" />
      </md-dialog-content>
      <section>
        <md-button id="btn-confirm" class="md-primary" @click="onDialogConfirm">
          {{ buttonText }}
        </md-button>
      </section>
    </div>
  </md-dialog>
</template>

<script>
  export default {
    name: 'PopupDialog',
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
    methods: {
      toggleSync() {
        this.showDialog = !this.showDialog;
      },
      onDialogConfirm() {
        this.$emit('onConfirm');
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

      #btn-cancel {
        background-color: $like-gradient-3;
        color: $like-white;
      }

      #btn-confirm {
        background-color: $like-green;
        color: $like-white;
      }
    }
  }
}
</style>
