<template>
  <div id="site-header">
    <nuxt-link :class="`title ${isTest ? 'test' : ''}`" :to="{ name: 'index' }">
      Likecoin Store
      <span class="sup">
        {{ isTest ? 'test' : 'beta' }}
      </span>
    </nuxt-link>
    <platform-icon-bar />
  </div>
</template>


<script>
import { IS_TESTNET } from '@/constant';
import PlatformIconBar from './PlatformIconBar';

export default {
  name: 'site-header',
  components: {
    PlatformIconBar,
  },
  data() {
    return {
      title: 'Likecoin Store',
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
