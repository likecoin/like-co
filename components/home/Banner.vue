<template>
  <div class="home-banner">

    <div
      v-if="isGifFinished"
      class="home-banner__wrapper lc-margin-top-8"
    >
      <div class="home-banner__content">
        <h1 class="lc-color-like-dark-brown-2">
          {{ $t('Home.Banner.label.slogan') }}
        </h1>
        <p
          :class="[
            'lc-margin-top-16',
            'lc-color-like-dark-brown-2',
            'lc-font-weight-600',
            'lc-font-size-22',
            'lc-line-height-1_5'
          ]"
        >{{ $t('Home.Banner.label.rewardPOC') }}</p>
      </div>

      <div class="lc-text-align-center lc-margin-top-24">
        <content-civics-cta :is-show-content="false" />
      </div>
    </div>

    <div
      v-else
      class="home-banner__gif lc-text-align-center"
    >
      <img
        :src="PocGif"
        @load="onGifLoaded"
      >
    </div>

    <div class="home-banner__bottom-underlay" />
  </div>
</template>


<script>
import PocGif from '@/assets/home/wordpress-poc.gif';

import ContentCivicsCta from './ContentCivicsCTA';

export default {
  name: 'home-banner',
  components: {
    ContentCivicsCta,
  },
  data() {
    return {
      isGifFinished: false,
      PocGif,
    };
  },
  beforeDestroy() {
    if (this.loadGifTimer) {
      clearTimeout(this.loadGifTimer);
    }
  },
  methods: {
    onGifLoaded() {
      this.loadGifTimer = setTimeout(() => {
        this.isGifFinished = true;
      }, 18500); // time for the gif to finish a round
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.home-banner {
  width: 100%;
  height: 540px;
  padding: 40px 112px;

  background-image: url('~/assets/home/banner.png');
  background-position: center;

  &__wrapper {
    animation: fade-in 0.35s ease-in;
  }

  &__content {
    h1 {
      max-width: 400px;

      font-size: 70px;
    }
    p {
      max-width: 272px;
    }
  }

  &__gif {
    img {
      height: 380px;
    }
  }

  .md-button {
    min-width: 272px;
  }

  &__bottom-underlay {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;

    height: 180px;

    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
  }
}
</style>
