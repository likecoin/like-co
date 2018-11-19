<template>
  <div class="civic-liker-cta">
    <div class="civic-liker-cta__image">
      <img :src="getCivicLikerBanner">
    </div>
    <div class="civic-liker-cta__text">
      <div class="lc-font-size-32 lc-font-weight-300 lc-padding-top-24 civic-liker-cta__title">
        {{ $t('In.civicLiker.title') }}
      </div>
      <div class="lc-font-size-16 lc-font-weight-normal lc-padding-top-8 civic-liker-cta__label">
        {{ $t('In.civicLiker.description') }}
      </div>
    </div>
    <div class="links">
      <md-button
        :to="{ name: 'in-settings-button' }"
        class="link md-likecoin lc-text-align-center lc-font-weight-600 shadow"
      >{{ $t('Settings.button.becomeBacker') }}</md-button>
    </div>
  </div>
</template>
<script>
const assetFolder = require.context('@/assets/');

export default {
  name: 'civic-liker-cta',
  computed: {
    getCivicLikerBanner() {
      // TODO: Change this banner
      return assetFolder('./home/banner.png');
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.civic-liker-cta {
  &__image {
    width: calc(100vw * 0.67);
    margin-left: -64px; /* to ignore lc-container-2 padding-left */

    @media (max-width: 960px) {
      margin-left: -32px;
    }

    @media (max-width: 768px) {
      margin-left: -24px;
    }

    @media (max-width: 600px) {
      margin-left: 0;
    }
  }

  &__text {
    width: 66.6%;

    text-align: center;
  }

  &__title {
    color: $like-dark-brown-2;
  }

  &__label {
    padding-top: 8px;

    color: $like-gray-4;
  }
}

.links {
  z-index: 1;

  margin-top: -24px;

  @media (min-width: #{768px + 1px}) {
    align-self: flex-end;

    width: calc(33.33% - 40px);
    margin-top: -60px;
    margin-right: #{40px + 8px};
    margin-left: 66.6%;
  }

  @media (max-width: 768px) {
    align-self: center;

    width: 100%;

    margin-top: 0px;
    margin-left: 0px;
    padding: 0 24px;

    text-align: center;
  }

  .link {
    margin: 0;

    transition: opacity .2s ease-in-out;

    background-image: $like-linear-gradient-2;
    &:not(:first-child) {
      margin-top: 8px;
    }

    &:hover {
      opacity: 0.8;
    }

    > a, span {
      text-decoration: underline;
    }
  }
}
</style>
