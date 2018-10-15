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

    <md-button @click="prevTab">Prev</md-button>
    <md-button @click="nextTab">Next</md-button>

    <div
      :style="contentStyle"
      class="auth-dialog__content"
    >
      <div
        ref="tabContainer"
        :style="tabContainerStyle"
        class="auth-dialog__tab-container"
      >

        <div class="auth-dialog__tab">
          <div class="lc-dialog-container-1">
            <sign-in-form @sign="signWithPlaform" />
          </div>
        </div>

        <div
          v-if="platform === 'email' && !email"
          class="auth-dialog__tab"
        >
          <sign-in-with-email-form @submit="signInWithEmail" />
        </div>

        <div class="auth-dialog__tab">
          <register-form
            :is-show-email="!email"
            @register="register"
          />
        </div>

      </div>
    </div>

  </base-dialog>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import {
  apiLoginUser,
  apiPostNewUser,
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

export default {
  name: 'auth-dialog',
  components: {
    BaseDialog,
    SignInForm,
    SignInWithEmailForm,
    RegisterForm,
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    header: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentTabIndex: 0,
      contentStyle: {},

      signInPayload: {},
      platform: '',
      isEmailSignIn: false,
    };
  },
  computed: {
    ...mapGetters([
      'getIsShowAuthDialog',
      'getCurrentLocale',
    ]),
    tabContainerStyle() {
      const translateXPercent = Math.max(this.currentTabIndex, 0) * -100;
      return {
        transform: `translateX(${translateXPercent}%)`,
      };
    },
  },
  watch: {
    currentTabIndex(index) {
      this.setContentStyle(index);
    },
  },
  async mounted() {
    // Hack to recompute contentStyle
    this.setContentStyle(this.currentTabIndex);

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
    ]),
    setContentStyle(index) {
      const style = {};

      if (this.$refs.tabContainer) {
        // Explicitly set height for height transition
        const childNode = this.$refs.tabContainer.childNodes[index];
        style.height = `${childNode.offsetHeight}px`;
      }

      this.contentStyle = style;
    },
    nextTab() {
      const max = this.$refs.tabContainer.childNodes.length - 1;
      this.currentTabIndex = Math.min(this.currentTabIndex + 1, max);
    },
    prevTab() {
      this.currentTabIndex = Math.max(this.currentTabIndex - 1, 0);
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
        this.currentTabIndex = 1;
      } else if (platform === 'wallet') {
        // TODO
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
        this.currentTabIndex = 1;
      }
    },
    async register(payload) {
      const combinedPayload = {
        ...payload,
        ...this.signInPayload,
        locale: this.getCurrentLocale,
      };

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

    transition: height 0.25s ease;
    will-change: height;
  }

  &__tab-container {
    position: relative;

    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;

    transition: transform 0.25s ease;
    will-change: transform;
  }

  &__tab {
    flex: 1 0 100%;

    width: 100%;
  }
}
</style>
