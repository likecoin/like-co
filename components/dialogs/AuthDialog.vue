<template>
  <BaseDialogV2
    ref="dialog"
    v-bind="$testID('AuthDialog')"
    :class="{
      'auth-dialog': true,
      'auth-dialog--blocking': isBlocking,
    }"
    :is-show="shouldShowDialog"
    :is-show-backdrop="!isSinglePage"
    :is-show-header="shouldShowHeader"
    :is-closable="!isSinglePage"
    @update:isShow="onUpdateIsShow"
    @click-outside="onClosed"
  >

    <div
      v-if="!isBlocking || isSinglePage"
      slot="header-left"
      class="auth-dialog__header-left"
    >
      <a @click="onClickBackButton">{{ $t('General.back') }}</a>
    </div>

    <div
      slot="header-center"
      class="auth-dialog__header-center"
    >
      <div class="auth-dialog__logo">
        <lc-avatar
          v-if="avatar"
          :src="avatar"
          :halo="avatarHalo"
          size="large"
          is-full-width
        />
        <template v-else>
          <img :src="LikeCoinLogo">
        </template>
      </div>
      <i18n
        v-if="avatar && fromDisplayName"
        class="auth-dialog__support-creator"
        path="AuthDialog.supportCreator"
        tag="div"
      >
        <span
          class="lc-color-like-green"
          place="name"
        >{{ fromDisplayName }}</span>
      </i18n>
    </div>

    <div
      :style="contentStyle"
      :class="[
        'auth-dialog__content',
        {
          'auth-dialog__content--with-avatar': !!avatar,
        }
      ]"
    >
      <div class="auth-dialog__tab-container">
        <Transition
          :css="false"
          :mode="tabTransitionMode"
          appear
          @leave="onTabLeave"
          @before-enter="onTabBeforeEnter"
          @enter="onTabEnter"
        >

          <div
            v-if="currentTab === 'portal'"
            v-bind="tabProps"
            class="auth-dialog__tab auth-dialog__tab--index auth-dialog__tab--portal"
          >
            <signin-portal
              class="base-dialog-v2__corner-block"
              :is-sign-in="isSignIn"
              :is-show-close-button="closable"
              :avatar="avatar"
              @toggle-sign-in="onToggleSignIn"
              @close="setIsShow(false)"
              @submit="signInWithPlatform"
            />
          </div>

          <div
            v-else-if="currentTab === 'loading'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-64"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-text-align-center lc-mobile">
                {{ $t('AuthDialog.label.loading') }}
              </h1>
            </div>
          </div>

          <!--<div
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
              :is-re-enter="errorCode === 'FIREBASE_EMAIL_LINK_AUTH_NO_EMAIL'"
              @submit="signInWithEmail"
              @cancel="currentTab = 'portal'"
            />
          </div>
          -->

          <div
            v-else-if="currentTab === 'register'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-16"
          >
            <register-form
              :prefilled-data="signInPayload"
              :is-edit-email="isEmailEditable"
              :platform="platform"
              @register="register"
            />
          </div>

          <div
            v-else-if="currentTab === 'signingIn'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-64"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-text-align-center lc-mobile">
                {{ $t('AuthDialog.label.signingIn') }}
              </h1>
            </div>
          </div>

          <div
            v-else-if="currentTab === 'error'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-16"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-16 lc-mobile">
                {{ errorTitle }}
              </h1>
              <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32">
                {{ errorMessage }}
              </p>

              <!-- Suggest legacy user to login with wallet -->
              <i18n
                v-if="errorMessageForLegacyUser"
                :path="errorMessageForLegacyUser"
                class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32"
                tag="p"
              >
                <span
                  class="lc-color-like-green"
                  place="id"
                >{{ signInPayload.user }}</span>
                <span
                  class="lc-color-like-green"
                  place="email"
                >{{ signInPayload.email }}</span>
                <a
                  class="lc-color-light-burgundy lc-underline"
                  place="signIn"
                  @click="onClickSignWithWalletInError"
                >{{ $t('AuthDialog.Register.signWithWallet') }}</a>
              </i18n>

            </div>

            <div class="lc-dialog-container-1 lc-button-group">
              <md-button
                class="md-likecoin"
                @click="onDismissError"
              >
                {{ errorConfirmTitle }}
              </md-button>
            </div>
          </div>

          <div
            v-else-if="currentTab === 'checkInbox'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-16"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-mobile">
                {{ $t('AuthDialog.label.checkInbox') }}
              </h1>
              <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32">
                {{ $t('AuthDialog.label.checkInboxDescription', {email: signInPayload.email }) }}
              </p>
            </div>
            <div class="lc-dialog-container-1 lc-button-group">
              <md-button
                class="md-likecoin"
                @click="close"
              >
                {{ $t('General.button.ok') }}
              </md-button>
            </div>
          </div>

          <div
            v-else-if="currentTab === 'loginSuccessful'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-64"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-text-align-center lc-mobile">
                {{ $t('AuthDialog.label.loginSuccessful') }}
              </h1>
            </div>
          </div>

          <div
            v-else-if="currentTab.split('-')[0] === 'loginFailure'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-top-16 lc-padding-bottom-24"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-8 lc-mobile">
                {{ $t('AuthDialog.Failure.SignIn.header') }}
              </h1>
              <p class="lc-font-size-16 lc-color-like-gray-4 lc-margin-bottom-32">
                {{ $t('AuthDialog.Failure.SignIn.message') }}
              </p>
            </div>
            <div class="lc-dialog-container-1 lc-button-group">
              <md-button
                class="md-likecoin"
                @click="signInWithPlatform(currentTab.split('-')[1], { isAllowRedirect: false })"
              >
                {{ $t('AuthDialog.Failure.SignIn.confirm') }}
              </md-button><br><a
                class="lc-color-light-burgundy lc-underline"
                @click="currentTab = 'portal'"
              >
                {{ $t('AuthDialog.Failure.SignIn.cancel') }}
              </a>
            </div>
          </div>

        </Transition>
      </div>
    </div>

  </BaseDialogV2>
