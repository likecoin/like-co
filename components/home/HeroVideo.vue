<template>
  <section :class="['hero-video', { played: hasPlayed }]">
    <div class="lc-container-0">
      <div class="lc-container-1">

        <div class="video-container">
          <div>
            <div>
              <div>
                <no-ssr>
                  <vimeo-player
                    ref="player"
                    class="video-player"
                    :video-id="getHeroVideoId"
                    :autoplay="true"
                    :loop="true"
                    :options="{
                      background: true,
                      muted: true,
                    }"
                    @play="onPlay" />
                </no-ssr>
              </div>
            </div>
          </div>
        </div>

        <div
          class="video-thumbnail"
          :style="{ backgroundImage: `url(/images/video-thumbnails/${getThumbnailImageFileName}.jpg)` }" />

        <div
          class="play-overlay"
          @click="onClickPlayButton">
          <img :src="PlayTriangleIcon" />
        </div>

        <div class="play-button-wrapper">
          <play-video-button
            :label="$t('Home.HeroVideo.button.watchVideo')"
            @click="onClickPlayButton" />
        </div>

      </div>
    </div>

    <video-player-dialog
      ref="videoPlayerDialog"
      :video-id="getDialogVideoId"
      @toggle="onTogglePlayerDialog" />

  </section>
</template>

<script>
import VideoPlayerDialog from '@/components/dialogs/VideoPlayerDialog';
import PlayVideoButton from '@/components/home/PlayVideoButton';

import PlayTriangleIcon from '@/assets/icons/play-triangle.svg';

export default {
  name: 'hero-video',
  components: {
    VideoPlayerDialog,
    PlayVideoButton,
  },
  data() {
    return {
      PlayTriangleIcon,
      hasPlayed: false,
    };
  },
  computed: {
    getHeroVideoId() {
      return this.$i18n.locale === 'zh' ? '263989554' : '264012719';
    },
    getDialogVideoId() {
      switch (this.$i18n.locale) {
        case 'cn': return '264581697';

        case 'ja': return '264582297';

        case 'zh': return '263110337';

        default: return '263833566';
      }
    },
    getThumbnailImageFileName() {
      return this.$i18n.locale === 'zh' ? 'live-action' : 'infographic';
    },
  },
  methods: {
    onPlay() {
      this.hasPlayed = true;
    },
    onClickPlayButton() {
      this.$refs.videoPlayerDialog.open();
    },
    onTogglePlayerDialog(isOpen) {
      if (!isOpen) {
        this.$refs.player.play();
      } else {
        this.$refs.player.pause();
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

$video-height: 488px;

.hero-video {
  position: relative;

  overflow: hidden;

  .lc-container-1 {
    max-width: 1440px + 64px * 2;
  }
}

.video-container {
  position: relative;

  background-color: black;

  @media (min-width: 600px + 1px) {
    height: $video-height;
    max-height: $video-height;
  }

  @media (max-width: 600px) {
    height: 64px;
  }

  > div {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;

    @media (max-width: 600px) {
      display: none;
    }

    > div {
      position: relative;
      left: 50%;

      padding-top: 9 / 16 * 100%;

      transform: translateX(-50%);

      @media (min-width: 963px) {
        transform: translateX(-50%) translateY(-10%);
      }

      @media (min-width: 600px + 1px) {
        min-width: $video-height / 9 * 16;
        min-height: $video-height;
      }

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

            pointer-events: none;
          }
        }
      }
    }
  }
}

.video-thumbnail {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  transition: opacity .5s ease-out;

  opacity: 1;
  background-position: center 25%;
  background-size: cover;

  .played & {
    @media (min-width: 600px + 1px) {
      opacity: 0;
    }
  }
}

.play-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  cursor: pointer;
  transition: all .5s ease-out;

  background-color: rgba(0, 0, 0, 0.2);

  .played & {
    @media (min-width: 600px + 1px) {
      opacity: 0;
    }

    &:hover {
      @media (min-width: 600px + 1px) {
        opacity: 1;
      }
    }
  }

  > img {
    position: relative;
    top: 50%;
    left: 50%;

    width: 120px;
    height: 138px;

    transform: translateX(-50%) translateY(-50%);

    @media (max-width: 600px) {
      display: none;
    }
  }
}

.play-button-wrapper {
  position: absolute;
  bottom: 0;
  left: 50%;

  margin-bottom: 24px;

  transform: translateX(-50%);

  @media (max-width: 600px) {
    margin-bottom: 8px;
  }
}
</style>
