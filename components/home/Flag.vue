<template>
  <div class="lc-flag">
    <img class="logo" alt="LikeCoin" :src="likeCoinIcon" />
    <h1 class="lc-font-size-38 lc-font-weight-300 lc-margin-top-8">
      {{ $t('Home.Flag.title') }}
    </h1>
    <h3 class="lc-font-size-18 lc-font-weight-600 lc-margin-top-16">
      {{ $t('Home.Flag.content') }}
    </h3>
  </div>
</template>

<script>
import likeCoinIcon from '@/assets/like-coin.svg';

export default {
  name: 'header-flag',
  data() {
    return {
      likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.lc-flag {
  width: 100%;

  background-image: linear-gradient(208deg, $like-light-blue, $like-gradient-1);

  .logo {
    width: 142px;
    height: 142px;
  }

  @media (min-width: 600px + 1px) {
    position: absolute;
    z-index: 2;
    top: 0;

    max-width: 298px;
    min-height: 406px;
    padding: 48px 24px 48px 48px;

    border-radius: 0 0 8px 8px;
  }

  @media (max-width: 600px) {
    padding: 32px 24px;

    > * {
      max-width: 224px;
    }
  }
}
</style>
