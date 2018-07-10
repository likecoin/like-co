<template>
  <div class="lc-margin-vertical-32">
    <div class="lc-container-0">
      <div class="lc-container-1">
        <div class="lc-container-2">
          <div class="lc-container-3">
            <div class="lc-container-4">
              <span v-if="errorMsg">
                {{ $t('General.label.error') }}: {{ errorMsg }},
                <nuxt-link :to="{ name: 'index' }">
                  {{ $t('Verify.label.toIndex') }}
                </nuxt-link>
                ...
              </span>

              <span v-else-if="isDone">
                {{ $t('General.label.success') }},
                <nuxt-link :to="{ name: 'in' }">
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
import { mapActions } from 'vuex';

export default {
  name: 'oAuthConnect',
  data() {
    return {
      errorMsg: '',
      isDone: false,
      redirectTimer: null,
    };
  },
  computed: {
    platform() {
      return this.$route.params.platform;
    },
    username() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions([
      'loginUser',
      'linkSocialPlatform',
    ]),
    async triggerLoginSign() {
      if (!(await this.loginUser())) this.$router.push({ name: 'index' });
    },
    async connect() {
      switch (this.platform) {
        case 'flickr': {
          await this.linkSocialPlatform({
            platform: 'flickr',
            payload: {
              oAuthToken: this.$route.query.oauth_token,
              oAuthVerifier: this.$route.query.oauth_verifier,
              user: this.username,
            },
          });
          break;
        }
        default:
          break;
      }
      this.isDone = true;
      this.$router.push({ name: 'in' });
    },
  },
  watch: {
    getUserNeedAuth(a) {
      if (a) {
        this.triggerLoginSign();
      } else if (!this.isDone) {
        this.connect();
      }
    },
    getUserNeedRegister(a) {
      if (a) {
        this.$router.push({ name: 'in-register', query: { ref: 'in', ...this.$route.query } });
      }
    },
  },
  mounted() {
    if (this.getUserNeedAuth) {
      this.triggerLoginSign();
    } else if (this.getUserNeedRegister) {
      this.$router.push({ name: 'in-register', query: { ref: 'in', ...this.$route.query } });
    } else {
      this.connect();
    }
  },
  beforeDestroy() {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
  },
};
</script>
