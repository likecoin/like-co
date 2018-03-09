<template>
  <div class="lc-flag">
    <img alt="like coin" :src="likeCoinIcon" />
    <h1>{{ $t('Home.Flag.title') }}</h1>
    <h3>{{ $t('Home.Flag.content') }}</h3>

    <language-switch class="md-xsmall-show" />
  </div>
</template>

<script>
import LanguageSwitch from '../LanguageSwitch';
import likeCoinIcon from '../../assets/like-coin.svg';

export default {
  name: 'header-flag',
  components: {
    LanguageSwitch,
  },
  data() {
    return {
      likeCoinIcon,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

.lc-flag {
  position: absolute;
  z-index: 2;
  top: 0;

  width: 298px;
  height: 406px;
  padding: 48px 12px 48px 48px;

  border-radius: 0 0 8px 8px;
  background-image: linear-gradient(208deg, $like-light-blue, $like-gradient-1);

  > img {
    width: 142px;
    height: 142px;
  }

  h1 {
    margin-top: 8px;

    font-size: 36px;
    line-height: 46px;
  }

  h3 {
    letter-spacing: -0.2px;

    font-size: 18px;
    font-weight: 600;
    line-height: 28px;

    margin-top: 16px;
  }
}

@media (max-width: 600px) {
  body .lc-flag {
    width: 100%;
    position: relative;

    border-radius: 0;

    padding: 32px 24px;

    h1, h3 { width: 223px; }

    > .language-switch {
      position: absolute;
      top: 24px;
      right: 24px;
    }
  }
}
</style>
