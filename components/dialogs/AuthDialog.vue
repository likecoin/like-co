<template>
  <base-dialog
    :is-show="shouldShowDialog"
    :md-props="{
      mdBackdrop: !isSinglePage,
      mdClickOutsideToClose: closable,
      mdCloseOnEsc: closable,
      mdFullscreen: false,
      mdClosed: onClosed,
      mdClickOutside: onClosed,
    }"
    :class="[
      'auth-dialog',
      {
        'auth-dialog--blocking': isBlocking,
      },
    ]"
    is-content-gapless
    @update:isShow="onUpdateIsShow"
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
            :is-show-back="!isSigningInWithEmail"
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
            :prefilled-data="signInPayload"
            :is-show-email="shouldSignUpShowEmail"
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
            <h1 class="lc-font-size-32 lc-margin-bottom-8">
              {{ $t('General.label.error') }}
            </h1>
            <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32">
              {{ $t('AuthDialog.label.signInError') }}
            </p>
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
              {{ $t('AuthDialog.label.checkInboxDescription', {email: signInPayload.email }) }}
            </p>
          </div>
          <div class="lc-dialog-container-1 lc-button-group">
            <md-button
              class="md-likecoin"
              @click="onClickCheckInbox"
            >
              {{ $t('General.button.ok') }}
            </md-button>
          </div>
        </div>

        <div
          v-else-if="currentTab === 'loginSuccessful'"
          ref="loginSuccessful"
          key="loginSuccessful"
          class="auth-dialog__tab lc-padding-vertical-64"
        >
          <div class="lc-dialog-container-1">
            <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-text-align-center">
              {{ $t('AuthDialog.label.loginSuccessful') }}
            </h1>
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
  firebase,
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

import { LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN } from '~/constant';

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

      platform: '',
      signInPayload: {
        email: '',
        isEmailVerified: false,
      },

      errorMessage: '',
      isSigningInWithEmail: false,
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
    closable() {
      return !(this.isBlocking || this.isSinglePage);
    },
    isSinglePage() {
      return this.$route.name === 'in-register-api';
    },
    isBlocking() {
      return this.currentTab === 'loading' || this.currentTab === 'signingIn';
    },
    shouldHideDialog() {
      return !!this.getMetamaskError;
    },
    shouldShowDialog() {
      return this.getIsShowAuthDialog && !this.shouldHideDialog;
    },
    shouldSignUpShowEmail() {
      return !(this.signInPayload.isEmailVerified && this.platform === 'google');
    },
  },
  watch: {
    getIsShowAuthDialog(isShow) {
      if (isShow) {
        this.$nextTick(this.setContentHeight);

        if (!this.isSigningInWithEmail) {
          this.currentTab = 'portal';
        }
      }
    },
  },
  async mounted() {
    this.$root.$on('MetaMaskDialog.onClickReturnButton', () => {
      this.stopWeb3Polling();
      this.currentTab = 'portal';
    });

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
      this.isSigningInWithEmail = true;
      this.currentTab = 'signingIn';
      this.platform = 'email';
      this.setIsShow(true);
      try {
        this.signInPayload = await firebaseHandleSignInEmailLink();
        this.login();
      } catch (err) {
        if (err.message === 'FIREBASE_EMAIL_LINK_AUTH_NO_EMAIL') {
          // User opened the link on a different device. To prevent session fixation attacks, ask
          // the user to provide the associated email again
          this.currentTab = 'email';
        } else {
          this.currentTab = 'signInError';
          this.isSigningInWithEmail = false;
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'doPostAuthRedirect',
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
    onUpdateIsShow(isShow) {
      if (!this.shouldHideDialog) {
        this.setIsShow(isShow);
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
    onClickCheckInbox() {
      this.setIsShow(false);
      this.$nextTick(() => {
        if (this.isSinglePage) {
          if (window.opener) {
            window.close();
          } else {
            this.$router.push({ name: 'index' });
          }
        }
      });
    },
    async signInWithPlatform(platform) {
      this.platform = platform;

      switch (platform) {
        case 'email':
          this.currentTab = 'email';
          return;

        case 'wallet':
          this.currentTab = 'loading';
          this.startWeb3AndCb(this.signInWithWallet);
          return;

        case 'google':
        case 'twitter':
          this.currentTab = 'loading';
          try {
            this.signInPayload = await firebasePlatformSignIn(platform);
          } catch (err) {
            switch (err.code) {
              case 'auth/popup-closed-by-user':
                this.currentTab = 'portal';
                break;

              default:
                console.error(err);
                this.currentTab = 'signInError';
                break;
            }
            return;
          }
          break;

        case 'facebook':
          try {
            this.currentTab = 'loading';
            this.signInPayload = await new Promise((resolve, reject) => {
              if (!window.FB) {
                reject(new Error('FACEBOOK_SDK_NOT_FOUND'));
              }
              window.FB.login(({ authResponse }) => {
                if (authResponse && authResponse.accessToken) {
                  const {
                    accessToken,
                    userID: platformUserId,
                  } = authResponse;

                  resolve({
                    accessToken,
                    platformUserId,
                  });
                } else {
                  reject(new Error('FACEBOOK_AUTH_REJECTED'));
                }
              }, { scope: 'public_profile,pages_show_list,user_link' });
            });

            // Link Facebook with Firebase
            const userCredential = await firebase.auth().signInAndRetrieveDataWithCredential(
              firebase
                .auth
                .FacebookAuthProvider
                .credential(this.signInPayload.accessToken),
            ).catch();
            if (userCredential && userCredential.user) {
              this.signInPayload.firebaseIdToken = await userCredential.user.getIdToken();
            }
          } catch (err) {
            this.currentTab = 'portal';
            return;
          }
          break;

        default:
      }

      this.login();
    },
    async signInWithEmail(email) {
      this.currentTab = 'loading';

      if (this.isSigningInWithEmail) {
        try {
          this.signInPayload = await firebaseHandleSignInEmailLink(email);
          this.login();
        } catch (err) {
          console.error(err);
          this.currentTab = 'signInError';
        } finally {
          this.isSigningInWithEmail = false;
        }
      } else {
        await firebaseSendSignInEmail(email);
        this.currentTab = 'checkInbox';
      }
    },
    async signInWithWallet() {
      this.currentTab = 'signingIn';

      // Determine whether the wallet has registered
      try {
        await apiCheckIsUser(this.getLocalWallet);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            this.signInPayload = {
              wallet: this.getLocalWallet,
            };
            this.currentTab = 'register';
            return;
          }
        }

        this.currentTab = 'signInError';
        return;
      }

      try {
        this.signInPayload = await User.signLogin(this.getLocalWallet);
        this.login();
      } catch (err) {
        if (err.message.indexOf('Invalid "from" address') >= 0) {
          // User has logout MetaMask after EthHelper initialization
          this.currentTab = 'loading';
          this.startWeb3AndCb(this.signInWithWallet, true);
        } else if (err.message.indexOf('User denied message signature') >= 0) {
          // Return to login portal if user denied signing
          this.currentTab = 'portal';
        } else {
          this.currentTab = 'signInError';
        }
      }
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
        if (err.response) {
          if (err.response.status === 404) {
            this.preRegister();
            return;
          }
        }
        this.currentTab = 'signInError';
      }
    },
    async preRegister() {
      this.currentTab = 'loading';
      const { platformUserId } = this.signInPayload;
      let preRegisterPayload;
      switch (this.platform) {
        case 'facebook':
          // Get user info
          preRegisterPayload = await new Promise((resolve) => {
            if (!window.FB) resolve();
            window.FB.api(
              '/me?fields=name,email',
              ({ name, email }) => {
                // Get avatar
                window.FB.api(
                  `/${platformUserId}/picture?type=large&redirect=0`,
                  ({ data }) => {
                    const payload = {
                      displayName: name,
                    };

                    if (email) {
                      payload.email = email;
                      payload.isEmailVerified = false;
                    }

                    if (data && !data.is_silhouette) {
                      payload.avatarURL = data.url;
                    }

                    resolve(payload);
                  },
                );
              },
            );
          });
          break;

        default:
      }

      if (preRegisterPayload) {
        this.signInPayload = {
          ...this.signInPayload,
          ...preRegisterPayload,
        };
      }

      this.currentTab = 'register';
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
      if (this.isSinglePage) {
        this.currentTab = 'loginSuccessful';
        this.$nextTick(() => {
          if (window.opener) {
            window.opener.postMessage({
              action: 'LOGGED_IN',
            }, LIKE_BUTTON_POST_MESSAGE_TARGET_ORIGIN);
            window.close();
          } else {
            this.$router.push({ name: 'in' });
          }
        });
      } else {
        const router = this.$router;
        this.doPostAuthRedirect({ router });
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';
@import "~assets/mixin";

.lc-dialog {
  :global(.lc-dialog-header::before) {
    background: linear-gradient(252deg, #d2f0f0, #f0e6b4);
  }
}

.auth-dialog {
  @media screen and (max-width: 600px) {
    width: 96%;
  }

  &--blocking {
      :global(.lc-dialog-header::before) {
        @include background-image-sliding-animation-x(
          linear-gradient(to right, #ed9090, #ee6f6f 20%, #ecd7d7, #ed9090)
        );
      }
  }

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
