<template>
  <div
    style="
    display: flex;
    align-items:center;
    flex-direction: column;
    justify-content: center;
    gap: 12px;

    margin-bottom: 12px"
  >
    <div v-if="currentTab === tabOptions.ERROR">
      <h2>{{ headerText }}</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <Button
      v-if="!getAddress || currentTab === tabOptions.LOGIN"
      @click="onClickLoginButton"
    >{{ $t("AuthDialog.SignUp.toggleButton") }}
    </Button>
    <div
      style="
      position: relative;

      min-width: 100vw;
      margin-top: 12px"
    >
      <BaseDialogV3
        ref="dialog"
        v-bind="$testID('AuthDialog')"
        :is-show="!['login', 'error'].includes(currentTab)"
        :is-show-backdrop="isOverlay"
        :is-closable="false"
        :is-show-close-button="currentTab === 'error'"
        @click-close-button="onClickDialogCloseButton"
      >
        <Transition
          name="fade"
          mode="out-in"
        >
          <RegisterForm
            v-if="currentTab === tabOptions.REGISTER"
            key="register"
            :authcore-info="authcoreUserData.user"
            @check-liker-id="onCheckLikerId"
            @register="register"
          />
          <RegisterForm
            v-else-if="['await-email-verify', 'welcome'].includes(currentTab)"
            :key="`register-${currentTab}`"
            :initial-step="currentTab === tabOptions.WELCOME ? 'completed' : 'await-email-verify'"
            :user-info="getUserInfo"
            @upload-avatar="uploadAvatar"
            @complete="redirectAfterSignIn"
          />
          <Spinner
            v-else
            :size="36"
          />
        </Transition>
      </BaseDialogV3>
    </div>
  </div>
</template>
<script>
import wallet from '~/mixins/wallet-login';
import { mapGetters, mapActions } from 'vuex';

import Button from '~/components/v2/Button';
import RegisterForm from '@/components/v2/RegisterForm';
import BaseDialogV3 from '@/components/v2/dialogs/BaseDialogV3';
import Spinner from '@/components/Spinner';


import { signLoginMessage } from '@/util/cosmos/sign';
import { logTrackerEvent } from '@/util/EventLogger';
import { tryPostLoginRedirect } from '@/util/client';
import { apiCheckLikerId } from '@/util/api/api';
import { isValidRedirectUrl } from '@/util/ValidationHelper';
import User from '@/util/User';

const TAB_OPTIONS = {
  LOGIN: 'login',
  ERROR: 'error',
  REGISTER: 'register',
  REGISTERING: 'registering',
  EMAIL_VERIFY: 'await-email-verify',
  WELCOME: 'welcome',
  REDIRECT: 'redirect',
};

const REDIRECT_PATH_NAMES = {
  OAUTH: {
    name: 'in-oauth',
    pathname: '/in/oauth/',
  },
};

