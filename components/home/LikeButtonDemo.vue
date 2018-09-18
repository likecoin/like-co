<template>
  <div class="like-button-demo">
    <div
      :class="[
        'lc-flex',
        'lc-justify-content-space-between',
        'lc-align-items-center',
        'lc-margin-bottom-16',
        'lc-mobile-show'
      ]"
    >
      <site-title :logoSrc="likeCoinIcon" />
      <menu-button :is-show-label="false" />
    </div>

    <i18n
      class="lc-margin-top-8 lc-font-weight-600"
      path="Home.LikeButtonDemo.label.lookForButton"
      tag="p"
    >
      <span
        class="bold lc-cursor-pointer"
        place="LikeButton"
        @click="openContentCivicPopup"
      >{{ $t('Home.LikeButtonDemo.label.button') }}</span>
    </i18n>

    <sample-like-button
      class="lc-margin-top-24"
      @like="openContentCivicPopup"
      @toggle="openContentCivicPopup"
    />
  </div>
</template>


<script>
import SampleLikeButton from '~/components/home/SampleLikeButton';
import MenuButton from '~/components/SlidingMenu/MenuButton';
import SiteTitle from '~/components/SiteTitle';

import likeCoinIcon from '@/assets/logo/icon-label-horizontal.svg';

export default {
  name: 'like-button-demo',
  components: {
    SampleLikeButton,
    MenuButton,
    SiteTitle,
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
  methods: {
    openContentCivicPopup() {
      this.$emit('popup');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.like-button-demo {
  background-image: linear-gradient(194deg, $like-light-blue, $like-gradient-1);

  @media (min-width: 600px + 1px) {
    width: 272px;
    margin-top: -32px;
    margin-right: 32px;
    padding: 24px;
  }

  @media (max-width: 600px) {
    padding: 8px 24px 24px;
  }

  .site-title :global(img) {
    width: 162px;
  }
}
</style>
