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
      <a
        v-if="isShowBackButton"
        @click="onClickBackButton"
      >
        {{ $t('General.back') }}
      </a>
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
      v-if="!isBlocking"
      slot="header-right"
      class="auth-dialog__header-right"
    >
      <template
        v-if="isUsingAuthCore && !isMobileClient && currentTab === 'portal'"
      >
        <a
          class="auth-dialog__wallet-login-button"
          @click="onClickUseWalletButton"
        >
          {{ $t('AuthDialog.SignIn.auth.wallet') }}
        </a>
      </template>
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
            <auth-core-register
              v-if="isUsingAuthCore"
              :is-sign-in="isSignIn"
              :language="getCurrentLocale"
              :redirect-url="getAuthCoreRedirectUrl"
              :social-login-pane-option="socialLoginPaneOption"
              @loaded="onAuthCoreLoaded"
              @loginWidgetLoaded="onAuthCoreLoginWidgetLoaded"
              @registerStarted="onAuthCoreRegisterStarted"
              @oauthStarted="onAuthCoreOAuthStarted"
              @loginStarted="onAuthCoreLoginStarted"
              @navigation="onAuthCoreNavigation"
              @success="signInWithAuthCore"
            />
          </div>

          <div
            v-if="currentTab === 'wallet-notice'"
            v-bind="tabProps"
            class="auth-dialog__tab auth-dialog__tab--index auth-dialog__tab--portal"
          >
            <div class="lc-dialog-container-1">
              <h2 class="lc-text-align-center lc-color-like-green">
                {{
                  $t(isSignIn
                    ? 'AuthDialog.SignIn.auth.wallet'
                    : 'AuthDialog.SignUp.auth.wallet'
                  )
                }}
              </h2>
              <div
                class="auth-dialog__wallet-panel"
                style="display: flex"
              >
                <svg
                  class="lc-color-like-green"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 30"
                  style="flex-shrink: 0;width: 24px;margin-right: 24px"
                >
                  <circle
                    cx="12"
                    cy="20.43"
                    r="1.5"
                    fill="currentColor"
                  />
                  <path
                    d="M12,8v8m-.3,13h0A14.6,14.6,0,0,1,1,14.93V2.9
                      L11.7,1,22.39,2.9v12A14.59,14.59,0,0,1,11.7,29Z"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                  />
                </svg>
                <div>
                  <p>{{ $t('WalletNoticeDialog.page[1].description[0]') }}</p>
                  <p class="lc-margin-bottom-0">
                    {{ $t('WalletNoticeDialog.page[1].description[1]') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="lc-dialog-container-1 lc-button-group lc-margin-vertical-32">
              <button
                class="ll-button large"
                @click="onAcceptWalletNotice"
              >
                {{ $t('General.accept') }}
              </button>
            </div>
          </div>

          <div
            v-if="currentTab === 'wallet'"
            v-bind="tabProps"
            class="auth-dialog__tab auth-dialog__tab--index auth-dialog__tab--portal"
          >
            <div class="lc-dialog-container-1 lc-margin-bottom-32">
              <h2 class="lc-text-align-center lc-color-like-green">
                {{ $t(`AuthDialog.SignInWithWallet.title`) }}
              </h2>
              <div
                :class="[
                  'auth-dialog__wallet-panel',
                  'auth-dialog__wallet-panel--portal',
                  'lc-margin-top-24',
                ]"
              >
                <img
                  src="~/assets/auth-panel/keplr.png"
                  style="width:124px"
                >
                <button
                  class="ll-button large lc-margin-top-24"
                  @click="onClickUseKeplrButton"
                >
                  {{ $t(`AuthDialog.${isSignIn ? 'SignIn' : 'SignUp'}.auth.keplr`) }}
                </button>
                <button
                  class="ll-button large lc-margin-top-24"
                  @click="onClickUseWalletConnectButton"
                >Wallet Connect</button>
              </div>
              <div
                :class="[
                  'auth-dialog__wallet-panel',
                  'auth-dialog__wallet-panel--portal',
                  'auth-dialog__wallet-panel--dashed',
                  'lc-margin-top-24',
                ]"
              >
                <simple-svg
                  :filepath="MetaMaskLogo"
                  width="148px"
                  height="28px"
                />
                <a
                  :class="[
                    'lc-margin-top-12',
                    'lc-font-size-12',
                    'lc-text-align-center',
                    'lc-color-gray-9b',
                    'lc-underline',
                  ]"
                  @click="onClickUseMetaMaskButton"
                >
                  {{ $t('AuthDialog.SignInWithWallet.legacy') }}
                </a>
              </div>
            </div>
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
            v-else-if="currentTab === 'error'"
            v-bind="tabProps"
            class="auth-dialog__tab lc-padding-vertical-16"
          >
            <div class="lc-dialog-container-1">
              <h1 class="lc-font-size-32 lc-margin-bottom-16 lc-mobile">
                {{ errorTitle }}
              </h1>
              <p class="lc-font-size-16 lc-color-like-gray-4 lc-padding-bottom-32">
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
                  place="support"
                  @click="showCSChat"
                >{{ $t('AuthDialog.Register.contactSupport') }}</a>
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
import URL from 'url-parse';

