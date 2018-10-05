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
              <div class="check-box-list">
                <md-checkbox
                  v-model="isBindWallet"
                  class="md-likecoin"
                >
                  {{ $t('Register.form.bindWallet') + (isBindWallet && wallet? wallet: '') }}
                </md-checkbox>
              </div>
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

export default {
  name: 'register-new',
  data() {
    return {
      likecoinId: '',
      email: '',
      isBindWallet: false,
      wallet: null,
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
      'getMetamaskError',
    ]),
  },
  watch: {
    async isBindWallet() {
      if (this.isBindWallet) {
        if (!EthHelper.getIsInited()) {
          this.startLoading();
          await EthHelper.pollForWeb3('window');
        }
        this.setBindWallet();
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
      'startLoading',
      'stopLoading',
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
        wallet: this.wallet,
      };
      this.sendRegisterToServer(payload);
    },
    async onClickLogin(platform) {
      if (platform === 'email') {
        await firebaseSendSignInEmail({ likecoinId: this.likecoinId });
      } else {
        const { accessToken, secret, firebaseIdToken } = await firebasePlatformSignIn(platform);
        const payload = {
          user: this.likecoinId,
          accessToken,
          secret,
          firebaseIdToken,
          platform,
          locale: this.getCurrentLocale,
          wallet: this.wallet,
        };
        this.sendRegisterToServer(payload);
      }
    },
    async sendRegisterToServer(payload) {
      await this.newUser(payload);
      const router = this.$router;
      this.doPostAuthRedirect({ router });
    },
    setBindWallet() {
      this.wallet = EthHelper.getWallet();
      if (this.getMetamaskError) {
        this.isBindWallet = false;
        EthHelper.disableWeb3();
      }
      if (this.isBindWallet && !this.wallet) {
        setTimeout(() => this.setBindWallet(), 2000);
      } else {
        this.stopLoading();
      }
    },
  },
};
</script>
