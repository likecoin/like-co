<template>
  <div>
    <div v-if="error">{{ error.message || error }}</div>
    <div v-if="!isInited">
      {{ $t('Loading') }}
    </div>
    <div v-else-if="seedWords">
      <p>{{ $t('AuthCore.SeedWords.seedWordsDescription') }}</p>
      <textarea
        v-model="seedWords"
        class="lc-margin-top-8"
        :rows="6"
        readonly
      />
    </div>
    <div v-else>
      <form @submit.prevent="onClickAuthenticate">
        <p>{{ $t('AuthCore.SeedWords.passwordDescription') }}</p>
        <div>
          <input
            v-model="password"
            v-if="isPasswordNeeded"
            type="password"
            required
          >
        </div>
        <md-button
          type="submit"
          class="md-likecoin lc-margin-top-8 lc-font-size-18"
        >
          {{ $t('AuthCore.button.authenticate') }}
        </md-button>
      </form>
    </div>
  </div>
</template>

<script>
import { AuthcoreCosmosProvider, AuthcoreVaultClient } from '@likecoin/secretd-js';

import { mapGetters } from 'vuex';
import { AUTHCORE_API_HOST } from '@/constant';

export default {
  name: 'auth-core-register',
  data() {
    return {
      isInited: false,
      secretToken: '',
      isPasswordNeeded: false,
      password: '',
      seedWords: '',
      error: '',
    };
  },
  computed: {
    ...mapGetters(['getAuthCoreAuthClient']),
  },
  async mounted() {
    this.error = '';
    this.checkStatus();
  },
  methods: {
    async checkStatus() {
      try {
        const authClient = this.getAuthCoreAuthClient;
        const res = await authClient.startSecretdExportAuthentication();
        this.isPasswordNeeded = res.challenges.includes('PASSWORD');
        this.isInited = true;
      } catch (err) {
        // If the user resets his password via forget password flow
        // (not via user setting as that requires old password) recently,
        // this API calls will fail with message last reset password is too recent, with
        // response 400 with message "last reset password is too recent"
        console.error(err);
        this.error = err;
      }
    },
    async onClickAuthenticate() {
      this.error = '';
      await this.getAccessToken();
      await this.exportSeedWords();
    },
    async getAccessToken() {
      try {
        const authClient = this.getAuthCoreAuthClient;
        if (this.isPasswordNeeded) {
          const res = await authClient.authenticateSecretdWithPassword(this.password);
          this.secretToken = res.secretd_access_token;
        } else {
          const res = await authClient.authenticateSecretdWithNoPassword();
          this.secretToken = res.secretd_access_token;
        }
      } catch (err) {
        console.error(err);
        this.error = err;
      }
    },
    async exportSeedWords() {
      try {
        if (!this.secretToken) this.error = 'NOT_AUTHENTICATED';
        const vaultClient = new AuthcoreVaultClient({
          apiBaseURL: AUTHCORE_API_HOST,
          accessToken: this.secretToken,
        });
        const cosmosProvider = new AuthcoreCosmosProvider({ client: vaultClient });
        const seeds = await cosmosProvider.exportMnemonic();
        this.seedWords = seeds;
      } catch (err) {
        console.error(err);
        this.error = err;
      }
    },
  },
};
</script>