import {
  LOGIN_CONNECTION_LIST,
  EXTERNAL_URL,
} from '@/constant';

import {
  getAuthPlatformSignInURL,
  getAuthPlatformSignInPayload,
} from '@/util/auth';

import {
  apiCheckIsUser,
} from '@/util/api/api';

import AuthCoreRegister from '~/components/AuthCore/Register';
import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';
// import EmailSigninForm from './AuthDialogContent/SignInWithEmail';
import RegisterForm from './AuthDialogContent/Register';
import EthMixin from '~/components/EthMixin';

import User from '@/util/User';

import LikeCoinLogo from '~/assets/logo/icon-plain.svg';
import MetaMaskLogo from '~/assets/auth-panel/metamask.svg';

import { logTrackerEvent, logTimingEvent } from '@/util/EventLogger';
import {
  tryPostLoginRedirect,
  checkIsMobileClient,
} from '~/util/client';

function shouldWriteURLIntoSession(sourceURL) {
  if (!sourceURL) {
    return false;
  }
  try {
    const url = new URL(sourceURL);
    return url.host.split('.').slice(-2).join('.') !== 'like.co';
  } catch (err) {
    return true;
  }
}

// TODO: remove this.$sentry.captureException

export default {
  name: 'auth-dialog',
  components: {
    BaseDialogV2,
    AuthCoreRegister,
    RegisterForm,
  },
  mixins: [
    EthMixin,
  ],
  data() {
    return {
      LikeCoinLogo,
      MetaMaskLogo,

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
      isSignIn: this.$route.query.register !== '1',
      isPopup: this.$route.query.is_popup === '1',

      referrer: '',
      sourceURL: '',
      loggedEvents: {},

      hasClickSignWithWalletInError: false,
      isUsingAuthCore: true,
      isMobileClient: false,
    };
  },
  computed: {
    ...mapGetters([
      'getAuthDialogStatus',
      'getIsShowAuthDialog',
      'getCurrentLocale',
      'getMetamaskError',
      'getLocalWeb3Wallet',
      'getUserMinInfoById',
      'getAuthCoreAccessToken',
      'getUserIsAuthCore',
    ]),
    closable() {
      return !(this.isBlocking || this.isSinglePage);
    },
    isShowBackButton() {
      switch (this.currentTab) {
        case 'portal':
        case 'error':
        case 'wallet':
        case 'wallet-notice':
          return true;

        default:
          return false;
      }
    },
    isSinglePage() {
      return this.$route.name === 'in-register';
    },
    isBlocking() {
      return this.currentTab === 'loading';
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
        && this.platform !== 'authcore'
      );
    },
    shouldShowHeader() {
      return this.currentTab !== 'portal' || this.isUsingAuthCore;
    },
    tabKey() {
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
      let msg = this.$t('AuthDialog.label.signInError');
      if (this.errorCode) msg += ` - ${this.errorCode}`;
      return msg;
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
    getAuthCoreRedirectUrl() {
      let url = `${EXTERNAL_URL}/in/register?`;
      url += 'redirect_sign_in=1&sign_in_platform=authcore';
      const {
        redirect,
        is_popup: isPopup,
        utm_source: utmSource,
      } = this.$route.query;
      if (redirect) {
        url += `&redirect=${encodeURIComponent(redirect)}`;
      }
      if (isPopup !== undefined) {
        url += `&is_popup=${encodeURIComponent(isPopup)}`;
      }
      if (utmSource) {
        url += `&utm_source=${encodeURIComponent(utmSource)}`;
      }
      return url;
    },
    socialLoginPaneOption() {
      return 'grid';
    },
    utmSource() {
      return this.$route.query.utm_source;
    },
  },
  watch: {
    getAuthDialogStatus: {
      handler({ isShow, isSignIn }) {
        if (isShow) {
          this.currentTab = 'portal';

          const { redirect_sign_in: isRedirectSignIn } = this.$route.query;
          if (isRedirectSignIn) {
            this.currentTab = 'loading';
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
              delete query.register;
            } else {
              query.register = '1';
            }
          } else {
            // Remove show_login and register in query string
            delete query.show_login;
            delete query.register;
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
    shouldShowDialog(value) {
      if (value) {
        this.$nextTick(this.updateResizeObserverForCurrentTab);
      }
    },
  },
  async mounted() {
    this.isMobileClient = checkIsMobileClient();
    this.currentTab = 'portal';

    this.loggedEvents = {};

    const { from } = this.$route.query;
    if (from) {
      await this.fetchAvatar(from);
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
        isSignIn: this.$route.query.register !== '1',
      });
    }

    // Handle redirect sign in
    const {
      redirect_sign_in: isRedirectSignIn,
    } = this.$route.query;
    if (isRedirectSignIn) {
      await this.handleRedirectSignIn();
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
        if (this.sourceURL && shouldWriteURLIntoSession(this.sourceURL)) {
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
      'loginUser',
      'fetchUserMinInfo',
      'doPostAuthRedirect',
      'setAuthDialog',
      'setAuthDialogShow',
      'toggleAuthDialogIsSignIn',
      'openPopupDialog',
      'fetchAuthCoreAccessTokenAndUser',
      'fetchAuthCoreUser',
      'setAuthCoreToken',
      'initAuthCoreCosmosWallet',
      'fetchAuthCoreCosmosWallet',
      'authCoreLogoutUser',
      'loginByCosmosWallet',
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
    onDismissError() {
      switch (this.errorCode) {
        case 'USER_REGISTER_ERROR':
        case 'EMAIL_ALREADY_USED':
        case 'USER_ALREADY_EXIST':
        case 'USER_WALLET_INVALID':
          this.currentTab = 'register';
          return;

        case 'USE_AUTHCORE_LOGIN':
        case 'WALLET_REGISTER_DEPRECATED':
          this.isUsingAuthCore = true;
          this.currentTab = 'portal';
          break;
        default:
      }
      this.resetAuthCoreStatus();
      this.isUsingAuthCore = true;
      this.currentTab = 'portal';
    },
    onUpdateIsShow(isShow) {
      if (!this.shouldHideDialog && isShow !== this.getIsShowAuthDialog) {
        this.setIsShow(isShow);
      }
    },
    onObservingContentResize(entries) {
      entries.forEach((entry) => {
        const { height } = entry.contentRect;
        this.setContentStyle({ height });
      });
    },
    onAcceptWalletNotice() {
      this.currentTab = 'wallet';
    },
    onClickUseWalletButton() {
      this.isUsingAuthCore = false;
      this.currentTab = 'wallet-notice';
    },
    onClickUseKeplrButton() {
      this.signInWithPlatform('cosmosWallet', { source: 'keplr' });
    },
    onClickUseWalletConnectButton() {
      this.signInWithPlatform('cosmosWallet', { source: 'walletconnect' });
    },
    onClickUseMetaMaskButton() {
      this.signInWithPlatform('wallet');
    },
    onClickBackButton() {
      switch (this.currentTab) {
        case 'portal':
          if (this.isSinglePage) {
            if (this.isPopup) {
              window.close();
            } else {
              this.$router.go(-1);
            }
          } else {
            this.onCancel();
          }
          break;

        default:
          if (!this.isUsingAuthCore) {
            this.isUsingAuthCore = true;
          }
          this.currentTab = 'portal';
          break;
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
      this.resetAuthCoreStatus();
      this.$emit('closed');
    },
    setIsShow(isShow) {
      this.setAuthDialogShow(isShow);
    },
    close() {
      this.setIsShow(false);
      this.$nextTick(() => {
        if (this.isSinglePage) {
          if (this.isPopup) {
            window.close();
          } else {
            this.onClickBackButton();
          }
        }
      });
    },
    resetAuthCoreStatus() {
      this.isUsingAuthCore = true; // HACK: reset authcore flag
      if (this.getAuthCoreAccessToken && !this.getUserIsAuthCore) {
        this.authCoreLogoutUser();
      }
    },
    onAuthCoreLoaded() {
      this.logRegisterEvent(this, 'RegFlow', 'AuthCoreDialogLoaded', 'AuthCoreDialogLoaded', 1);
    },
    onAuthCoreLoginWidgetLoaded() {
      this.logRegisterEvent(this, 'RegFlow', 'AuthCoreLoginWidgetLoaded', 'AuthCoreLoginWidgetLoaded', 1);
    },
    onAuthCoreRegisterStarted(method) {
      this.logRegisterEvent(this, 'RegFlow', 'AuthCoreRegisterTry', `AuthCoreRegisterTry(${method})`, 1);
    },
    onAuthCoreOAuthStarted(method) {
      this.logRegisterEvent(this, 'RegFlow', 'AuthCoreRegisterTry', `AuthCoreRegisterTry(${method})`, 1);
    },
    onAuthCoreLoginStarted(method) {
      this.logRegisterEvent(this, 'RegFlow', 'AuthCoreLoginTry', `AuthCoreLoginTry(${method})`, 1);
    },
    onAuthCoreNavigation(page) {
      this.logRegisterEvent(this, 'RegFlow', `AuthCoreSwitchTo${page}`, `AuthCoreSwitchTo${page}`, 1);
      this.setAuthDialog({
        isShow: true,
        isSignIn: page === 'SignIn',
      });
    },
    async fetchAvatar(from) {
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
    },
    async handleRedirectSignIn() {
      const {
        redirect_sign_in: isRedirectSignIn,
        sign_in_platform: signInPlatform,
        ...query
      } = this.$route.query;
      this.logRegisterEvent(this, 'RegFlow', 'LoginRedirectDone', 'LoginRedirectDone', 1);
      this.currentTab = 'loading';

      try {
        if (signInPlatform) {
          if (signInPlatform === 'authcore') {
            const { code } = this.$route.query;
            const payload = await this.fetchAuthCoreAccessTokenAndUser(code);
            await this.signInWithAuthCore(payload);
          } else {
            const { code, state } = this.$route.query;
            this.platform = signInPlatform;
            this.signInPayload = await getAuthPlatformSignInPayload(
              signInPlatform,
              { code, state },
            );
            if (this.signInPayload) this.login();
          }
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
    },
    async signInWithAuthCore({ accessToken, currentUser, idToken }) {
      this.logRegisterEvent(this, 'RegFlow', 'AuthCoreSignInSuccess', 'AuthCoreSignInSuccess', 1);
      await this.setAuthCoreToken(accessToken);
      this.currentTab = 'loading';
      this.platform = 'authcore';
      let user = currentUser;
      if (!user || !user.profileName) {
        try {
          user = await this.fetchAuthCoreUser();
        } catch (err) {
          console.error(err);
        }
      }
      const {
        primaryEmail: email,
        suggestedName: username,
      } = user;
      this.signInPayload = {
        email,
        username,
        accessToken,
        idToken,
      };
      this.login();
    },
    async signInWithPlatform(platform, opt = {}) {
      this.platform = platform;
      this.logRegisterEvent(this, 'RegFlow', 'LoginTry', `LoginTry(${platform})`, 1);

      switch (platform) {
        case 'wallet': {
          this.currentTab = 'loading';
          this.startWeb3AndCb(this.signInWithWallet);
          return;
        }
        case 'cosmosWallet': {
          this.currentTab = 'loading';
          const { source } = opt;
          this.signInWithCosmosWallet(source);
          return;
        }
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
    async signInWithWallet() {
      this.currentTab = 'loading';

      // Determine whether the wallet has registered
      try {
        await apiCheckIsUser(this.getLocalWeb3Wallet);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            this.setError('WALLET_REGISTER_DEPRECATED', err);
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
        this.signInPayload = await User.signLogin(this.getLocalWeb3Wallet);
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
    async signInWithCosmosWallet(source = 'keplr') {
      this.currentTab = 'loading';
      try {
        this.signInPayload = await this.loginByCosmosWallet(source);
        this.login();
      } catch (err) {
        console.error(err);
        if (this.$sentry) this.$sentry.captureException(err);
        this.setError(err.message, err);
      }
    },
    async login() {
      this.currentTab = 'loading';
      try {
        this.logRegisterEvent(this, 'RegFlow', 'OAuthSuccess', `OAuthSuccess(${this.platform})`, 1);
        const payload = {};
        if (this.sourceURL) payload.sourceURL = this.sourceURL;
        if (this.utmSource) payload.utmSource = this.utmSource;
        await this.loginUser({
          locale: this.getCurrentLocale,
          platform: this.platform,
          ...this.signInPayload,
          ...payload,
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
        const defaultLikerID = await User.prepareSuggestedUserName(this.signInPayload);
        if (defaultLikerID) Vue.set(this.signInPayload, 'defaultLikeCoinId', defaultLikerID);
      }
      if (this.platform === 'authcore') {
        await this.initAuthCoreCosmosWallet();
        const cosmosWallet = await this.fetchAuthCoreCosmosWallet();
        Vue.set(this.signInPayload, 'cosmosWallet', cosmosWallet);
      }

      this.currentTab = 'register';
    },
    async register(registerPayload) {
      this.currentTab = 'loading';

      const payload = {
        locale: this.getCurrentLocale,
        platform: this.platform,
        ...this.signInPayload,
        ...registerPayload,
      };
      this.signInPayload = payload;
      if (this.referrer) payload.referrer = this.referrer;
      if (this.sourceURL) payload.sourceURL = this.sourceURL;
      if (this.utmSource) payload.utmSource = this.utmSource;

      try {
        await this.newUser(payload);
        if (payload.avatarFile) {
          await this.updateUserAvatar({
            avatarFile: payload.avatarFile,
          });
        }
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
      try {
        window.sessionStorage.removeItem('registerDialogSourceURL');
      } catch (err) {
        // no op
      }
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
      /* TODO: implement conditional log on !this.isSignIn */
      return logTrackerEvent(...args);
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
    showCSChat() {
      if (window.$crisp) {
        window.$crisp.push(['do', 'chat:show']);
        window.$crisp.push(['do', 'chat:open']);
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
        linear-gradient(to right, #d2f0f0, #f0e6b4 50%, #d2f0f0)
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

  &__wallet-login-button {
    display: inline-block;

    text-decoration: underline;

    color: $like-green !important;
  }

  &__wallet-panel {
    padding: 16px;

    color: $like-gray-5;
    border: 2px solid $gray-e6;
    border-radius: 16px;

    font-size: 14px;

    &--portal {
      display: flex;
      align-items: center;
      flex-direction: column;
    }

    &--dashed {
      border-style: dashed;
    }
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
