<template>
  <div class="video-player-dialog">

    <md-dialog
      class="md-dialog"
      :md-fullscreen="false"
      :md-active.sync="isShowDialog">
      <div class="video-container">
        <div>
          <no-ssr>
            <vimeo-player
              class="video-player"
              :video-id="videoId"
              :autoplay="true"
              :options="{
                playsinline: false,
              }"
              @ended="close" />
          </no-ssr>
        </div>
      </div>
    </md-dialog>

  </div>
</template>


<script>
import PlayButton from '~/assets/img/play-button.png';

export default {
  name: 'video-player-dialog',
  props: {
    videoId: {
      type: String,
    },
  },
  data() {
    return {
      PlayButton,
      isShowDialog: false,
    };
  },
  methods: {
    open() {
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
    },
  },
  watch: {
    isShowDialog(isOpen) {
      this.$emit('toggle', isOpen);
    },
  },
};
</script>


<style lang="scss" scoped>
.md-dialog {
  width: 70%;

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
  }
}

.video-container {
  position: relative;

  padding-top: 9 / 16 * 100%;

  > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    width: 100%;

    :global(> div) {
      width: 100%;
      height: 100%;

      :global(> iframe) {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
