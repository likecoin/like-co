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
      <h1>Confirm Delete user</h1>
    </header>
    <div class="likepay-panel">
      <section class="likepay-panel__section-container">
        <div class="likepay-panel__section-meta">
          Are you sure you want to delete the Liker ID {{ getUserInfo.user }}?
          Your information related to Liker ID will be removed
          Information related to transactions will exists on LikeCoin chain or Transaction indexers.
          After deletion, the Liker ID cannot be reused, and you will have to register with a new name in the future.
        </div>
      </section>
    </div>
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
      <div v-else>
        <label>Please type "DELETE"</label>
        <input v-model="confirmMessage">
        <button
          class="likepay-block-button"
          :disabled="confirmMessage !== 'DELETE'"
          @click="onClickConfirmDelete"
        >
          Confirm
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { apiDeleteUser } from '~/util/api/api';
import User from '~/util/User';

export default {
  name: 'delete',
  layout: 'likepay',
  data() {
    return {
      isLoading: false,
      confirmMessage: '',
    };
  },
  head() {
    return {
      title: 'Confirm User Deletion',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getUserInfo',
      'getUserIsAuthCore',
      'getAuthCoreNeedReAuth',
      'getAuthCoreAccessToken',
    ]),
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'fetchCurrentCosmosWallet',
      'prepareCosmosMessageSigner',
    ]),
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
    async onClickConfirmDelete() {
      const wallet = await this.fetchCurrentCosmosWallet();
      const signer = await this.prepareCosmosMessageSigner();
      const signature = await User.signCosmosDelete(wallet, signer);
      const payload = { signature };
      if (this.getUserIsAuthCore) {
        payload.authCoreAccessToken = this.getAuthCoreAccessToken;
      }
      await apiDeleteUser(this.getUserInfo.user, payload);
      this.$router.push({ name: 'in-register' });
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
