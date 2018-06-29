<template>
  <div class="video-player-dialog">

    <md-dialog
      :md-fullscreen="false"
      :md-active.sync="isShowDialog"
      class="md-dialog"
    >
      <div class="video-container">
        <div>
          <no-ssr>
            <vimeo-player
              :video-id="videoId"
              :autoplay="true"
              :options="{
                playsinline: false,
              }"
              class="video-player"
              @ended="close"
            />
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
  watch: {
    isShowDialog(isOpen) {
      this.$emit('toggle', isOpen);
    },
  },
  methods: {
    open() {
      this.isShowDialog = true;
    },
    close() {
      this.isShowDialog = false;
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

  &:before {
    display: block;

    width: 100%;
    padding-top: (9 / 16) * 100%;

    content: "";
  }

  > div {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

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
