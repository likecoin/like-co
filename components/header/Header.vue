<template>
  <div id="site-header">
    <div class="navigation-menu">
      <nuxt-link :class="['title', { test: isTest }]" :to="{ name: 'index' }">
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
        v-if="!shouldHideRegister"
        className="account-btn"
        :hasShadow="true"
        @click="onSignUpClick">
        {{ getButtonText }}
      </material-button>
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
        (!this.getUserIsRegistered && this.$route.name === 'in-register')
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
      if (this.showLogin) {
        this.showLoginWindow();
      } else {
        this.$router.push({ name: this.getUserIsRegistered ? 'edit' : 'register' });
      }
    },
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