</template>


<script>
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import { mapActions, mapGetters } from 'vuex';
import { ResizeObserver } from 'resize-observer';

import {
  MIN_USER_ID_LENGTH,
  MAX_USER_ID_LENGTH,
  LOGIN_CONNECTION_LIST,
} from '@/constant';

import {
  getAuthPlatformSignInURL,
  getAuthPlatformSignInPayload,
} from '@/util/auth';

import {
  apiLoginUser,
  apiCheckIsUser,
  apiGetUserMinById,
} from '@/util/api/api';

import {
  isFirebasePlatform,
  firebasePlatformSignIn,
  firebaseGetRedirectCredential,
  firebaseSendSignInEmail,
  firebaseIsSignInEmailLink,
  firebaseHandleSignInEmailLink,
  getSignInPayloadFromSignInResult,
  getPlatformFromProviderId,
} from '~/util/FirebaseApp';

import { checkUserNameValid } from '@/util/ValidationHelper';

import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';
import SigninPortal from './AuthDialogContent/SignInPortal';
// import EmailSigninForm from './AuthDialogContent/SignInWithEmail';
import RegisterForm from './AuthDialogContent/Register';
import EthMixin from '~/components/EthMixin';

import User from '@/util/User';

import LikeCoinLogo from '~/assets/logo/icon-plain.svg';

import { logTrackerEvent, logTimingEvent } from '@/util/EventLogger';
import {
  checkIsMobileClient,
  tryPostLoginRedirect,
} from '~/util/client';

function getRandomPaddedDigits(length) {
  return String(Math.floor(Math.random() * (10 ** length))).padStart(length, '0');
}

// TODO: remove this.$sentry.captureException

