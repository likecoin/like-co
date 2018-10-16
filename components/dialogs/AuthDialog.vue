<template>
  <base-dialog
    :is-show="getIsShowAuthDialog"
    :md-props="{
      mdClickOutsideToClose: true,
      mdCloseOnEsc: true,
      mdFullscreen: false,
      mdClosed: onClosed,
      mdClickOutside: onClosed,
    }"
    class="auth-dialog"
    is-content-gapless
    @update:isShow="setIsShow"
  >

    <div
      :style="contentStyle"
      class="auth-dialog__content"
    >
      <transition-group
        tag="div"
        class="auth-dialog__tab-container"
        name="auth-dialog__tab-"
        appear
        appear-class="auth-dialog__tab--appear"
        @enter="setContentHeight"
      >

        <div
          v-if="currentTab === 'portal'"
          ref="portal"
          key="portal"
          class="auth-dialog__tab auth-dialog__tab--index"
        >
          <signin-portal @submit="signInWithPlatform" />
        </div>

        <div
          v-else-if="currentTab === 'loading'"
          ref="loading"
          key="loading"
          class="auth-dialog__tab lc-padding-vertical-64"
        >
          <div class="lc-dialog-container-1">
            <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-text-align-center">
              {{ $t('AuthDialog.label.loading') }}
            </h1>
          </div>
        </div>

        <div
          v-else-if="currentTab === 'email'"
          ref="email"
          key="email"
          :class="[
            'auth-dialog__tab lc-padding-vertical-16',
            {
              'auth-dialog__tab--index': currentTab === 'checkInbox',
            },
          ]"
        >
          <email-signin-form
            @submit="signInWithEmail"
            @cancel="currentTab = 'portal'"
          />
        </div>

        <div
          v-else-if="currentTab === 'register'"
          ref="register"
          key="register"
          class="auth-dialog__tab lc-padding-vertical-16"
        >
          <register-form
            :is-show-email="!email"
            @register="register"
          />
        </div>

        <div
          v-else-if="currentTab === 'signingIn'"
          ref="signingIn"
          key="signingIn"
          class="auth-dialog__tab lc-padding-vertical-64"
        >
          <div class="lc-dialog-container-1">
            <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-text-align-center">
              {{ $t('AuthDialog.label.signingIn') }}
            </h1>
          </div>
        </div>

        <div
          v-else-if="currentTab === 'signInError'"
          ref="signInError"
          key="signInError"
          class="auth-dialog__tab lc-padding-vertical-16"
        >
          <div class="lc-dialog-container-1">
            {{ $t('AuthDialog.label.signInError') }}
          </div>

          <div class="lc-dialog-container-1 lc-button-group">
            <md-button
              class="md-likecoin"
              @click="setIsShow(false)"
            >
              {{ $t('General.button.confirm') }}
            </md-button>
          </div>
        </div>

        <div
          v-else-if="currentTab === 'checkInbox'"
          ref="checkInbox"
          key="checkInbox"
          class="auth-dialog__tab lc-padding-vertical-16"
        >
          <div class="lc-dialog-container-1">
            <h1 class="lc-font-size-32 lc-margin-bottom-8">
              {{ $t('AuthDialog.label.checkInbox') }}
            </h1>
            <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32">
              {{ $t('AuthDialog.label.checkInboxDescription', { email }) }}
            </p>
          </div>
          <div class="lc-dialog-container-1 lc-button-group">
            <md-button
              class="md-likecoin"
              @click="setIsShow(false)"
            >
              {{ $t('General.button.ok') }}
            </md-button>
          </div>
        </div>

      </transition-group>

    </div>

  </base-dialog>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import {
  apiLoginUser,
  apiPostNewUser,
  apiCheckIsUser,
} from '@/util/api/api';

import {
  firebasePlatformSignIn,
  firebaseSendSignInEmail,
  firebaseIsSignInEmailLink,
  firebaseHandleSignInEmailLink,
} from '~/util/FirebaseApp';

import BaseDialog from '~/components/dialogs/BaseDialog';
import SigninPortal from './AuthDialogContent/SignInPortal';
import EmailSigninForm from './AuthDialogContent/SignInWithEmail';
import RegisterForm from './AuthDialogContent/Register';
import EthMixin from '~/components/EthMixin';

import User from '@/util/User';

