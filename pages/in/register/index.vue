<template>
  <div
    style="
    display: flex;
    align-items:center;
    flex-direction: column;
    justify-content: center;

    margin-bottom: 12px"
  >
    <div v-if="errorCode">
      <h2>{{ headerText }}</h2>
      <p>{{ errorMessage }}</p>
    </div>

    <Button
      v-if="!getAddress"
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
        :is-show="!['loading', 'error'].includes(currentTab)"
        :is-show-backdrop="isOverlay"
        :is-closable="false"
        :is-show-close-button="currentTab === 'error'"
        @click-close-button="onClickDialogCloseButton"
      >
        <RegisterForm
          v-if="currentTab === 'register'"
          key="register"
          @check-liker-id="onCheckLikerId"
          @register="register"
        />
        <RegisterForm
          v-else-if="['await-email-verify', 'welcome'].includes(currentTab)"
          :key="`register-${currentTab}`"
          :initial-step="currentTab === 'welcome' ? 'completed' : 'await-email-verify'"
          :user-info="getUserInfo"
          @upload-avatar="uploadAvatar"
          @complete="redirectAfterSignIn"
        />
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

import { signLoginMessage } from '@/util/cosmos/sign';
import { logTrackerEvent } from '@/util/EventLogger';
import { tryPostLoginRedirect } from '@/util/client';
import { apiCheckLikerId } from '@/util/api/api';
import User from '@/util/User';


export default {
  name: 'in-register',
  layout: 'register',
  components: {
    Button,
    RegisterForm,
    BaseDialogV3,
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
      currentTab: 'loading',
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
      if (this.currentTab === 'error') {
        return this.errorTitle;
      }
      if (this.getWalletConnectURI) {
        return this.$t('V2_WalletConnectQRCodeModal_Title');
      }
      return this.$t('DialogV2.title.signIn');
    },
  },
  watch: {
    getAddress: {
      immediate: true,
      handler(getAddress) {
        if (getAddress) {
          this.$router.push({
            name: 'in-settings',
            query: { wallet: getAddress },
          });
        }
      },
    },
    isRedirectSignIn: {
      immediate: true,
      async handler(isRedirectSignIn) {
        if (isRedirectSignIn) {
          await this.handleAuthSignIn();
        }
      },
    },
  },
  async mounted() {
    await this.handleConnectWallet();
  },
  methods: {
    ...mapActions(['handleConnectorRedirect', 'loginUser', 'doPostAuthRedirect', 'newUser', 'updateUserAvatar']),
    async onClickLoginButton() {
      await this.handleConnectWallet();
    },
    onClickDialogCloseButton() {
      this.currentTab = 'loading';
      this.errorCode = '';
      this.error = '';
      this.signInPayload = {};
      this.authcoreUserData = {};
      this.handleConnectWallet();
    },
    setError(code, error) {
      this.currentTab = 'error';
      this.errorCode = code;
      this.error = error;
    },


    // Login
    async handleConnectWallet() {
      try {
        await this.connectWallet();
        const successLogin = await this.login();
        if (successLogin) {
          this.redirectAfterSignIn();
        }
      } catch (error) {
      // eslint-disable-next-line no-console
        this.setError(error.message, error);
      }
    },
    async handleAuthSignIn() {
      const { method, code } = this.$route.query;
      if (method && code) {
        try {
          const user = await this.handleConnectorRedirect({
            method,
            params: { code },
          });
          this.authcoreUserData = user;
          const successLogin = await this.login({ idToken: user.idToken });
          if (successLogin) {
            this.redirectAfterSignIn();
          }
        } catch (err) {
          const errData = err.response || err;
          const errMessage = errData.data || errData.message || errData;
          this.setError(errMessage, errMessage);
          console.error(errMessage); // eslint-disable-line no-console
        }
      }
    },
    async login(loginPayload = {}) {
      let isLoginSuccessful = false;
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
        isLoginSuccessful = true;
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            this.currentTab = 'register';
          }
          isLoginSuccessful = false;
        }
        logTrackerEvent(this, 'RegFlow', 'LoginFail', 'LoginFail', 1);
        // eslint-disable-next-line no-console
        console.error(err);
        if (this.$sentry) this.$sentry.captureException(err);
        // this.setError((err.response || {}).data, err);
      }
      return isLoginSuccessful;
    },

    // Redirect
    async redirectAfterSignIn() {
      if (!this.isOverlay) {
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

    // Register
    async onCheckLikerId(likerId, check) {
      try {
        await apiCheckLikerId(likerId);
        check();
      } catch (error) {
        check((error.response.data || {}).error || error.statusText);
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
      this.currentTab = 'registering';
      console.log('registerPayload', registerPayload);
      const payload = {
        ...this.signInPayload,
        ...registerPayload,
      };

      if (this.platform === 'authcore') {
        const defaultLikerID = await User.prepareSuggestedUserName(this.authcoreUserData);
        if (defaultLikerID) { payload.defaultLikeCoinId = defaultLikerID; }
        if (this.signInPayload.from) {
          payload.likeWallet = this.signInPayload.from;
        }
      }
      console.log('payload-register', payload);
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

  },
};
</script>
