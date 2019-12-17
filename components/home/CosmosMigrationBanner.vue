<template>
  <div class="cosmos-migration-banner">
    <div class="cosmos-migration-banner__left-col">
      <div class="cosmos-migration-banner__title">
        {{ $t('CosmosMigrationBanner.title') }}
      </div>
      <div class="cosmos-migration-banner__subtitle">
        {{ $t('CosmosMigrationBanner.subtitle') }}
      </div>
      <div class="cosmos-migration-banner__action-button">
        <md-button
          class="md-likecoin lc-gradient-2 lc-font-size-20 lc-font-weight-600 shadow"
          :href="migrationURL"
        >{{ $t('CosmosMigrationBanner.actionButtonText') }}</md-button>
      </div>
    </div>
    <div class="cosmos-migration-banner__right-col" />
  </div>
</template>

<script>
import { getMigrationSiteURL } from '@/util/api/api';

export default {
  name: 'cosmos-migration-banner',
  props: {
    username: {
      type: String,
      default: '',
    },
  },
  computed: {
    migrationURL() {
      return getMigrationSiteURL(this.username ? this.username : '');
    },
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

.cosmos-migration-banner {
  display: flex;

  width: 100%;
  max-width: 816px;
  margin: 0 auto;

  @media screen and (min-width: 600px + 1px) {
    min-height: 200px;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }

  background-color: white;

  &__left-col {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    min-width: 256px;
    max-width: 80%;
    padding: 20px 40px;
  }

  &__right-col {
    flex-shrink: 0;

    width: 100%;
    max-width: 20%;

    background-image: url('~assets/home/cosmos-migration-artwork.svg');
    background-repeat: none;
    background-size: 100% 100%;
    background-position-x: 0;
  }

  &__title {
    color: $like-green;

    font-size: 36px;
    font-weight: 300;
    line-height: 1.2;
  }

  &__subtitle {
    flex-grow: 1;

    margin-top: 12px;

    font-weight: 600;
  }

  &__action-button {
    display: flex;
    justify-content: center;

    text-align: center;
  }
}
</style>
