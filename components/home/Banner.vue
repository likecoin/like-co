<template>
  <div class="home-banner lc-container-2">

    <div class="home-banner__wrapper">
      <div class="home-banner__content">
        <div class="civic-liker-cta-wrapper">
          <civic-liker-cta />
        </div>
        <!-- Old banner
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
        -->
      </div>
    </div>

    <div class="home-banner__bottom-underlay" />
  </div>
</template>


<script>
import CivicLikerCta from '~/components/CivicLiker/CTA';

export default {
  name: 'home-banner',
  components: {
    CivicLikerCta,
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.home-banner {
  width: 100%;
  padding-top: 36px;
  padding-bottom: 84px;

  background-image: url('~assets/home/banner.png');
  background-position: center;
  background-size: cover;

  &__wrapper {
    position: relative;
    z-index: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    animation: fade-in 0.35s ease-in;
  }

  &__content {
    h1 {
      max-width: 400px;

      font-size: 60px;
      line-height: 1.1;
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

.civic-liker-cta-wrapper {
  background: white;

  .civic-liker-cta--renewal {
    padding: 24px;

    :global(.civic-liker-cta__content) {
      padding: 8px 0 0;
    }
  }
}
</style>
