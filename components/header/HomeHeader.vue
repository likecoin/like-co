<template>
  <div
    id="home-header"
    class="with-sliding-menu"
  >

    <div class="home-header__navigation">
      <div class="home-header__navigation--left">
        <site-title :logoSrc="likeCoinColorIcon" />
        <span
          v-if="getLikeCoinUsdNumericPrice"
          class="home-header__like-rate bold lc-margin-top-4"
        >USD{{ usdPriceStr }} / LIKE</span>
      </div>

      <menu-button />
    </div>

    <div class="lc-container-3 lc-tablet-hide">
      <div class="home-header__account-btn-wrapper">
        <md-button
          v-bind="getTestAttribute('registerButton')"
          class="md-likecoin shadow"
          @click="onSignInClick"
        >{{ getButtonText }}</md-button>
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import MenuButton from '~/components/SlidingMenu/MenuButton';
import SiteTitle from '~/components/SiteTitle';

import likeCoinColorIcon from '@/assets/logo/color-icon-label-horizontal.svg';

import getTestAttribute from '@/util/test';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'site-header',
  components: {
    MenuButton,
    SiteTitle,
  },
  data() {
    return {
      likeCoinColorIcon,
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
      'getLikeCoinUsdNumericPrice',
    ]),
    usdPriceStr() {
      return this.getLikeCoinUsdNumericPrice.toFixed(4);
    },
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t('Home.Header.button.signIn');
    },
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
    ]),
    onSignInClick() {
      if (this.getUserIsRegistered) {
        this.$router.push({ name: 'in' });
      } else {
        logTrackerEvent(this, 'RegFlow', 'ClickHeaderSignIn', 'ClickHeaderSignIn', 1);
        this.setAuthDialog({ isShow: true, isSignIn: true });
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

      /deep/ .md-ripple {
        min-height: 36px;
      }
    }
  }
}
</style>