export default {
  name: 'in-register',
  layout: 'register',
  components: {
    Button,
    RegisterForm,
    BaseDialogV3,
    Spinner,
  },
  mixins: [wallet],
  head() {
    return {
      title: this.$t('Register.label.register'),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('Register.label.register'),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('Register.header.title'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('Register.header.title'),
        },
      ],
      link: [
        { rel: 'canonical', href: '/in/register' },
      ],
    };
  },
  data() {
    return {
      currentTab: TAB_OPTIONS.LOGIN,
      registerStep: 'create-liker-id',
      isOverlay: true,
      signInPayload: {},
      errorCode: '',
      error: '',
      authcoreUserData: {},
    };
  },
  computed: {
    ...mapGetters(['getAddress', 'getSigner', 'walletLoginMethod', 'getCurrentLocale', 'getUserInfo']),
    platform() {
      return this.walletLoginMethod === 'liker-id' ? 'authcore' : 'likeWallet';
    },
    isRedirectSignIn() {
      return this.$route.query.redirect_sign_in;
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
      if (this.currentTab === TAB_OPTIONS.ERROR) {
        return this.errorTitle;
      }
      if (this.getWalletConnectURI) {
        return this.$t('V2_WalletConnectQRCodeModal_Title');
      }
      return this.$t('DialogV2.title.signIn');
    },
    tabOptions() {
      return TAB_OPTIONS;
    },
  },
  watch: {
    isRedirectSignIn: {
      immediate: true,
      async handler(isRedirectSignIn) {
        if (isRedirectSignIn) {
          this.currentTab = TAB_OPTIONS.REDIRECT;
          await this.handleAuthSignIn();
        }
      },
    },
  },
  async mounted() {
    const { redirect } = this.$route.query;
    if (redirect && isValidRedirectUrl(redirect)) {
      const route = this.parseRedirectUrl(redirect);
      this.savePostAuthRoute({ route });
    }
    if (this.currentTab === TAB_OPTIONS.LOGIN && !this.isRedirectSignIn) {
      await this.handleConnectWallet();
    }
  },
  methods: {
    ...mapActions([
      'handleConnectorRedirect',
      'loginUser',
      'doPostAuthRedirect',
      'newUser',
      'updateUserAvatar',
      'savePostAuthRoute',
    ]),
    async onClickLoginButton() {
      await this.handleConnectWallet();
    },
    onClickDialogCloseButton() {
      this.currentTab = TAB_OPTIONS.LOGIN;
      this.errorCode = '';
      this.error = '';
      this.signInPayload = {};
      this.authcoreUserData = {};
      this.handleConnectWallet();
    },
    setError(code, error) {
      this.currentTab = code ? TAB_OPTIONS.ERROR : TAB_OPTIONS.LOGIN;
      this.errorCode = code;
      this.error = error;
    },


    // Login
    async handleConnectWallet() {
      this.setError();
      try {
        await this.connectWallet();
        await this.login();
        if (this.isLoginSuccessful) {
          this.redirectAfterSignIn();
        }
      } catch (error) {
        if (error.message?.includes('signArbitrary')) {
        // eslint-disable-next-line no-console
          console.error(error);
        } else {
          this.setError(error.message, error);
        }
      }
    },
    async handleAuthSignIn() {
      const { method: initialMethod, code, sign_in_platform: signInPlatform } = this.$route.query;
      let method = initialMethod;
      if (!method && signInPlatform) {
        switch (signInPlatform) {
          case 'authcore':
            method = 'liker-id';
            break;
          default:
            method = 'likeWallet';
            break;
        }
      }
      if (method && code) {
        try {
          const user = await this.handleConnectorRedirect({
            method,
            params: { code },
          });
          this.authcoreUserData = user;
          if (user.idToken) {
            await this.login({ idToken: user.idToken });
            if (this.isLoginSuccessful) {
              this.redirectAfterSignIn();
            }
          } else {
            this.setError(400, 'AUTHCORE_LOGIN_ERROR: missing idToken');
          }
        } catch (err) {
          const errData = err.response || err;
          const errMessage = errData.data || errData.message || errData;
          this.setError(errData.status, errMessage);
          console.error(errMessage); // eslint-disable-line no-console
        }
      }
    },
    async login(loginPayload = {}) {
      this.isLoginSuccessful = false;
      const signer = this.getSigner;
      const address = this.getAddress;
      const payload = await signLoginMessage(signer, address);
      const data = {
        locale: this.getCurrentLocale,
        platform: this.platform,
        ...payload,
        ...loginPayload,
      };
      this.signInPayload = data;
      try {
        await this.loginUser(this.signInPayload);
        this.isLoginSuccessful = true;
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            this.currentTab = TAB_OPTIONS.REGISTER;
          }
        }
        logTrackerEvent(this, 'RegFlow', 'LoginFail', 'LoginFail', 1);
        // eslint-disable-next-line no-console
        console.error(err);
        if (this.$sentry) this.$sentry.captureException(err);
        // this.setError((err.response || {}).data, err);
      }
    },

    // Redirect
    redirectAfterSignIn() {
      this.currentTab = TAB_OPTIONS.REDIRECT;
      if (!this.isOverlay) {
        this.$nextTick(async () => {
          if (!tryPostLoginRedirect({ route: this.$route })) {
            // Normal case
            await this.redirectToPreAuthPage();
          }
        });
      } else {
        this.$nextTick(async () => { await this.redirectToPreAuthPage(); });
      }
    },
    redirectToPreAuthPage() {
      this.currentTab = TAB_OPTIONS.REDIRECT;
      const router = this.$router;
      const route = this.$route;
      this.doPostAuthRedirect({ router, route });
    },

    // Register
    async onCheckLikerId(likerId, callback) {
      try {
        await apiCheckLikerId(likerId);
        callback();
      } catch (error) {
        callback((error.response.data || {}).error || error.statusText);
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
    async register(registerPayload) {
      this.currentTab = TAB_OPTIONS.REGISTERING;
      const payload = {
        ...this.signInPayload,
        idToken: this.authcoreUserData?.idToken,
        accessToken: this.authcoreUserData?.params?.accessToken,
        ...registerPayload,
      };

      if (this.platform === 'authcore') {
        const defaultLikerID = await User.prepareSuggestedUserName(registerPayload);
        if (defaultLikerID) { payload.defaultLikeCoinId = defaultLikerID; }
        if (this.signInPayload.from) {
          payload.likeWallet = this.signInPayload.from;
        }
      }
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
        if (payload.email && this.platform !== 'authcore') {
          this.currentTab = TAB_OPTIONS.EMAIL_VERIFY;
        } else {
          this.currentTab = TAB_OPTIONS.WELCOME;
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

    parseRedirectUrl(redirect) {
      const redirectUrl = new URL(decodeURIComponent(redirect));
      return redirectUrl.pathname === REDIRECT_PATH_NAMES.OAUTH.pathname
        ? {
          name: REDIRECT_PATH_NAMES.OAUTH.name,
          query: Object.fromEntries(new URLSearchParams(redirectUrl.search)),
          hash: redirectUrl.hash,
        }
        : redirectUrl;
    },
  },
};
</script>
