<template>
  <div>
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import {
  firebasePlatformSignIn,
  firebaseSendSignInEmail,
  firebaseIsSignInEmailLink,
  firebaseHandleSignInEmailLink,
} from '~/util/FirebaseApp';

export default {
  name: 'register-login',
  data() {
    return {
      email: '',
    };
  },
  mounted() {
    if (firebaseIsSignInEmailLink()) {
      this.handleEmailSignIn();
    }
  },
  methods: {
    ...mapActions([
      'loginUser',
    ]),
    async handleEmailSignIn() {
      const result = await firebaseHandleSignInEmailLink();
      if (!result.email || !result.firebaseIdToken) {
        throw new Error('invalid result');
      }
      const payload = {
        platform: 'email',
        firebaseIdToken: result.firebaseIdToken,
      };
      this.sendRegisterToServer(payload);
    },
    async onClickLogin(platform) {
      if (platform === 'email') {
        await firebaseSendSignInEmail({ likecoinId: this.likecoinId });
      } else {
        const { accessToken, firebaseIdToken } = await firebasePlatformSignIn(platform);
        const payload = {
          user: this.likecoinId,
          accessToken,
          platform,
          firebaseIdToken,
        };
        this.sendLoginToServer(payload);
      }
    },
    async sendLoginToServer(payload) {
      this.loginUser(payload);
    },
  },
};
</script>
