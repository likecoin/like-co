<template>
  <div id="site-header">
    <nuxt-link :class="`title ${isTest ? 'test' : ''}`" :to="{ name: 'index' }">
      {{ $t('Store.Header.label.store') }}
      <span class="sup">
        {{ isTest ? $t('Store.Header.label.test') : $t('Store.Header.label.beta') }}
      </span>
    </nuxt-link>
    <div class="icons">
      <platform-icon-bar />
      <language-switch class="md-xsmall-hide" />
    </div>
  </div>
</template>


<script>
import { IS_TESTNET } from '@/constant';
import LanguageSwitch from './LanguageSwitch';
import PlatformIconBar from './PlatformIconBar';

export default {
  name: 'site-header',
  components: {
    LanguageSwitch,
    PlatformIconBar,
  },
  data() {
    return {
      isTest: IS_TESTNET,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/index";

#site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 48px 8px;

  .title {
    font-size: 18px;
    color: $like-green;
    text-decoration: none;

    &.test {
      color: $like-red;
    }

    > .sup {
      vertical-align: super;
      font-size: 12px;
    }
  }

  .icons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}

@media (max-width: 768px) {
  #site-header {
    flex-direction: column;
    padding: 12px 0;

    .title {
      display: none;
    }
  }
}
</style>
