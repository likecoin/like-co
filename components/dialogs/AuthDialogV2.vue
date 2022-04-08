<template>
  <div class="root-classes">
    <BaseDialogV3
      ref="dialog"
      v-bind="$testID('AuthDialog')"
      :is-show="shouldShowDialog"
      :is-show-backdrop="false"
      :is-closable="false"
    >
      <!-- header -->
      <div class="header">
        <div class="header-icon">
          <sign-in />
        </div>
        <div class="header-text">{{ $t("DialogV2.title.signIn") }}</div>
      </div>
      <!-- main -->
      <div
        v-if="currentTab !== 'register'"
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
            'dropdown-toggle--clickable': !isShowLikerLand,
          }"
          @click="isShowLikerLand = true"
        >
          <div class="text">{{ $t("DialogV2.dropdown") }}</div>
          <div
            v-if="!isShowLikerLand"
            class="icon"
          ><arrow-down /></div>
        </div>
        <!-- liker land -->
        <Transition
          name="slide"
          mode="out-in"
        >
          <div
            v-show="isShowLikerLand"
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
        </Transition>
      </div>
      <div v-else>
        <div
          v-bind="tabProps"
          class="content-container"
        >
          <register-form
            :prefilled-data="signInPayload"
            :is-edit-email="isEmailEditable"
            :platform="platform"
            @register="register"
          />
        </div>
      </div>
    </BaseDialogV3>
    <!-- legacy content -->
    <div
      v-if="isShowLikerLand"
      class="legacy-content-container"
    >
      <div class="text">
        {{
          $t("DialogV2.type.metaMask.name") +
            $t("DialogV2.type.metaMask.description")
        }}
        <div />
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
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

import BaseDialogV3 from '~/components/dialogs/BaseDialogV3';
import KeplrIcon from '~/components/icons/Keplr';
import LikerLand from '~/components/icons/LikerLand';
import SignIn from '~/components/icons/SignIn';
import ArrowDown from '~/components/icons/ArrowDown';
import RegisterForm from './AuthDialogContent/Register';


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
  },
  data() {
    return {
      isShowLikerLand: false,
      currentTab: 'loading',
      referrer: '',
      sourceURL: '',
      platform: '',
      errorCode: '',
      error: '',
    };
  },
  computed: {
    ...mapGetters([
      'getIsShowAuthDialog',
      'getUserMinInfoById',
      'getCurrentLocale',
    ]),
    shouldShowDialog() {
      return this.getIsShowAuthDialog;
    },
    utmSource() {
      return this.$route.query.utm_source;
    },
    tabProps() {
      return {
        ref: 'tab',
        key: this.currentTab,
      };
    },
    isEmailEditable() {
      return (
        !(this.signInPayload.isEmailVerified && this.signInPayload.email)
        && this.platform !== 'authcore'
      );
    },
  },
  async mounted() {
    const { from } = this.$route.query;
    if (from) {
      await this.fetchAvatar(from);
    }
    const { referrer } = this.$route.query;
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
      'setAuthDialogShow',
      'loginUser',
      'doPostAuthRedirect',
      'fetchUserMinInfo',
      'loginByCosmosWallet',
    ]),

    setError(code, error) {
      this.currentTab = 'error';
      this.errorCode = code;
      this.error = error;
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
          // this.currentTab = 'loading';
          this.startWeb3AndCb(this.signInWithWallet);
          return;
        }
        case 'cosmosWallet': {
          // this.currentTab = 'loading';
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
      // this.currentTab = 'loading';
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

    async redirectAfterSignIn() {
      this.currentTab = 'loading';
      try {
        window.sessionStorage.removeItem('registerDialogSourceURL');
      } catch (err) {
        // no op
      }
      // this.setIsShow(false);
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

    redirectToPreAuthPage() {
      const router = this.$router;
      const route = this.$route;
      this.doPostAuthRedirect({ router, route });
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
  &--clickable {
    cursor: pointer;
  }
  .text {
    margin-right: 8px;

    font-size: 14px;
    font-weight: 600;
  }
  .icon {
    display: flex;
    align-items: center;
  }
}

.legacy-content-container {

  color: #9b9b9b;
  .text {
    text-decoration: underline;
  }
}
</style>
