<template>
  <div id="site-header">
    <div class="navigation-menu">
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
    <div class="lc-container-3 md-xsmall-hide">
      <material-button
        className="account-btn"
        @click="$router.push({ name: getUserIsRegistered ? 'edit' : 'register' })">
        {{ getUserIsRegistered ? getUserInfo.user : $t('Home.Header.button.signUp') }}
      </material-button>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

import { IS_TESTNET } from '@/constant';
import LanguageSwitch from '~/components/LanguageSwitch';
import MaterialButton from '~/components/MaterialButton';
import PlatformIconBar from '~/components/PlatformIconBar';

export default {
  name: 'site-header',
  components: {
    LanguageSwitch,
    MaterialButton,
    PlatformIconBar,
  },
  data() {
    return {
      isTest: IS_TESTNET,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/index";

#site-header {

  .navigation-menu {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 48px 8px;

    @media (max-width: 768px) {
      flex-direction: column;
      padding: 12px 0;
    }
  }

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

    @media (max-width: 768px) {
      display: none;
    }
  }

  .icons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .account-btn {
    position: absolute;
    z-index: 2;
    right: 8px;
    bottom: -16px;

    width: 188px;

    font-size: 18px;

    > :global(.md-ripple) {
      padding: 0;
    }
  }
}
</style>
