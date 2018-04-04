<template>
  <div id="site-header" class="with-sliding-menu">

    <div class="navigation-menu">

      <nuxt-link :class="['title', { test: isTest }]" :to="{ name: 'index' }">
        {{ $t('Store.Header.label.store') }}
        <span class="sup">
          {{ isTest ? $t('Store.Header.label.test') : '' }}
        </span>
      </nuxt-link>

      <menu-button />

    </div>

    <div v-if="isShowAccountButton" class="lc-container-3 lc-tablet-hide">
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

import MaterialButton from '~/components/MaterialButton';
import MenuButton from '~/components/SlidingMenu/MenuButton';

import { IS_TESTNET } from '@/constant';

export default {
  name: 'site-header',
  props: [
    'isShowAccountButton',
    'showLogin',
  ],
  components: {
    MaterialButton,
    MenuButton,
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
      justify-content: flex-end;
      padding: 12px;
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
