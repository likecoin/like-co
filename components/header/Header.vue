<template>
  <div id="site-header">
    <div class="navigation-menu">
      <nuxt-link :class="['title', { test: isTest }]" :to="{ name: 'index' }">
        {{ $t('Store.Header.label.store') }}
        <span class="sup">
          {{ isTest ? $t('Store.Header.label.test') : '' }}
        </span>
      </nuxt-link>
      <div class="icons">
        <platform-icon-bar />
        <language-switch class="lc-mobile-hide" />
      </div>
    </div>
    <div class="lc-container-3 lc-mobile-hide">
      <div class="account-btn-wrapper">
        <material-button
          v-if="!shouldHideRegister"
          className="account-btn"
          :hasShadow="true"
          @click="onSignUpClick">
          {{ getButtonText }}
        </material-button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import { IS_TESTNET } from '@/constant';
import LanguageSwitch from '~/components/LanguageSwitch';
import MaterialButton from '~/components/MaterialButton';
import PlatformIconBar from '~/components/PlatformIconBar';

export default {
  name: 'site-header',
  props: ['showLogin'],
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
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t(this.showLogin ? 'Home.Header.button.signIn' : 'Home.Header.button.signUp');
    },
    shouldHideRegister() {
      return (
        (!this.getUserIsRegistered && ['in-register', 'in-redeem'].includes(this.$route.name))
        || this.$route.name === 'in-edit'
      );
    },
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
    ]),
    onSignUpClick() {
      if (!this.getUserIsRegistered && this.showLogin) {
        this.showLoginWindow();
      } else {
        this.$router.push({ name: this.getUserIsRegistered ? 'in-edit' : 'in-register' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

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
    text-decoration: none;

    color: $like-green;

    font-size: 18px;

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
    align-items: center;
    flex-direction: row;
  }

  .account-btn-wrapper {
    position: absolute;
    z-index: 2;
    right: 8px;
    bottom: 0;

    width: 188px;

    transform: translateY(50%);

    .account-btn {
      font-size: 18px;

      > :global(.md-ripple) {
        padding: 0;
      }
    }
  }
}
</style>
