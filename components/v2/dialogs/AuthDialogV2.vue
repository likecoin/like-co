<template>
  <div class="root-classes">
    <BaseDialogV3
      ref="dialog"
      v-bind="$testID('AuthDialog')"
      :is-show="shouldShowDialog"
      :is-show-backdrop="isOverlay"
      :is-closable="false"
      :is-show-close-button="shouldShowDialogCloseButton"
      @click-close-button="onClickDialogCloseButton"
    >
      <Transition
        name="fade"
        mode="out-in"
      >
        <RegisterForm
          v-if="currentTab === 'register'"
          key="register"
          @check-liker-id="onCheckLikerId"
          @register="register"
        />
        <RegisterForm
          v-else-if="currentTab === 'await-email-verify' || currentTab === 'welcome'"
          :key="`register-${currentTab}`"
          :initial-step="currentTab === 'welcome' ? 'completed' : 'await-email-verify'"
          :user-info="getUserInfo"
          @upload-avatar="uploadAvatar"
          @complete="redirectAfterSignIn"
        />
        <div
          v-else
          key="general"
        >
          <!-- header -->
          <Transition
            name="fade"
            mode="out-in"
          >
            <div
              :key="headerText"
              class="header"
            >
              <div class="header-icon">
                <sign-in />
              </div>
              <div class="header-text">{{ headerText }}</div>
            </div>
          </Transition>
          <Transition
            name="fade"
            mode="out-in"
          >
            <div
              v-if="currentTab === 'error'"
              key="error"
              class="content-container"
            >{{ errorMessage }}</div>

            <div
              v-else-if="loadingI18nPath"
              :key="loadingI18nPath"
            >
              <i18n
                class="content-container"
                :path="loadingI18nPath"
                tag="div"
              >
                <span
                  class="app-name"
                  place="appName"
                >Liker Land app</span>
              </i18n>
              <div
                v-if="isShowRetrySignInWithWalletConnectButton"
                class="wallet-connect-retry-button-wrapper"
              >
                <Button
                  @click="retrySignInWithWalletConnect"
                >
                  <i18n
                    path="V2_WalletConnectQRCodeModal_Mobile_Button_Text"
                    tag="span"
                  >
                    <span
                      class="app-name"
                      place="appName"
                    >Liker Land app</span>
                  </i18n>
                </Button>
                <div
                  class="wallet-connect-retry-button-hint"
                >{{ $t('V2_WalletConnectQRCodeModal_Mobile_Button_Hint_Text') }}</div>
              </div>
            </div>

            <WalletConnectQRCodeView
              v-else-if="getWalletConnectURI"
              key="wallet-connect"
              :value="getWalletConnectURI"
            />
            <!-- main -->
            <div
              v-else
              key="portal"
              class="content-container"
            >
              <template v-if="!checkIsMobileClient">
                <!-- keplr -->
                <div
                  class="auth-btn"
                  @click="onClickUseKeplrButton"
                >
                  <div class="title-wapper">
                    <div class="icon">
                      <keplr-icon />
                    </div>
                    <div class="name">
                      {{ $t("DialogV2.type.keplr.name") }}
                    </div>
                  </div>
                  <div class="description">
                    {{ $t("DialogV2.type.keplr.description") }}
                  </div>
                </div>
                <!-- dropdown-toggle -->
                <div
                  :class="{
                    'dropdown-toggle': true,
                    'dropdown-toggle--toggled': isShowMoreLoginOptions,
                  }"
                  @click="isShowMoreLoginOptions = !isShowMoreLoginOptions"
                >
                  <div class="text">{{ $t("DialogV2.dropdown") }}</div>
                  <div class="icon"><arrow-down /></div>
                </div>
              </template>
              <!-- liker land -->
              <Transition
                name="slide"
                mode="out-in"
              >
                <div v-show="isShowMoreLoginOptions">
                  <div
                    class="auth-btn"
                    @click="onClickUseWalletConnectButton"
                  >
                    <div class="title-wapper">
                      <div class="icon">
                        <liker-land />
                      </div>
                      <div class="name">
                        {{ $t("DialogV2.type.likerLand.name") }}
                      </div>
                    </div>
                    <div class="description">
                      {{ $t("DialogV2.type.likerLand.description") }}
                    </div>
                  </div>
                </div>
              </Transition>
              <div class="legacy-content-container">
                <div
                  class="text toggle-frontend-mode-button"
                  @click="toggleFrontendMode"
                >
                  {{ $t('AuthDialog_toggle_frontend_mode_button') }}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </BaseDialogV3>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';

