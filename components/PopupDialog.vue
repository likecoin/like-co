<template>
  <md-dialog-confirm :class="allowClose? '': 'errorDialog'"
    :md-active.sync="showDialog"
    :md-close-on-esc="allowClose"
    :md-click-outside-to-close="allowClose"
    :md-title="header"
    :md-content="message"
    @md-confirm="onDialogConfirm" />
</template>

<script>
  export default {
    name: 'PopupDialog',
    data() {
      return {
        showDialog: false,
      };
    },
    props: ['allowClose', 'header', 'message'],
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

<style>

.errorDialog .md-button {
  display: none
}

</style>
