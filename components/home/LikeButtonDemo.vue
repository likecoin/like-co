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
      <site-title isColorLogo />
      <menu-button :is-show-label="false" />
    </div>

    <h1 class="lc-font-size-32 lc-color-like-dark-brown-2">
      {{ $t('Home.LikeButtonDemo.label.button') }}
    </h1>
    <p class="lc-margin-top-8 lc-color-like-gray-5 lc-font-weight-600">
      {{ $t('Home.LikeButtonDemo.label.description') }}
    </p>

    <like-button
      class="lc-margin-top-24"
      @like="openContentCivicPopup"
      @toggle="openContentCivicPopup"
    />
  </div>
</template>


<script>
import LikeButton from '~/components/home/LikeButton';
import MenuButton from '~/components/SlidingMenu/MenuButton';
import SiteTitle from '~/components/SiteTitle';

export default {
  name: 'like-button-demo',
  components: {
    LikeButton,
    MenuButton,
    SiteTitle,
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
