<template>
  <div class="lc-margin-vertical-32">
    <div class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <span v-if="isDone || errorMsg">
                <span v-if="errorMsg">
                  {{ $t('General.label.error') }}: {{ errorMsg }},
                </span>
                <span v-else>
                  {{ $t('General.label.success') }},
                </span>
                <nuxt-link :to="{ name: 'in-settings' }">
                  {{ $t('Verify.label.toEdit') }}
                </nuxt-link>
                ...
              </span>
              <span v-else>{{ $t('Verify.label.verifying') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'oauth-connect',
  data() {
    return {
      errorMsg: '',
      isDone: false,
      redirectTimer: null,
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserInfo',
    ]),
    platform() {
      return this.$route.params.platform;
    },
    statePayload() {
      const { state } = this.$route.query;
      if (!state) return '';
      return state.split(':')[0];
    },
    username() {
      const param = this.$route.params.id;
      if (param) return param;
      if (this.statePayload) return this.statePayload;
      const { user } = this.$route.query;
      if (user) return user;
      return this.getUserInfo.user;
    },
  },
  watch: {
    errorMsg(m) {
      if (m) {
        this.redirectTimer = setTimeout(() => {
          this.$router.push({ name: 'in-settings' });
        }, 5000);
      }
    },
  },
  mounted() {
    if (this.$route.query.error) {
      this.errorMsg = this.$route.query.error || this.$route.query.denied;
      this.isDone = true;
    }
    if (this.statePayload === 'login') {
      const { code, state } = this.$route.query;
      this.$router.replace({
        name: 'in-register',
        query: {
          redirect_sign_in: '1',
          sign_in_platform: this.platform,
          code,
          state,
        },
      });
    } else if (this.statePayload === 'authlink') {
      this.authConnect();
    } else {
      this.socialConnect();
    }
  },
  beforeDestroy() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
  },
  methods: {
    ...mapActions([
      'linkUserAuthPlatform',
      'linkSocialPlatform',
      'doUserAuth',
    ]),
    async authConnect() {
      if (this.isDone) return;
      if (!this.getUserIsRegistered) {
        const router = this.$router;
        const route = this.$route;
        this.doUserAuth({ router, route });
        return;
      }
      try {
        switch (this.platform) {
          case 'matters': {
            const { code, state } = this.$route.query;
            await this.linkUserAuthPlatform({
              platform: this.platform,
              payload: {
                code,
                state,
              },
            });
            break;
          }
          default:
            break;
        }
      } catch (err) {
        this.errorMsg = (err.response && err.response.data) || err.message || err;
        return;
      }
      this.isDone = true;
      this.$router.push({ name: 'in-settings' });
    },
    async socialConnect() {
      if (this.isDone) return;
      try {
        switch (this.platform) {
          case 'flickr': {
            await this.linkSocialPlatform({
              platform: this.platform,
              payload: {
                oAuthToken: this.$route.query.oauth_token,
                oAuthVerifier: this.$route.query.oauth_verifier,
                user: this.username,
              },
            });
            break;
          }
          case 'medium':
          case 'instagram': {
            await this.linkSocialPlatform({
              platform: this.platform,
              payload: {
                code: this.$route.query.code,
                state: this.$route.query.state,
                user: this.username,
              },
            });
            break;
          }
          default:
            break;
        }
      } catch (err) {
        this.errorMsg = (err.response && err.response.data) || err.message || err;
        return;
      }
      this.isDone = true;
      this.$router.push({ name: 'in-settings' });
    },
  },
};
</script>
