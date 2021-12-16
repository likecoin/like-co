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
      <h1>{{ $t('AuthCoreWidget.desmos.proof.title') }}</h1>
    </header>
    <div class="likepay-panel">
      <section class="likepay-panel__section-container">
        <div class="likepay-panel__section-meta">
          <p>{{ $t('AuthCoreWidget.desmos.proof.description') }}</p>
        </div>
        <div class="likepay-panel__section-meta">
          <textarea
            v-model="authCoreProofText"
            class="lc-margin-top-8"
            :rows="6"
            readonly
          />
        </div>
        <div class="likepay-panel__section-meta">
          <p><a
            target="_blank"
            rel="noopener noreferrer"
            href="https://desmos.network/"
          >{{ $t('AuthCoreWidget.desmos.proof.desmosLink') }}</a></p>
          <p><a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.desmos.network/developers/types/profiles/chain-link/#1-create-the-ownership-proofs"
          >{{ $t('AuthCoreWidget.desmos.proof.chainLinkLink') }}</a></p>
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
      <div v-else-if="authCoreProofText">
        <button
          v-clipboard:copy="authCoreProofText"
          v-clipboard:success="onCopyProof"
          type="button"
          class="likepay-block-button"
        >
          {{ $t(`General.button.${hasCopiedProof ? 'copied' : 'copy'}`) }}
        </button>
      </div>
      <div v-else>
        <button
          class="likepay-block-button"
          @click="onClickAuthCoreGenerateProof"
        >
          {{ $t('AuthCore.button.generateProof') }}
        </button>
      </div>
    </footer>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'payment',
  layout: 'likepay',
  data() {
    return {
      hasCopiedProof: false,
      isLoading: false,
      authCoreProofText: '',
    };
  },
  head() {
    return {
      title: 'Desmos Chain Link Proof',
    };
  },
  computed: {
    ...mapGetters([
      'getUserIsRegistered',
      'getAuthCoreNeedReAuth',
    ]),
  },
  methods: {
    ...mapActions([
      'popupAuthDialogInPlace',
      'setReAuthDialogShow',
      'signAuthCoreAddressProof',
    ]),
    async onClickAuthCoreGenerateProof() {
      const proof = await this.signAuthCoreAddressProof();
      this.authCoreProofText = JSON.stringify(proof, null, 2);
    },
    onClickSignInButton() {
      this.popupAuthDialogInPlace({ route: this.$route, isSignIn: true });
    },
    onClickAuthCoreReAuth() {
      this.setReAuthDialogShow(true);
    },
    onCopyProof() {
      this.hasCopiedProof = true;
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