export default {
  name: 'auth-dialog',
  components: {
    BaseDialog,
    SigninPortal,
    EmailSigninForm,
    RegisterForm,
  },
  mixins: [EthMixin],
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentTab: 'portal',
      contentStyle: {},

      signInPayload: {},
      platform: '',
      email: '',
      isEmailSignIn: false,
    };
  },
  computed: {
    ...mapGetters([
      'getIsShowAuthDialog',
      'getCurrentLocale',
      'getMetamaskError',
      'getUserInfo',
      'getLocalWallet',
    ]),
  },
  watch: {
    getIsShowAuthDialog(isShow) {
      if (isShow) {
        this.$nextTick(this.setContentHeight);

        this.currentTab = 'portal';
      }
    },
    getUserInfo() {
      if (this.getIsShowAuthDialog && this.getUserInfo.user) {
        this.redirectToUserPage();
      }
    },
  },
  async mounted() {
    this.setContentHeight();

    // Remove show_login in query
    if (this.$route.query.show_login === 'true') {
      this.setIsShow(true);
      const query = { ...this.$route.query };
      delete query.show_login;
      this.$router.replace({ path: this.$route.path, query });
    }

    // Check whether it is email sign in
    if (firebaseIsSignInEmailLink()) {
      this.currentTab = 'signingIn';
      this.setIsShow(true);

      const result = await firebaseHandleSignInEmailLink();

      if (result && result.firebaseIdToken && result.email) {
        this.platform = 'email';
        this.email = result.email;
        this.signInPayload = {
          email: result.email,
          firebaseIdToken: result.firebaseIdToken,
          platform: 'email',
          locale: this.getCurrentLocale,
        };
        this.login();
      } else {
        this.currentTab = 'signInError';
      }
    }
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
      'setUserNeedAuth',
      'refreshUser',
      'showLoginWindow',
    ]),
    setContentHeight() {
      const elem = this.$refs[this.currentTab];
      if (elem) {
        this.contentStyle = {
          height: `${elem.offsetHeight}px`,
        };
      }
    },
    onConfirm() {
      this.setIsShow(false);
      this.$emit('confirm');
      this.onClosed();
    },
    onCancel() {
      this.setIsShow(false);
      this.$emit('cancel');
      this.onClosed();
    },
    onClosed() {
      this.$emit('closed');
    },
    setIsShow(isShow) {
      this.setAuthDialog({ isShow });
    },
    async signInWithPlatform(platform) {
      this.platform = platform;

      switch (platform) {
        case 'email':
          this.currentTab = 'email';
          break;

        case 'wallet':
          this.currentTab = 'loading';
          this.startWeb3AndCb(this.signInWithWallet);
          break;

        default: {
          this.signInPayload = await firebasePlatformSignIn(platform);
          this.login();
        }
      }
    },
    async signInWithEmail(email) {
      this.email = email;
      this.currentTab = 'loading';
      await firebaseSendSignInEmail(email);
      this.currentTab = 'checkInbox';
    },
    async login() {
      this.currentTab = 'signingIn';
      try {
        await apiLoginUser({
          locale: this.getCurrentLocale,
          platform: this.platform,
          ...this.signInPayload,
        });
        this.setUserNeedAuth(false);
        this.redirectToUserPage();
      } catch (err) {
        console.error(err);
        // TODO: Check error
        // Assume it is 404
        this.currentTab = 'register';
      }
    },
    async register(registerPayload) {
      this.currentTab = 'loading';

      let payload = {
        locale: this.getCurrentLocale,
        platform: this.platform,
        ...this.signInPayload,
        ...registerPayload,
      };

      // Request user to sign when using wallet to sign in
      if (payload.wallet) {
        payload = await User.formatAndSignUserInfo(
          payload,
          this.$t('Sign.Message.registerUser'),
        );
      }

      this.currentTab = 'signingIn';
      try {
        await apiPostNewUser(payload);
        this.setUserNeedAuth(false);
        this.redirectToUserPage();
      } catch (err) {
        console.error(err);
        this.currentTab = 'signInError';
      }
    },
    async redirectToUserPage() {
      this.currentTab = 'loading';
      await this.refreshUser();
      this.setIsShow(false);
      this.$router.push({ name: 'in' });
    },
    async signInWithWallet() {
      this.currentTab = 'signingIn';

      // Determine whether the wallet has registered
      try {
        await apiCheckIsUser(this.getLocalWallet);
      } catch (err) {
        // Assume it is 404
        // Redirect user to register
        this.signInPayload = {
          wallet: this.getLocalWallet,
        };
        this.currentTab = 'register';
        return;
      }

      try {
        this.signInPayload = await User.signLogin(this.getLocalWallet);
        this.login();
      } catch (err) {
        // Return to login portal if user denied signing
        this.currentTab = 'portal';
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';

.lc-dialog {
  :global(.lc-dialog-header::before) {
    background: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  }
}

.auth-dialog {
  &__content {
    overflow: hidden;

    transition: height 1s ease;
    will-change: height;
  }

  &__tab-container {
    position: relative;
  }

  &__tab {
    position: absolute;

    width: 100%;

    transition-timing-function: ease;
    transition-duration: 1s;
    transition-property: opacity, transform;
    will-change: opacity, transform;

    &-- {
      &appear,
      &enter,
      &leave-to {
        opacity: 0;
      }

      &appear {
        transform: translateY(25%) scaleY(1.2);
      }

      &enter {
        transform: scale(1.1) translateY(50%);
      }

      &enter#{&}index {
        transform: scale(0.8);
      }

      &leave-to {
        transform: scale(0.8) translateY(50%);
      }
    }
  }
}
</style>
