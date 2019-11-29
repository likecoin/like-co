<template>
  <div class="likecoin-button-banner">
    <div class="lc-container-3">
      <div class="likecoin-button-banner__left">
        <LikeToCoinGraph />
      </div>
      <div class="likecoin-button-banner__right">
        <h2 class="likecoin-button-banner__title">{{ $t('LikeCoinButtonBanner.title') }}</h2>
        <p class="likecoin-button-banner__description">
          {{ $t('LikeCoinButtonBanner.description') }}
        </p>
        <md-button
          class="md-likecoin outline lc-margin-top-24"
          :to="{ name: 'in-creator' }"
        >{{ $t('LikeCoinButtonBanner.ctaButtonText') }}</md-button>
      </div>
    </div>
  </div>
</template>

<script>
import LikeToCoinGraph from '~/components/graph/LikeToCoin';

export default {
  name: 'likecoin-button-banner',
  components: {
    LikeToCoinGraph,
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

.likecoin-button-banner {
  .lc-container-3 {
    display: flex;
    align-content: center;

    > * {
      flex: 1;
    }
  }

  .md-button {
    margin: 0;
  }

  &__left {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    color: $like-dark-brown-2;

    font-size: 32px;
    font-weight: 300;
  }

  &__description {
    margin-top: 12px;

    color: $like-gray-4;

    font-size: 16px;
    line-height: 1.5;
  }

  svg {
    width: 100%;
    max-width: 306px;
  }
}
</style>
