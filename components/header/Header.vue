<template>
  <div id="site-header">
    <div class="navigation-menu">
      <site-title />
      <div class="icons">
        <platform-icon-bar />
        <language-switch class="lc-mobile-hide" />
      </div>
    </div>
    <div class="lc-container-3 lc-mobile-hide">
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

import LanguageSwitch from '~/components/LanguageSwitch';
import MaterialButton from '~/components/MaterialButton';
import PlatformIconBar from '~/components/PlatformIconBar';
import SiteTitle from '~/components/SiteTitle';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'site-header',
  components: {
    LanguageSwitch,
    MaterialButton,
    PlatformIconBar,
    SiteTitle,
  },
  computed: {
    getButtonText() {
      if (this.getUserIsRegistered) return this.getUserInfo.user;
      return this.$t('Home.Header.button.signIn');
    },
    shouldHideRegister() {
      return (
        (!this.getUserIsRegistered && ['in-register', 'in-redeem'].includes(this.$route.name))
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

    padding: 48px 8px;

    @media (max-width: 768px) {
      flex-direction: column;

      padding: 12px 0;
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
