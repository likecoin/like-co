<template>
  <div
    id="site-header"
    class="with-sliding-menu"
  >

    <div class="navigation-menu">

      <site-title />

      <menu-button />

    </div>

    <div
      v-if="isShowAccountButton"
      class="lc-container-3 lc-tablet-hide"
    >
      <div class="account-btn-wrapper">
        <material-button
          v-if="!shouldHideRegister"
          :hasShadow="true"
          className="account-btn"
          @click="onSignUpClick"
        >
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
import SiteTitle from '~/components/SiteTitle';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'site-header',
  components: {
    MaterialButton,
    MenuButton,
    SiteTitle,
  },
  props: {
    isShowAccountButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t('Home.Header.button.signIn');
    },
    shouldHideRegister() {
      return (
        (!this.getUserIsRegistered && this.$route.name === 'in-register')
        || this.$route.name === 'in'
      );
    },
    ...mapGetters([
      'getUserInfo',
      'getUserIsRegistered',
    ]),
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
    ]),
    onSignUpClick() {
      if (this.getUserIsRegistered) {
        this.$router.push({ name: 'in' });
      } else {
        logTrackerEvent(this, 'RegFlow', 'ClickHeaderSignIn', 'ClickHeaderSignIn', 1);
        this.setAuthDialog({ isShow: true, isSignIn: true });
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

    padding: 40px 8px;

    @media (max-width: 768px) {
      padding: 12px;
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
    }
  }
}
</style>
