<!-- eslint-disable max-len -->
<template>
  <div
    v-if="isLoading"
    key="loading"
    class="likepay-body likepay-body--center"
  >
    <span class="likepay-text-panel">
      {{ $t('General.loading') }}
    </span>
  </div>
  <div
    v-else
    key="panel"
    class="likepay-body"
  >
    <header class="likepay-body__header">
      <div class="likepay-panel__header-title">{{ $t('AuthCoreWidget.seedWords.title') }}</div>
    </header>
    <div class="likepay-panel">
      <section class="likepay-panel__section-container">
        <div
          v-if="error"
          class="likepay-panel__section-meta"
        >{{ error.message || error }}</div>
        <div
          v-if="seedWords"
          class="likepay-panel__section-meta"
        >
          <div class="likepay-panel__section-meta">
            <p>{{ $t('AuthCore.SeedWords.seedWordsDescription') }}</p>
          </div>
          <textarea
            v-model="seedWords"
            class="lc-margin-top-8"
            :rows="6"
            readonly
          />
        </div>
        <div
          v-else-if="isPasswordNeeded"
          class="likepay-panel__section-meta"
        >
          <p>{{ $t('AuthCore.SeedWords.passwordDescription') }}</p>
          <div>
            <input
              v-model="password"
              v-if="isPasswordNeeded"
              type="password"
              required
            >
          </div>
        </div>
      </section></div>
    <footer class="likepay-panel__footer">
      <div v-if="!getUserIsRegistered">
        <button
          class="likepay-block-button"
          @click="onClickSignInButton"
        >
          {{ $t('Home.Header.button.signIn') }}
        </button>
      </div>
      <div
        v-else-if="getAuthCoreNeedReAuth"
        class="create-account-wrapper"
      >
        <button
          class="likepay-block-button"
          @click="onClickAuthCoreReAuth"
        >
          {{ $t('AuthCore.button.reAuthNeeded') }}
        </button>
      </div>
      <div v-else-if="seedWords">
        <button
          v-clipboard:copy="seedWords"
          v-clipboard:success="onCopySeedWords"
          type="button"
          class="likepay-block-button"
        >
          {{ $t(`General.button.${hasCopiedSeedWords ? 'copied' : 'copy'}`) }}
        </button>
      </div>
      <div v-else>
        <button
          class="likepay-block-button"
          @click="onClickAuthenticate"
        >
          {{ $t('AuthCore.button.exportSeedWords') }}
        </button>
      </div>
    </footer>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';
import { AuthcoreCosmosProvider, AuthcoreVaultClient } from '@likecoin/secretd-js';

import { AUTHCORE_API_HOST } from '@/constant';

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      hasCopiedSeedWords: false,
      isLoading: true,
      secretToken: '',
      isPasswordNeeded: false,
      password: '',
      seedWords: '',
      error: '',
    };
  },
  head() {
    return {
      title: 'Authcore export seed words',
    };
  },
  computed: {
    ...mapGetters([
      'getAuthCoreAuthClient',
      'getUserIsRegistered',
      'getAuthCoreNeedReAuth',
    ]),
  },
  async mounted() {
    this.error = '';
    this.checkStatus();
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'signAuthCoreAddressProof',
    ]),
    async checkStatus() {
      try {
        const authClient = this.getAuthCoreAuthClient;
        const res = await authClient.startSecretdExportAuthentication();
        this.isPasswordNeeded = res.challenges.includes('PASSWORD');
        this.isLoading = false;
      } catch (err) {
        // If the user resets his password via forget password flow
        // (not via user setting as that requires old password) recently,
        // this API calls will fail with message last reset password is too recent, with
        // response 400 with message "last reset password is too recent"
        console.error(err);
        this.error = err;
      }
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
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
    onCopySeedWords() {
      this.hasCopiedSeedWords = true;
    },
  },
};
</script>

<style lang="scss">
@import '~assets/variables';

.likepay-body {
  &__header {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 12px 8px;

    &,
    & h1 {
      text-align: center;

      color: $civic-green;

      font-size: 18px;
      font-weight: 600;
    }

    & h1 {
      margin: 0;
      margin-left: 8px;

      line-height: 1.5;
    }
  }
}
</style>
