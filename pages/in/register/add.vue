<template>
  <div>
    <div class="lc-container-0 lc-narrow">

      <section class="lc-container-1 lc-section-block">

        <div class="lc-container-2">
          <div class="lc-container-3 lc-bg-gray-1">
            <div class="lc-container-4 ">
              <!-- should check for verified email first
              <label for="email">email: </label>
              <input
                v-model="email"
                name="email"
              >
              <br>
              <md-button
                class="md-likecoin"
                @click="onClickLink('email')"
              >
                Email
              </md-button> -->
              <md-button
                class="md-likecoin"
                @click="onClickLink('google')"
              >
                Google
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLink('facebook')"
              >
                Facebook
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLink('twitter')"
              >
                Twitter
              </md-button>
              <md-button
                class="md-likecoin"
                @click="onClickLink('github')"
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
import { mapActions, mapGetters } from 'vuex';
import {
  firebasePlatformLinkUser,
  firebaseEmailLinkUser,
} from '~/util/FirebaseApp';

export default {
  name: 'register-add',
  middleware: 'authenticated',
  data() {
    return {
      email: '',
    };
  },
  computed: {
    ...mapGetters([
      'getUserId',
    ]),
  },
  methods: {
    ...mapActions([
      'linkPlatformToUser',
    ]),
    async onClickLink(platform) {
      let payload;
      if (platform === 'email') {
        const info = await firebaseEmailLinkUser(this.email);
        payload = {
          user: this.getUserId,
          ...payload,
          ...info,
        };
      } else {
        const { accessToken, firebaseIdToken } = await firebasePlatformLinkUser(platform);
        payload = {
          user: this.getUserId,
          accessToken,
          platform,
          firebaseIdToken,
        };
      }
      this.sendInfoToServer(payload);
    },
    async sendInfoToServer(payload) {
      this.linkPlatformToUser(payload);
    },
  },
};
</script>
