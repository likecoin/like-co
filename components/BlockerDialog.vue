<template>
  <md-dialog :md-active.sync="showDialog"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
    :md-fullscreen="false">
    <div class="title-bar"></div>
    <md-dialog-title>Processing...</md-dialog-title>
    <md-dialog-content>Processing your request, please do not close the browser</md-dialog-content>
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
    methods: {
      onClosed() {
        this.$emit('onClosed');
      },
    },
    watch: {
      show(show) {
        this.showDialog = show;
      },
    },
  };
</script>

<style scoped>

.md-dialog {
  min-width: 450px;
  min-height: 188px;
  border-radius: 6px;
  overflow: hidden;
}

.title-bar {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 48px;
  background-image: linear-gradient(to right, #ed9090, #ee6f6f 20%, #ecd7d7);;
}

.md-dialog-title {
  padding-top: 70px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 32px;
}

.md-dialog-content {
  margin-left: 20px;
  margin-right: 20px;
  font-size: 16px;
}

</style>
