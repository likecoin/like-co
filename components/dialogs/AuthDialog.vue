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
    @update:isShow="setIsShow"
  >

    <div
      :style="contentStyle"
      class="auth-dialog__content"
    >
      <transition-group
        tag="div"
        class="auth-dialog__tab-container"
        name="auth-dialog__tab--"
        mode="out-in"
        appear
        appear-class="auth-dialog__tab--appear"
        @enter="setContentHeight"
      >
        <div
          v-if="currentTab === 'sign'"
          ref="signElem"
          key="sign"
          class="auth-dialog__tab"
        >
          <div class="lc-dialog-container-1">
            <sign-in-form @sign="signWithPlaform" />
          </div>
        </div>

        <div
          v-else-if="currentTab === 'email'"
          ref="emailElem"
          key="signWithEmail"
          class="auth-dialog__tab"
        >
          <sign-in-with-email-form @submit="signInWithEmail" />
        </div>

        <div
          v-else-if="currentTab === 'register'"
          ref="registerElem"
          key="register"
          class="auth-dialog__tab"
        >
          <register-form
            :is-show-email="!email"
            @register="register"
          />
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
import SignInForm from './AuthDialogContent/SignIn';
import SignInWithEmailForm from './AuthDialogContent/SignInWithEmail';
import RegisterForm from './AuthDialogContent/Register';
import EthMixin from '~/components/EthMixin';

import User from '@/util/User';

export default {
  name: 'auth-dialog',
  components: {
    BaseDialog,
    SignInForm,
    SignInWithEmailForm,
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
      currentTab: 'sign',
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

        this.currentTab = 'sign';
      }
    },
    getUserInfo() {
      if (this.getIsShowAuthDialog && this.getUserInfo.user) {
        this.redirectToUserPage();
      }
    },
  },
  async mounted() {
    // Hack to recompute contentStyle
    this.setContentHeight();

    if (this.$route.query.show_login === 'true') {
      this.setIsShow(true);
      const query = { ...this.$route.query };
      delete query.show_login;
      this.$router.replace({ path: this.$route.path, query });
    }

    if (firebaseIsSignInEmailLink()) {
      this.setIsShow(true);
      // Show login status
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
        this.login(this.signInPayload);
      }
    }
  },
  methods: {
    ...mapActions([
      'setAuthDialog',
      'refreshUser',
      'showLoginWindow',
    ]),
    setContentHeight() {
      const elem = this.$refs[`${this.currentTab}Elem`];
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
    async signWithPlaform(platform) {
      this.platform = platform;
      if (platform === 'email') {
        this.currentTab = 'email';
      } else if (platform === 'wallet') {
        this.startWeb3AndCb(this.handleWalletSignIn);
      } else {
        const {
          accessToken,
          firebaseIdToken,
          secret,
        } = await firebasePlatformSignIn(platform);

        this.signInPayload = {
          accessToken,
          firebaseIdToken,
          secret,
          platform,
          locale: this.getCurrentLocale,
        };

        this.login(this.signInPayload);
      }
    },
    async signInWithEmail(email) {
      this.email = email;
      await firebaseSendSignInEmail(email);
      // TODO: Notify user to check email
    },
    async login(payload) {
      try {
        await apiLoginUser(payload);
        this.redirectToUserPage();
      } catch (err) {
        console.error(err);
        // TODO: Check error
        // Assume it is 404
        this.currentTab = 'register';
      }
    },
    async register(payload) {
      let combinedPayload = {
        ...payload,
        ...this.signInPayload,
        locale: this.getCurrentLocale,
      };

      if (combinedPayload.wallet) {
        combinedPayload = await User.formatAndSignUserInfo(combinedPayload, this.$t('Sign.Message.registerUser'));
      }

      try {
        await apiPostNewUser(combinedPayload);
        this.redirectToUserPage();
      } catch (err) {
        console.error(err);
        // TODO: Error handling
      }
    },
    async redirectToUserPage() {
      this.setIsShow(false);
      await this.refreshUser();
      this.$router.push({ name: 'in' });
    },
    async handleWalletSignIn() {
      try {
        await apiCheckIsUser(this.getLocalWallet);
        await this.showLoginWindow();
      } catch (err) {
        // Assume it is 404
        // prepare for wallet register
        this.signInPayload = {
          wallet: this.getLocalWallet,
        };
        this.currentTab = 'register';
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
        transform: translateX(50%);
      }
      &leave-to {
        transform: translateX(-50%);
      }
    }
  }
}
</style>
