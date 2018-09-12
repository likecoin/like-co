<template>
  <div
    id="home-header"
    class="with-sliding-menu"
  >

    <div class="home-header__navigation">
      <div class="home-header__navigation--left">
        <site-title isColorLogo />
        <span
          v-if="getLikeCoinUsdNumericPrice"
          class="home-header__like-rate bold"
        >USD{{ usdPriceStr }} / LIKE</span>
      </div>

      <menu-button />
    </div>

    <div class="lc-container-3 lc-tablet-hide">
      <div class="home-header__account-btn-wrapper">
        <md-button
          v-bind="getTestAttribute('registerButton')"
          class="md-likecoin shadow"
          @click="onSignUpClick"
        >{{ getButtonText }}</md-button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import MenuButton from '~/components/SlidingMenu/MenuButton';
import SiteTitle from '~/components/SiteTitle';

import getTestAttribute from '@/util/test';

export default {
  name: 'site-header',
  components: {
    MenuButton,
    SiteTitle,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getUserNeedAuth',
      'getLikeCoinUsdNumericPrice',
    ]),
    usdPriceStr() {
      return this.getLikeCoinUsdNumericPrice.toFixed(4);
    },
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t(this.getUserNeedAuth ? 'Home.Header.button.signIn' : 'Home.Header.button.signUp');
    },
  },
  methods: {
    ...mapActions([
      'showLoginWindow',
    ]),
    onSignUpClick() {
      if (this.getUserIsRegistered) {
        this.$router.push({ name: 'in' });
      } else if (this.getUserNeedAuth) {
        if (this.$route.name === 'index') {
          this.$router.push({ name: 'in' });
        } else {
          this.showLoginWindow();
        }
      } else {
        let ref = '';
        if (this.$route.name === 'index') {
          ref = 'in';
        }
        this.$router.push({
          name: 'in-register',
          query: { ...this.$route.query, ref },
        });
      }
    },
    getTestAttribute: getTestAttribute('homeHeader'),
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/variables";

.home-header {
  &__navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 12px 8px;

    @media (max-width: 768px) {
      padding: 12px;
    }

    &--left {
      display: flex;
      align-items: center;
      justify-content: space-between;

      width: 66.6%;
      padding-left: 40px;
    }
  }

  &__account-btn-wrapper {
    position: absolute;
    z-index: 1;
    right: 0;
    bottom: 0;

    transform: translateY(50%);

    .md-button {
      min-width: 188px;
      height: 36px;
      margin: 0;

      font-size: 18px;

      :global(.md-ripple) {
        min-height: 36px;
      }
    }
  }
}
</style>
