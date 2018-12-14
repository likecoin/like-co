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

$inset: 220px;

.home-mobile-header {
  &__hero {
    position: relative;

    margin-bottom: -#{$inset};
    padding: 8px 24px $inset;

    background-image: linear-gradient(194deg, $like-light-blue, $like-gradient-1);

    .site-title :global(img) {
      width: 162px;
    }
  }
}
</style>