import {
  checkIsMobileClient,
  tryPostLoginRedirect,
  toggleFrontendMode,
} from '~/util/client';

import { apiCheckLikerId } from '@/util/api/api';

import KeplrIcon from '~/components/icons/Keplr';
import LikerLand from '~/components/icons/LikerLand';
import SignIn from '~/components/icons/SignIn';
import ArrowDown from '~/components/icons/ArrowDown';

import Button from '../Button';
import RegisterForm from '../RegisterForm';
import BaseDialogV3 from './BaseDialogV3';

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

export default {
  name: 'auth-dialog',
  components: {
    Button,
    BaseDialogV3,
    SignIn,
    KeplrIcon,
    LikerLand,
    ArrowDown,
    RegisterForm,
    WalletConnectQRCodeView: () => import('../WalletConnectQRCodeView'),
  },
  props: {
    isOverlay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isShowMoreLoginOptions: checkIsMobileClient(),

      // Please also set in reset()
      currentTab: 'loading',
      registerStep: 'create-liker-id',
      referrer: '',
      sourceURL: '',
      platform: '',
      errorCode: '',
      error: '',

      isShowRetrySignInWithWalletConnectButton: false,

      signInPayload: {
        user: '',
        email: '',
        isEmailVerified: false,
      },
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsShowAuthDialog',
      'getWalletConnectConnecting',
      'getUserMinInfoById',
      'getCurrentLocale',
      'getWalletConnectURI',
    ]),
    checkIsMobileClient,
    shouldShowDialog() {
      return this.getIsShowAuthDialog;
    },
    shouldShowDialogCloseButton() {
      return !!this.getWalletConnectURI || this.currentTab === 'error';
    },
    utmSource() {
      return this.$route.query.utm_source;
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
    headerText() {
      if (this.currentTab === 'error') {
        return this.errorTitle;
      }
      if (this.getWalletConnectURI) {
        return this.$t('V2_WalletConnectQRCodeModal_Title');
      }
      return this.$t('DialogV2.title.signIn');
    },
    loadingI18nPath() {
      if (
        !this.getWalletConnectConnecting
        && !['loading', 'registering', 'signing-in'].includes(this.currentTab)
      ) {
        return '';
      }
      if (this.getWalletConnectConnecting) {
        return this.$t('V2_AuthDialog_WalletConnect_Loading', {
          appName: 'Liker Land app',
        });
      }
      if (this.currentTab === 'registering') {
        return this.$t('V2_AuthDialog_Registering');
      }
      if (this.currentTab === 'signing-in') {
        return this.$t('V2_AuthDialog_SigningIn');
      }
      return this.$t('V2_AuthDialog_Loading');
    },
  },
  async mounted() {
    const { redirect_sign_in: isRedirectSignIn } = this.$route.query;
    if (isRedirectSignIn) {
      await this.handleRedirectSignIn();
    } else {
      this.currentTab = 'portal';
    }

    const { from, referrer, legacy } = this.$route.query;
    if (from) this.referrer = from;
    this.sourceURL = referrer || document.referrer;
    try {
      if (window.sessionStorage) {
        // store data when first view page
        // restore data when it is lost. eg redirect sign in
        if (this.sourceURL && shouldWriteURLIntoSession(this.sourceURL)) {
          window.sessionStorage.setItem(
            'registerDialogSourceURL',
            this.sourceURL,
          );
        } else {
          this.sourceURL = window.sessionStorage.getItem(
            'registerDialogSourceURL',
          );
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    if (legacy) {
      this.$router.replace({
        name: this.$route.name,
        query: { ...this.$route.query, legacy: undefined },
      });
      toggleFrontendMode();
    }
  },
  methods: {
    ...mapActions([
      'newUser',
      'loginUser',
      'updateUserAvatar',
      'doPostAuthRedirect',
      'loginByCosmosWallet',
      'resetLoginByCosmosWallet',
      'setAuthDialogShow',
      'setAuthCoreToken',
      'fetchAuthCoreUser',
      'fetchAuthCoreAccessTokenAndUser',
    ]),

    toggleFrontendMode() {
      logTrackerEvent(this, 'RegFlow', 'ToggleFrontendMode', 'FrontendModeLegacy', 1);
      toggleFrontendMode();
    },

    reset() {
      this.registerStep = 'create-liker-id';
      this.referrer = '';
      this.sourceURL = '';
      this.platform = '';
      this.errorCode = '';
      this.error = '';

      this.signInPayload = {
        user: '',
        email: '',
        isEmailVerified: false,
      };

      this.resetLoginByCosmosWallet();
    },

    setError(code, error) {
      this.currentTab = 'error';
      this.errorCode = code;
      this.error = error;
    },

    onClickUseKeplrButton() {
      this.signInWithPlatform('likeWallet', { source: 'keplr' });
    },
    onClickUseWalletConnectButton() {
      this.signInWithPlatform('likeWallet', { source: 'walletconnect' });
    },
    onClickDialogCloseButton() {
      if (this.currentTab === 'error') {
        this.currentTab = 'portal';
        this.errorCode = '';
        this.error = '';
      } else if (this.getWalletConnectURI) {
        this.resetLoginByCosmosWallet();
      }
    },

    logRegisterEvent(...args) {
      /* TODO: implement conditional log on !this.isSignIn */
      return logTrackerEvent(...args);
    },

    async signInWithPlatform(platform, opt = {}) {
      this.platform = platform;
      this.logRegisterEvent(
        this,
        'RegFlow',
        'LoginTry',
        `LoginTry(${platform})`,
        1,
      );

      switch (platform) {
        case 'likeWallet':
        case 'cosmosWallet': {
          const { source } = opt;
          this.signInWithCosmosWallet(source);
          return;
        }
        default: {
          // eslint-disable-next-line no-console
          console.error('platform default not exist');
          this.currentTab = 'error';
        }
      }
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

    async signInWithCosmosWallet(
      source = 'keplr',
      { isRetry = false } = {},
    ) {
      this.isShowRetrySignInWithWalletConnectButton = false;
      try {
        const { platform, payload } = await this.loginByCosmosWallet({
          source,
          isRetry,
        });
        // HACK: platform might change according to prefix
        this.platform = platform;
        this.signInPayload = payload;
        this.login();
      } catch (err) {
        if (err.message === 'WALLETCONNECT_LOGIN_TIMEOUT') {
          this.isShowRetrySignInWithWalletConnectButton = true;
        } else if (err.message !== 'Request rejected') {
          this.resetLoginByCosmosWallet();
          console.error(err);
          this.setError(err.message, err);
        }
      }
    },

    async retrySignInWithWalletConnect() {
      this.signInWithCosmosWallet('walletconnect', { isRetry: true });
      window.location.href = 'com.oice://';
    },
    async login() {
      this.currentTab = 'signing-in';
      try {
        this.logRegisterEvent(
          this,
          'RegFlow',
          'OAuthSuccess',
          `OAuthSuccess(${this.platform})`,
          1,
        );
        const payload = {};
        if (this.sourceURL) payload.sourceURL = this.sourceURL;
        if (this.utmSource) payload.utmSource = this.utmSource;
        await this.loginUser({
          locale: this.getCurrentLocale,
          platform: this.platform,
          ...this.signInPayload,
          ...payload,
        });
        this.logRegisterEvent(
          this,
          'RegFlow',
          'LoginSuccessWhenRegister',
          'LoginSuccessWhenRegister',
          1,
        );
        this.redirectAfterSignIn();
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            if (this.isSignIn) {
              logTrackerEvent(
                this,
                'RegFlow',
                'LoginRedirectToRegister',
                'LoginRedirectToRegister',
                1,
              );
            }
            this.currentTab = 'register';
            return;
          }
        }
        this.logRegisterEvent(this, 'RegFlow', 'LoginFail', 'LoginFail', 1);
        // eslint-disable-next-line no-console
        console.error(err);
        this.setError((err.response || {}).data, err);
      }
    },

    async onCheckLikerId(likerId, check) {
      try {
        await apiCheckLikerId(likerId);
        check();
      } catch (error) {
        check((error.response.data || {}).error || error.statusText);
      }
    },

    async register(registerPayload) {
      this.currentTab = 'registering';

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
        logTrackerEvent(
          this,
          'RegFlow',
          'RegistrationComplete',
          `RegistrationComplete(${this.platform})`,
          1,
        );
        if (payload.email) {
          this.currentTab = 'await-email-verify';
        } else {
          this.currentTab = 'welcome';
        }
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
          }
        } else {
          // eslint-disable-next-line no-console
          console.error(err);
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

    async uploadAvatar(avatarFile) {
      if (!avatarFile) return;
      try {
        await this.updateUserAvatar({ avatarFile });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },

    async redirectAfterSignIn() {
      this.currentTab = 'loading';
      try {
        window.sessionStorage.removeItem('registerDialogSourceURL');
      } catch (err) {
        // no op
      }
      if (!this.isOverlay) {
        this.currentTab = 'loading';
        this.$nextTick(() => {
          if (!tryPostLoginRedirect({ route: this.$route })) {
            // Normal case
            this.redirectToPreAuthPage();
          }
        });
      } else {
        this.$nextTick(() => { this.redirectToPreAuthPage(); });
      }
      if (this.isOverlay) {
        this.setAuthDialogShow(false);
      }
    },

    redirectToPreAuthPage() {
      const router = this.$router;
      const route = this.$route;
      this.doPostAuthRedirect({ router, route });
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
        const { code } = this.$route.query;
        const payload = await this.fetchAuthCoreAccessTokenAndUser(code);
        await this.signInWithAuthCore(payload);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        this.setError(err.code, err);
      }
      this.$router.replace({
        name: this.$route.name,
        query,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.root-classes {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.content-container {
  position: relative;

  max-width: 420px;

  color: #4a4a4a;
}

.header {
  display: flex;
  flex-wrap: nowrap;

  margin-bottom: 12px;
  .header-icon {
    margin-right: 12px;
  }
  .header-text {
    color: #28646e;

    font-size: 16px;
    font-weight: 600;

    line-height: 20px;
  }
}

.app-name {
  color: #28646e;
}

.auth-btn {
  display: block;

  margin: 12px 0px;


  padding: 24px;

  cursor: pointer;

  transition: all 0.2s;

  border: 4px solid #ebebeb;
  border-radius: 16px;

  &:hover {
    border-color: #50e3c2;
    background-color: #d7ecec;
  }
  :hover > .name {
    color: #28646e;
  }
  .title-wapper {
    display: flex;
    align-items: center;
    justify-content: start;

    margin-bottom: 8px;
    .icon {
      margin-right: 12px;
    }
    .name {
      font-size: 20px;
      font-weight: 600;

      line-height: 28px;
    }
  }
  .description {
    font-size: 16px;
    font-weight: 500;
  }
}

.slide-enter-active {
  transition: all 0.2s ease;
}
.slide-enter {
  height: 0px;

  opacity: 0;
}

.dropdown-toggle {
  display: flex;

  align-items: center;

  justify-content: center;

  width: 100%;

  cursor: pointer;

  &--toggled .icon {
    transform: rotateZ(180deg);
  }

  .text {
    margin-right: 8px;

    font-size: 14px;
    font-weight: 600;
  }

  .icon {
    transition: transform 0.2s ease;
  }
}
.toggle-frontend-mode-button {
  margin-top: 12px;

  cursor: pointer;
}

.legacy-content-container {
  margin-top: 12px;

  text-align: center;

  color: #9b9b9b;

  .text {
    text-decoration: underline;
  }
}

.wallet-connect-retry-button-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;

  margin-top: 16px;
}

.wallet-connect-retry-button-hint {
  margin-top: 8px;

  text-align: center;

  color: #9b9b9b;

  font-size: 12px;
}
</style>
