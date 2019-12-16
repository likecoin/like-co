<template>
  <div class="home-banner lc-container-2">

    <div class="home-banner__wrapper">
      <Banner />
    </div>

    <div class="home-banner__bottom-underlay" />
  </div>
</template>


<script>
import Banner from './CosmosMigrationBanner';

export default {
  name: 'home-banner',
  components: {
    Banner,
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
