<template>
  <div class="root-classes">
    <BaseDialogV3
      ref="dialog"
      v-bind="$testID('AuthDialog')"
      :is-show="shouldShowDialog"
      :is-show-backdrop="false"
      :is-closable="false"
    >
      <RegisterForm
        v-if="currentTab === 'register'"
        @register="register"
      />
      <RegisterForm
        v-else-if="currentTab === 'await-email-verify' || currentTab === 'welcome'"
        :initial-step="currentTab === 'welcome' ? 'await-email-verify' : 'completed'"
        :user-info="getUserInfo"
        @upload-avatar="uploadAvatar"
        @complete="redirectAfterSignIn"
      />
      <template v-else>
        <!-- header -->
        <div class="header">
          <div class="header-icon">
            <sign-in />
          </div>
          <div class="header-text">{{ headerText }}</div>
        </div>

        <div
          v-if="currentTab === 'error'"
          class="content-container"
        >{{ errorMessage }}</div>

        <i18n
          v-else-if="loadingI18nPath"
          class="content-container"
          :path="loadingI18nPath"
          tag="div"
        >
          <span
            class="app-name"
            place="appName"
          >Liker Land app</span>
        </i18n>

        <WalletConnectQRCodeView
          v-else-if="getWalletConnectURI"
          :value="getWalletConnectURI"
        />
        <!-- main -->
        <div
          v-else
          class="content-container"
        >
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
              <!-- legacy content -->
              <div
                v-if="!getWalletConnectURI"
                class="legacy-content-container"
              >
                <div class="text">
                  {{
                    $t("DialogV2.type.metaMask.name") + ' ' +
                      $t("DialogV2.type.metaMask.description")
                  }}
                  <div />
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </template>
    </BaseDialogV3>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { logTrackerEvent } from '@/util/EventLogger';
import User from '@/util/User';

import {
  getAuthPlatformSignInURL,
} from '@/util/auth';

import {
  LOGIN_CONNECTION_LIST,
} from '@/constant';

import {
  tryPostLoginRedirect,
} from '~/util/client';

import { apiCheckIsUser } from '@/util/api/api';

import KeplrIcon from '~/components/icons/Keplr';
import LikerLand from '~/components/icons/LikerLand';
import SignIn from '~/components/icons/SignIn';
import ArrowDown from '~/components/icons/ArrowDown';
import EthMixin from '~/components/EthMixin';

import RegisterForm from '../RegisterForm';
import WalletConnectQRCodeView from '../WalletConnectQRCodeView';
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
    BaseDialogV3,
    SignIn,
    KeplrIcon,
    LikerLand,
    ArrowDown,
    RegisterForm,
    WalletConnectQRCodeView,
  },
  mixins: [EthMixin],
  data() {
    return {
      isShowMoreLoginOptions: false,

      currentTab: 'portal',
      registerStep: 'create-liker-id',
      referrer: '',
      sourceURL: '',
      platform: '',
      errorCode: '',
      error: '',

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
    shouldShowDialog() {
      return this.getIsShowAuthDialog;
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
      if (!this.getWalletConnectConnecting && this.currentTab !== 'loading') return '';
      if (this.getWalletConnectConnecting) {
        return this.$t('V2_AuthDialog_WalletConnect_Loading');
      }
      return this.$t('V2_AuthDialog_Loading');
    },
  },
  async mounted() {
    const { from, referrer } = this.$route.query;
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
  },
  methods: {
    ...mapActions([
      'newUser',
      'loginUser',
      'updateUserAvatar',
      'doPostAuthRedirect',
      'loginByCosmosWallet',
      'resetLoginByCosmosWallet',
    ]),

    setError(code, error) {
      this.currentTab = 'error';
      this.errorCode = code;
      this.error = error;
    },

    onClickUseKeplrButton() {
      this.signInWithPlatform('cosmosWallet', { source: 'keplr' });
    },
    onClickUseWalletConnectButton() {
      this.signInWithPlatform('cosmosWallet', { source: 'walletconnect' });
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
        case 'wallet': {
          this.currentTab = 'loading';
          this.startWeb3AndCb(this.signInWithMetaMask);
          return;
        }
        case 'cosmosWallet': {
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
            this.$sentry.captureException(
              new Error('platform default not exist'),
            );
          }
          this.currentTab = 'error';
        }
      }
    },

    async signInWithCosmosWallet(source = 'keplr') {
      try {
        this.signInPayload = await this.loginByCosmosWallet(source);
        this.login();
      } catch (err) {
        this.resetLoginByCosmosWallet();
        console.error(err);
        if (this.$sentry) this.$sentry.captureException(err);
        this.setError(err.message, err);
      }
    },

    async signInWithMetaMask() {
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
          this.startWeb3AndCb(this.signInWithMetaMask, true);
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
      this.currentTab = 'loading';
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
        if (this.$sentry) this.$sentry.captureException(err);
        this.setError((err.response || {}).data, err);
      }
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

.legacy-content-container {
  margin-top: 12px;

  text-align: center;

  color: #9b9b9b;

  .text {
    text-decoration: underline;
  }
}
</style>
