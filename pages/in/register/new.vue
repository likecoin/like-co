<template>
  <div>
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">
              <label for="likecoinId">likecoinId: </label>
              <input
                v-model="likecoinId"
                name="likecoinId"
              >
              <label for="email">email: </label>
              <input
                v-model="email"
                name="email"
              >
              <br>
              <md-button
                class="md-likecoin"
                @click="onClickLogin('email')"
              >
                Email
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLogin('google')"
              >
                Google
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLogin('facebook')"
              >
                Facebook
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLogin('twitter')"
              >
                Twitter
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLogin('github')"
              >
                Github
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLogin('wallet')"
              >
                {{ $t('Register.form.bindWallet') }}
              </md-button>
              <div
                v-if="isBindWallet && wallet"
              >
                {{ 'wallet: ' + wallet }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  firebasePlatformSignIn,
  firebaseSendSignInEmail,
  firebaseIsSignInEmailLink,
  firebaseHandleSignInEmailLink,
} from '~/util/FirebaseApp';

import EthHelper from '@/util/EthHelper';
import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'register-new',
  data() {
    return {
      likecoinId: '',
      email: '',
      isBindWallet: false,
      wallet: null,
      avatarFile: null,
      isEmailEnabled: false,
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getMetamaskError',
      'getLocalWallet',
      'getIsWeb3Polling',
    ]),
  },
  watch: {
    getLocalWallet() {
      this.wallet = this.getLocalWallet;
      if (this.getIsWeb3Polling) {
        this.stopWeb3Polling();
        this.handleWalletSignIn();
      }
    },
    getMetamaskError() {
      if (this.isBindWallet && this.getMetamaskError) {
        this.isBindWallet = false;
        EthHelper.disableWeb3();
      }
    },
  },
  mounted() {
    if (firebaseIsSignInEmailLink()) {
      this.handleEmailSignIn();
    }
  },
  methods: {
    ...mapActions([
      'newUser',
      'doPostAuthRedirect',
      'startWeb3Polling',
      'stopWeb3Polling',
      'refreshUser',
      'setInfoMsg',
    ]),
    async handleEmailSignIn() {
      const result = await firebaseHandleSignInEmailLink();
      if (!result.email || !result.likecoinId || !result.firebaseIdToken) {
        throw new Error('invalid result');
      }
      const payload = {
        user: result.likecoinId,
        firebaseIdToken: result.firebaseIdToken,
        platform: 'email',
        locale: this.getCurrentLocale,
      };
      this.sendRegisterToServer(payload);
    },
    async onClickLogin(platform) {
      if (platform === 'email') {
        await firebaseSendSignInEmail({ likecoinId: this.likecoinId });
      } else if (platform === 'wallet') {
        const isStarted = await this.startWeb3Polling();
        if (!isStarted) {
          this.handleWalletSignIn();
        }
      } else {
        const { accessToken, secret, firebaseIdToken } = await firebasePlatformSignIn(platform);
        const payload = {
          user: this.likecoinId,
          accessToken,
          secret,
          firebaseIdToken,
          platform,
          locale: this.getCurrentLocale,
        };
        this.sendRegisterToServer(payload);
      }
    },
    async sendRegisterToServer(payload) {
      await this.newUser(payload);
      const router = this.$router;
      this.doPostAuthRedirect({ router });
    },
    startBindWallet() {
      this.startWeb3Polling();
      this.isBindWallet = true;
    },
    async handleWalletSignIn() {
      try {
        const userInfo = {
          avatarFile: this.avatarFile,
          user: this.likecoinId.toLowerCase().trim(),
          wallet: this.wallet,
          email: this.email.toLowerCase().trim(),
          isEmailEnabled: this.isEmailEnabled,
          locale: this.getCurrentLocale,
        };
        const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.registerUser'));
        await this.newUser({ ...data });
        logTrackerEvent(this, 'RegFlow', 'CompleteRegistration', 'click confirm to create new account and the action success', 1);
        await this.refreshUser(this.wallet);
        this.setInfoMsg(`${this.$t('Register.form.label.updatedInfo')}  <a href="/${this.user}">${this.$t('Register.form.label.viewPage')}</a>`);
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
