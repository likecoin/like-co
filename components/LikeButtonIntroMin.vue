<template>
  <div class="like-button-intro-min">
    <div class="like-button-intro-min__text">
      <div class="lc-font-size-32 lc-font-weight-300 like-button-intro-min__title">
        {{ $t('LikeButtonIntro.title.minTitle') }}
      </div>
      <div class="lc-font-size-16 lc-font-weight-normal like-button-intro-min__label">
        {{ $t('LikeButtonIntro.label.minLabel') }}
      </div>
    </div>
    <div class="like-button-intro-min__image">
      <img :src="getLikeBtnExamplePath">
    </div>
  </div>
</template>

<script>
const assetFolder = require.context('@/assets/');

export default {
  name: 'like-button-intro-min',
  computed: {
    getLikeBtnExamplePath() {
      return assetFolder('./like-button/likebtn-example.jpg');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.like-button-intro-min {
  display: flex;

  &__text {
    flex: 1;
  }

  &__title {
    color: $like-dark-brown-2;
  }

  &__label {
    padding-top: 8px;

    color: $like-gray-4;
  }

  &__image {
    flex: 2;

    img {
      display: block;

      margin-right: auto;
      margin-left: auto;
    }
  }

  @media (max-width: 600px) {
    display: block;
  }
}
</style>
