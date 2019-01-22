<template>
  <div class="home-mobile-header">
    <div
      :class="[
        'home-mobile-header__hero',
        'lc-flex',
        'lc-justify-content-space-between',
        'lc-align-items-center',
      ]"
    >
      <site-title :logo-src="likeCoinIcon" />
      <menu-button :is-show-label="false" />
    </div>

    <civic-liker-cta />

  </div>
</template>


<script>
import MenuButton from '~/components/SlidingMenu/MenuButton';
import SiteTitle from '~/components/SiteTitle';
import CivicLikerCta from '~/components/CivicLiker/CTA';

import likeCoinIcon from '~/assets/logo/icon-label-horizontal.svg';

export default {
  name: 'home-mobile-header',
  components: {
    MenuButton,
    SiteTitle,
    CivicLikerCta,
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.home-mobile-header {
  position: relative;

  background-image: linear-gradient(194deg, $like-light-blue, $like-gradient-1);

  &__hero {
    position: relative;

    padding: 8px 24px;

    .site-title :global(img) {
      width: 162px;
    }

  }

  .civic-liker-cta {

    :global(.chop-art) {
      transform: scale(0.9);
      transform-origin: center top;
    }

    :global(> div > div:nth-child(2)) {
      :global(.lc-button-group) {
        margin-top: -24px;
        padding-top: 0;
      }

      width: 100%;

      background: white;
    }

    &--renewal {
      :global(> div > div:first-child) {
        padding: 0 24px 32px;
      }
    }
  }
}
</style>
