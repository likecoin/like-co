<template>
  <md-dialog :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar" />
    <div class="dialog-content">
      <md-dialog-title>
        <md-progress-spinner :md-diameter="28" :md-stroke="2" class="md-accent" md-mode="indeterminate" />
        Processing...
      </md-dialog-title>
      <md-dialog-content>Processing your request, please do not close the browser</md-dialog-content>
    </div>
  </md-dialog>
</template>

<script>
  export default {
    name: 'BlockerDialog',
    props: ['show'],
    data() {
      return {
        showDialog: this.show,
      };
    },
    watch: {
      show(show) {
        this.showDialog = show;
      },
    },
  };
</script>

<style lang="scss" scoped>
@import "../assets/dialog";

.title-bar {
  background-image: linear-gradient(to right, #ed9090, #ee6f6f 20%, #ecd7d7);;
}
</style>
