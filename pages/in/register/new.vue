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
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { firebase } from '~/util/FirebaseApp';

export default {
  name: 'register-new',
  data() {
    return {
      likecoinId: '',
      email: '',
    };
  },
  computed: {
    ...mapGetters([
      'getCurrentLocale',
    ]),
  },
  mounted() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      this.handleEmailSignIn();
    }
  },
  methods: {
    ...mapActions([
      'newUser',
    ]),
    getFirebaseProvider(platform) {
      switch (platform) {
        case 'google':
          return new firebase.auth.GoogleAuthProvider();
        case 'facebook': {
          const provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('public_profile');
          provider.addScope('pages_show_list');
          provider.addScope('user_link');
          return provider;
        }
        case 'twitter':
          return new firebase.auth.TwitterAuthProvider();
        case 'github':
          return new firebase.auth.GithubAuthProvider();
        default:
          throw new Error('Platform not exist');
      }
    },
    async handleEmailSignIn() {
      const { id: likecoinId, email } = window.localStorage.getItem('emailForSignIn');
      if (email && likecoinId) {
        await firebase.auth().signInWithEmailLink(email, window.location.href);
        const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
        window.localStorage.removeItem('emailForSignIn');
        const payload = {
          user: likecoinId,
          firebaseIdToken,
          platform: 'email',
          locale: this.getCurrentLocale,
        };
        this.sendRegisterToServer(payload);
      }
    },
    async onClickLogin(platform) {
      if (platform === 'email') {
        const actionCodeSettings = {
          url: window.location.href,
          handleCodeInApp: true,
        };
        await firebase.auth().sendSignInLinkToEmail(this.email, actionCodeSettings);
        window.localStorage.setItem(
          'emailSignInPayload',
          JSON.Stringify({ id: this.likecoinId, email: this.email }),
        );
      } else {
        const provider = this.getFirebaseProvider(platform);
        const result = await firebase.auth().signInWithPopup(provider);
        const { accessToken } = result.credential;
        const firebaseIdToken = await firebase.auth().currentUser.getIdToken();
        const payload = {
          user: this.likecoinId,
          accessToken,
          firebaseIdToken,
          platform,
          locale: this.getCurrentLocale,
        };
        this.sendRegisterToServer(payload);
      }
    },
    async sendRegisterToServer(payload) {
      this.newUser(payload);
    },
  },
};
</script>