export default {
  name: 'auth-dialog',
  components: {
    BaseDialogV2,
    SigninPortal,
    // EmailSigninForm,
    RegisterForm,
  },
  mixins: [
    EthMixin,
  ],
  data() {
    return {
      LikeCoinLogo,

      avatar: undefined,
      avatarHalo: 'none',
      fromDisplayName: '',

      currentTab: 'loading',
      contentStyle: {},
      tabTransition: 'fade',

      platform: '',
      signInPayload: {
        user: '',
        email: '',
        isEmailVerified: false,
      },

      errorCode: '',
      error: undefined,
      isSigningInWithEmail: false,
      isSignIn: this.$route.query.login === '1',

      referrer: '',
      sourceURL: '',
      loggedEvents: {},

      hasClickSignWithWalletInError: false,
    };
  },
  computed: {
    ...mapGetters([
      'getAuthDialogStatus',
      'getIsShowAuthDialog',
      'getCurrentLocale',
      'getMetamaskError',
      'getLocalWallet',
      'getUserMinInfoById',
    ]),
    closable() {
      return !(this.isBlocking || this.isSinglePage);
    },
    isSinglePage() {
      return this.$route.name === 'in-register';
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
    isEmailEditable() {
      return (
        !(this.signInPayload.isEmailVerified && this.signInPayload.email)
        && this.platform !== 'email'
      );
    },
    shouldShowHeader() {
      return this.currentTab !== 'portal';
    },
    tabKey() {
      if (this.currentTab === 'portal') {
        return `${this.currentTab}${this.isSignIn ? '-signin' : ''}`;
      }
      return this.currentTab;
    },
    tabProps() {
      return {
        ref: 'tab',
        key: this.tabKey,
      };
    },
    tabTransitionMode() {
      switch (this.tabTransition) {
        case 'flip':
          return 'out-in';

        case 'fade':
        default:
          return undefined;
      }
    },
    errorTitle() {
      switch (this.errorCode) {
        case 'USER_ALREADY_EXIST':
        case 'EMAIL_ALREADY_USED':
        case 'USER_WALLET_INVALID':
          return this.$t('AuthDialog.Register.error');
        default:
          return this.$t('General.label.error');
      }
    },
    errorMessage() {
      if (this.errorCode && this.$i18n.te(`Error.${this.errorCode}`, 'en')) {
        return this.$t(`Error.${this.errorCode}`);
      }
      if (this.error && typeof this.error.toString === 'function') {
        this.$t('AuthDialog.label.signInErrorWithDetails', {
          details: this.error.toString(),
        });
      }
      return this.$t('AuthDialog.label.signInError');
    },
    errorMessageForLegacyUser() {
      switch (this.errorCode) {
        case 'USER_ALREADY_EXIST':
        case 'EMAIL_ALREADY_USED':
        case 'USER_WALLET_INVALID':
          return `AuthDialog.Register.suggestWalletSignIn.${
            this.errorCode === 'EMAIL_ALREADY_USED' ? 'email' : 'id'
          }`;
        default:
          return '';
      }
    },
    errorConfirmTitle() {
      switch (this.errorCode) {
        case 'USER_ALREADY_EXIST':
        case 'EMAIL_ALREADY_USED':
        case 'USER_WALLET_INVALID':
          return this.$t('General.retry');
        default:
          return this.$t('General.button.confirm');
      }
    },
  },
  watch: {
    getAuthDialogStatus: {
      handler({ isShow, isSignIn }) {
        if (isShow) {
          // Reset current tab to portal then update the content height
          if (!this.isSigningInWithEmail) {
            this.currentTab = 'portal';
          }

          const { redirect_sign_in: isRedirectSignIn } = this.$route.query;
          if (isRedirectSignIn) {
            this.currentTab = 'signingIn';
          }

          this.$nextTick(this.updateContentHeightForCurrentTab);
        }
        if (isSignIn !== this.isSignIn && !isSignIn && !this.loggedEvents.swapRegisterTab) {
          this.loggedEvents.swapRegisterTab = 1;
          logTrackerEvent(this, 'RegFlow', 'SwapToRegisterTab', 'SwapToRegisterTab', 1);
        }
        this.isSignIn = isSignIn;

        // Sync dialog display with query string if not in single page
        if (!this.isSinglePage) {
          const query = { ...this.$route.query };
          if (isShow) {
            // Add show_login=1 in query string
            query.show_login = '1';
            if (isSignIn) {
              query.login = '1';
            } else {
              delete query.login;
            }
          } else {
            // Remove show_login and login in query string
            delete query.show_login;
            delete query.login;
          }
          this.$router.replace({ path: this.$route.path, query });
        }
        this.logShowAuthDialog(isShow);
      },
      deep: true,
    },
    currentTab(tab) {
      if (tab === 'register' && !this.loggedEvents.register) {
        this.loggedEvents.register = 1;
        logTrackerEvent(this, 'RegFlow', 'ShowRegisterForm', 'ShowRegisterForm', 1);
      }

      this.$nextTick(this.updateResizeObserverForCurrentTab);
    },
    tabKey(key, prevKey) {
      let transition = 'fade';
      if (
        (key === 'portal' && prevKey === 'portal-signin')
        || (prevKey === 'portal' && key === 'portal-signin')
      ) {
        transition = 'flip';
      }
      this.tabTransition = transition;
    },
    shouldShowDialog(value) {
      if (value) {
        this.$nextTick(this.updateResizeObserverForCurrentTab);
      }
    },
  },
  async mounted() {
    this.currentTab = 'portal';

    this.loggedEvents = {};

    const { from } = this.$route.query;
    if (from) {
      try {
        if (!this.getUserMinInfoById(from)) {
          await this.fetchUserMinInfo(from);
        }
        const userInfo = this.getUserMinInfoById(from);
        this.avatar = userInfo.avatar;
        this.fromDisplayName = userInfo.displayName;
        this.avatarHalo = User.getAvatarHaloType(userInfo);
      } catch (err) {
        // noop
      }
    }

    // Listen to onClickReturnButton event of MetaMaskDialog
    this.$root.$on('MetaMaskDialog.onClickReturnButton', () => {
      this.stopWeb3Polling();
      this.currentTab = 'portal';
    });

    // Initialize content height
    this.updateContentHeightForCurrentTab();

    // Show dialog when show_login set to true in query string
    if (this.$route.query.show_login === '1') {
      this.setAuthDialog({
        isShow: true,
        isSignIn: this.$route.query.login === '1',
      });
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
          this.errorCode = 'FIREBASE_EMAIL_LINK_AUTH_NO_EMAIL';
        } else {
          // eslint-disable-next-line no-console
          console.error(err);
          if (this.$sentry) this.$sentry.captureException(err);
          this.setError(err.code, err);
          this.isSigningInWithEmail = false;
        }
      }
    }

    // Handle redirect sign in
    const {
      redirect_sign_in: isRedirectSignIn,
      sign_in_platform: signInPlatform,
      ...query
    } = this.$route.query;
    if (isRedirectSignIn) {
      this.logRegisterEvent(this, 'RegFlow', 'LoginRedirectDone', 'LoginRedirectDone', 1);
      this.currentTab = 'signingIn';

      try {
        if (!signInPlatform || isFirebasePlatform(signInPlatform)) {
          const result = await firebaseGetRedirectCredential();
          if (result.credential) {
            this.platform = getPlatformFromProviderId(result.credential.providerId);
            this.signInPayload = await getSignInPayloadFromSignInResult(result);
            this.login();
          } else {
            // eslint-disable-next-line no-console
            console.error('No credential after redirect');
            if (this.$sentry) {
              this.$sentry.captureException(new Error('No credential after redirect'));
            }

            // If redirect sign in is not working, suggest user to try again with popup
            if (signInPlatform) {
              this.currentTab = `loginFailure-${signInPlatform}`;
            } else {
              this.currentTab = 'portal';
            }
          }
        } else if (signInPlatform) {
          const { code, state } = this.$route.query;
          this.platform = signInPlatform;
          this.signInPayload = await getAuthPlatformSignInPayload(signInPlatform, { code, state });
          if (this.signInPayload) this.login();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        this.setError(err.code, err);
        if (this.$sentry) this.$sentry.captureException(err);
      }
      this.$router.replace({
        name: this.$route.name,
        query,
      });
    } else {
      this.logShowAuthDialog(this.getIsShowAuthDialog);
    }

    const { referrer } = this.$route.query;
    if (from) this.referrer = from;
    this.sourceURL = referrer || document.referrer;
    try {
      if (window.sessionStorage) {
        // store data when first view page
        // restore data when it is lost. eg redirect sign in
        if (this.sourceURL) {
          window.sessionStorage.setItem('registerDialogSourceURL', this.sourceURL);
        } else {
          this.sourceURL = window.sessionStorage.getItem('registerDialogSourceURL');
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }

    this.contentResizeObserver = new ResizeObserver(this.onObservingContentResize);
    this.updateResizeObserverForCurrentTab();
  },
  beforeDestroy() {
    if (this.contentResizeObserver) {
      this.contentResizeObserver.disconnect();
    }
  },
  methods: {
    ...mapActions([
      'newUser',
      'refreshUser',
      'fetchUserMinInfo',
      'doPostAuthRedirect',
      'setAuthDialog',
      'setAuthDialogShow',
      'toggleAuthDialogIsSignIn',
      'setWalletNoticeDialog',
      'openPopupDialog',
    ]),
    setContentStyle({ height }) {
      const style = {
        height: `${height}px`,
      };
      if (!this.shouldShowHeader) {
        style.marginTop = 0;
      }
      this.contentStyle = style;
    },
    updateContentHeightForCurrentTab() {
      const elem = this.$refs.tab;
      if (elem) this.setContentStyle({ height: elem.offsetHeight });
    },
    updateResizeObserverForCurrentTab() {
      if (!this.contentResizeObserver) return;
      this.contentResizeObserver.disconnect();
      const elem = this.$refs.tab;
      if (elem) this.contentResizeObserver.observe(elem, { box: 'border-box' });
    },
    setError(code, error) {
      this.currentTab = 'error';
      this.errorCode = code;
      this.error = error;
    },

    getDialogContentContainerElem() {
      if (
        this.$refs.dialog
        && this.$refs.dialog.$el
        && typeof this.$refs.dialog.$el.querySelector === 'function'
      ) {
        return this.$refs.dialog.$el.querySelector('.base-dialog-v2__content-container');
      }
      return undefined;
    },
    getTabTransitionEffectAndTarget(el) {
      let target = el;
      let effect = this.tabTransition;
      if (effect === 'flip') {
        const containerEl = this.getDialogContentContainerElem();
        if (containerEl) {
          target = containerEl;
        } else {
          effect = 'fade';
        }
      }
      return { effect, target };
    },
    onTabLeave(el, onComplete) {
      const { effect, target } = this.getTabTransitionEffectAndTarget(el);
      switch (effect) {
        case 'flip': {
          this.$gsap.TweenLite.to(target, 0.5, {
            rotationY: 90,
            z: 500,
            ease: 'easeInPower2',
            onComplete,
          });
          break;
        }

        case 'fade':
        default:
          this.$gsap.TweenLite.to(target, 1, {
            opacity: 0,
            onComplete,
          });
          break;
      }
    },
    onTabBeforeEnter(el) {
      const { effect, target } = this.getTabTransitionEffectAndTarget(el);
      switch (effect) {
        case 'flip':
          this.$gsap.TweenLite.set(target, {
            visibility: 'hidden',
            z: 500,
            rotationY: -90,
          });
          break;
        case 'fade':
        default:
          this.$gsap.TweenLite.set(target, {
            visibility: 'hidden',
            opacity: 0,
          });
          break;
      }
    },
    onTabEnter(el, onComplete) {
      const { effect, target } = this.getTabTransitionEffectAndTarget(el);
      switch (effect) {
        case 'flip': {
          this.$gsap.TweenLite.to(target, 1, {
            rotationY: 0,
            z: 0,
            visibility: 'visible',
            ease: 'easeOutPower2',
            onComplete,
          });
          break;
        }

        case 'fade':
        default:
          this.$gsap.TweenLite.to(target, 1, {
            opacity: 1,
            visibility: 'visible',
          }, {
            onComplete,
          });
          break;
      }
      this.updateContentHeightForCurrentTab();
    },
    onClickSignWithWalletInError() {
      this.hasClickSignWithWalletInError = true;
      this.signInWithPlatform('wallet');
    },
    onDismissError() {
      switch (this.errorCode) {
        case 'USER_AUTH_EMAIL_LINK_INVALID':
          // Allow user to re-enter email if the provided email is not match
          this.currentTab = 'email';
          this.errorCode = 'FIREBASE_EMAIL_LINK_AUTH_NO_EMAIL';
          return;

        case 'USER_REGISTER_ERROR':
        case 'EMAIL_ALREADY_USED':
        case 'USER_ALREADY_EXIST':
        case 'USER_WALLET_INVALID':
          this.currentTab = 'register';
          return;

        default:
      }
      this.close();
    },
    onUpdateIsShow(isShow) {
      if (!this.shouldHideDialog && isShow !== this.getIsShowAuthDialog) {
        this.setIsShow(isShow);
      }
      if (!isShow && this.errorCode === 'FIREBASE_EMAIL_LINK_AUTH_NO_EMAIL') {
        // Do not retain the step if user closes dialog during re-enter email
        this.currentTab = 'portal';
        this.errorCode = '';
      }
    },
    onObservingContentResize(entries) {
      entries.forEach((entry) => {
        const { height } = entry.contentRect;
        this.setContentStyle({ height });
      });
    },
    onClickBackButton() {
      switch (this.currentTab) {
        case 'portal':
          if (this.isSinglePage) {
            if (window.opener) {
              window.close();
            } else {
              this.$router.go(-1);
            }
          } else {
            this.onCancel();
          }
          break;

        default:
          this.currentTab = 'portal';
          break;
      }
    },
    onToggleSignIn() {
      this.toggleAuthDialogIsSignIn();
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
      this.setAuthDialogShow(isShow);
    },
    close() {
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
    async signInWithPlatform(platform, options = { isAllowRedirect: true }) {
      this.platform = platform;
      this.logRegisterEvent(this, 'RegFlow', 'LoginTry', `LoginTry(${platform})`, 1);

      switch (platform) {
        case 'email':
          this.currentTab = 'email';
          return;

        case 'wallet':
          this.currentTab = 'loading';
          this.setWalletNoticeDialog({
            isShow: true,
            cancelTitle: this.$t('WalletNoticeDialog.allSignInOptions'),
            onCancel: () => {
              this.currentTab = 'portal';
            },
            onConfirm: () => this.startWeb3AndCb(this.signInWithWallet),
          });
          return;

        case 'google':
        case 'twitter':
        case 'facebook':
          this.currentTab = 'loading';
          try {
            // Determine Firebase sign in method
            const isRedirect = options.isAllowRedirect && (
              this.$route.query.is_popup === '1'
              || checkIsMobileClient()
              || !!window.opener
            );
            if (isRedirect) {
              this.logRegisterEvent(this, 'RegFlow', 'LoginRedirect', `LoginRedirect(${platform})`, 1);
              this.$router.replace({
                name: this.$route.name,
                query: {
                  ...this.$route.query,
                  redirect_sign_in: 1,
                  sign_in_platform: platform,
                },
              });
            }
            this.signInPayload = await firebasePlatformSignIn(platform, {
              isRedirect,
            });
            if (!isRedirect) this.login();
            return;
          } catch (err) {
            switch (err.code) {
              case 'auth/popup-closed-by-user':
                this.currentTab = 'portal';
                break;

              case 'auth/web-storage-unsupported':
                this.setError('USER_AUTH_THRID_PARTY_COOKIE_BLOCKED');
                break;

              default:
                // eslint-disable-next-line no-console
                console.error(err);
                if (this.$sentry) this.$sentry.captureException(err);
                this.setError(err.code, err);
                break;
            }
          }
          break;
        default: {
          if (LOGIN_CONNECTION_LIST.includes(platform)) {
            const { url } = await getAuthPlatformSignInURL(platform);
            if (url) window.location.href = url;
            break;
          }
          // eslint-disable-next-line no-console
          console.error('platform default not exist');
          if (this.$sentry) {
            this.$sentry.captureException(new Error('platform default not exist'));
          }
          this.currentTab = 'error';
        }
      }
    },
    async signInWithEmail(email) {
      this.currentTab = 'loading';

      if (this.isSigningInWithEmail) {
        try {
          this.signInPayload = await firebaseHandleSignInEmailLink(email);
          this.isSigningInWithEmail = false;
          this.login();
        } catch (err) {
          let code;
          if (err.code === 'auth/invalid-action-code' || err.code === 'auth/invalid-email') {
            code = 'USER_AUTH_EMAIL_LINK_INVALID';
          } else {
            // eslint-disable-next-line no-console
            console.error(err);
            if (this.$sentry) this.$sentry.captureException(err);
            this.isSigningInWithEmail = false;
          }
          this.setError(code, err);
        }
      } else {
        await firebaseSendSignInEmail(email, {
          referrer: this.referrer,
          sourceURL: this.sourceURL,
        });
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

        // eslint-disable-next-line no-console
        console.error(err);
        if (this.$sentry) this.$sentry.captureException(err);
        this.setError((err.response || {}).data, err);
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
          // eslint-disable-next-line no-console
          console.error(err);
          if (this.$sentry) this.$sentry.captureException(err);
          this.setError(err.message, err);
        }
      }
    },
    async login() {
      this.currentTab = 'signingIn';
      try {
        this.logRegisterEvent(this, 'RegFlow', 'OAuthSuccess', `OAuthSuccess(${this.platform})`, 1);
        await apiLoginUser({
          locale: this.getCurrentLocale,
          platform: this.platform,
          ...this.signInPayload,
        });
        this.logRegisterEvent(this, 'RegFlow', 'LoginSuccessWhenRegister', 'LoginSuccessWhenRegister', 1);
        this.redirectAfterSignIn();
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            if (this.isSignIn) logTrackerEvent(this, 'RegFlow', 'LoginRedirectToRegister', 'LoginRedirectToRegister', 1);
            this.preRegister();
            return;
          }
        }
        this.logRegisterEvent(this, 'RegFlow', 'LoginFail', 'LoginFail', 1);
        // eslint-disable-next-line no-console
        console.error(err);
        if (this.$sentry) this.$sentry.captureException(err);
        this.setError((err.response || {}).data, err);
      }
    },
    async preRegister() {
      logTrackerEvent(this, 'RegFlow', 'PreRegister', `PreRegister(${this.platform})`, 1);
      this.currentTab = 'loading';
      if (this.signInPayload.suggestedName || this.signInPayload.email) {
        const RANDOM_DIGIT_LENGTH = 5;
        const MAX_SUGGEST_TRY = 5;
        let { suggestedName } = this.signInPayload;
        if (!suggestedName) {
          [suggestedName] = this.signInPayload.email.split('@');
        }
        suggestedName = suggestedName.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
        suggestedName = suggestedName.substring(0, MAX_USER_ID_LENGTH - RANDOM_DIGIT_LENGTH);
        let isIDAvailable = false;
        let tries = 0;
        let tryName = suggestedName;
        if (suggestedName.length < MIN_USER_ID_LENGTH) {
          tryName = `${suggestedName}${getRandomPaddedDigits(RANDOM_DIGIT_LENGTH)}`;
        }
        while (!isIDAvailable && tries < MAX_SUGGEST_TRY) {
          try {
            await apiGetUserMinById(tryName); // eslint-disable-line no-await-in-loop
          } catch (err) {
            if (err.response) {
              if (err.response.status === 404) {
                isIDAvailable = true;
                break;
              }
            }
          }
          tryName = `${suggestedName}${getRandomPaddedDigits(RANDOM_DIGIT_LENGTH)}`;
          tries += 1;
        }
        if (isIDAvailable && tryName && checkUserNameValid(tryName)) {
          Vue.set(this.signInPayload, 'defaultLikeCoinId', tryName);
        }
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
      this.signInPayload = payload;

      // Request user to sign when using wallet to sign in
      if (payload.wallet) {
        payload = await User.formatAndSignUserInfo(
          payload,
          this.$t('Sign.Message.registerUser'),
        );
      }
      if (this.referrer) payload.referrer = this.referrer;
      if (this.sourceURL) payload.sourceURL = this.sourceURL;

      this.currentTab = 'signingIn';
      try {
        await this.newUser(payload);
        logTrackerEvent(
          this,
          'RegFlow',
          'RegistrationComplete',
          `RegistrationComplete(${this.platform})`,
          1,
        );
        this.redirectAfterSignIn();
      } catch (err) {
        let errCode;
        if (err.response && err.response.data) {
          switch (err.response.data) {
            case 'USER_ALREADY_EXIST':
            case 'EMAIL_ALREADY_USED':
            case 'USER_WALLET_INVALID':
            case 'FIREBASE_USER_DUPLICATED':
              errCode = err.response.data;
              break;

            default:
              // eslint-disable-next-line no-console
              console.error(err);
              if (this.$sentry) this.$sentry.captureException(err);
          }
        } else {
          // eslint-disable-next-line no-console
          console.error(err);
          if (this.$sentry) this.$sentry.captureException(err);
          errCode = 'USER_REGISTER_ERROR';
        }
        this.setError(errCode, err);
        logTrackerEvent(
          this,
          'RegFlow',
          'RegistrationFail',
          `RegistrationFail(${this.platform})`,
          1,
        );
      }
    },
    async redirectAfterSignIn() {
      this.currentTab = 'loading';
      await this.refreshUser();

      this.setIsShow(false);
      if (this.isSinglePage) {
        this.currentTab = 'loginSuccessful';
        this.$nextTick(() => {
          if (!tryPostLoginRedirect({ route: this.$route })) {
            // Normal case
            this.redirectToPreAuthPage();
          }
        });
      } else {
        this.$nextTick(() => { this.redirectToPreAuthPage(); });
      }
    },
    redirectToPreAuthPage() {
      const router = this.$router;
      const route = this.$route;
      this.doPostAuthRedirect({ router, route });

      // Remind a suspect legacy user to bind OAuth login
      if (this.hasClickSignWithWalletInError) {
        this.openPopupDialog({
          allowClose: true,
          header: this.$t('AuthDialog.Failure.BindSocialAccounts.header'),
          message: this.$t('AuthDialog.Failure.BindSocialAccounts.message'),
          cancelText: this.$t('General.button.cancel'),
          confirmText: this.$t('AuthDialog.Failure.BindSocialAccounts.confirm'),
          onConfirm: () => {
            this.$router.push({
              name: 'in-settings',
              hash: '#connect',
            });
          },
        });
      }
      // Reset register failure count
      this.hasClickSignWithWalletInError = false;
    },
    logRegisterEvent(...args) {
      if (!this.isSignIn) logTrackerEvent(...args);
    },
    logShowAuthDialog(isShow) {
      if (isShow && !this.loggedEvents.showAuthDialog) {
        let value = 1;
        if (window.performance) {
          value = Math.round(performance.now());
        }
        logTimingEvent(this, 'RegFlow', 'AuthDialogMountedTiming', 'AuthDialogMountedTiming', value);
        this.loggedEvents.showAuthDialog = 1;
        this.logRegisterEvent(this, 'RegFlow', 'ShowAuthDialog', 'ShowAuthDialog', 1);
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import '~assets/variables';
@import "~assets/mixin";

.lc-dialog {
  /deep/ .lc-dialog-header::before {
    background: linear-gradient(246deg, #d2f0f0, #f0e6b4);
  }
}

.auth-dialog {
  perspective: 4000px;
  perspective-origin: 50% 25%;

  /deep/ .lc-dialog-header {
    z-index: 1;
  }

  &--blocking {
    /deep/ .lc-dialog-header::before {
      @include background-image-sliding-animation-x(
        linear-gradient(to right, #ed9090, #ee6f6f 20%, #ecd7d7, #ed9090)
      );
    }
  }

  &__header-left {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    display: flex;
    align-items: center;

    padding-left: 16px;
  }

  &__header-center {
    padding-top: 16px;
  }

  &__header-right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    padding-right: 16px;
  }

  &__login-button {
    padding: 3px 26px;

    border: solid 2px $like-green;
    border-radius: 18px;
  }

  &__logo {
    position: absolute;
    top: 16px;

    width: 96px;

    transform: translateX(-50%);

    > img:nth-child(2) {
      transition: opacity 0.25s ease;
    }
  }

  &__support-creator {
    position: absolute;
    top: 120px;
    right: 0;
    left: 0;

    padding: 0 24px;

    text-align: center;

    color: $gray-9b;

    font-size: 16px;
    font-weight: 600;
  }

  &__content {
    overflow: hidden;

    margin-top: 64px;

    transition-timing-function: ease;
    transition-duration: 1s;
    transition-property: margin-top, height;

    &--with-avatar {
      margin-top: 96px;
    }
  }

  &__tab-container {
    position: relative;
  }

  &__tab {
    position: absolute;

    width: 100%;
  }
}
</style>
