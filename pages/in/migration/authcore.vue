<template>
  <BaseDialogV2
    ref="dialog"
    :is-show="true"
    :is-show-backdrop="true"
    :is-show-header="true"
    :is-closable="true"
    class="migration-authcore-dialog"
  >
    <div class="migration-authcore-dialog__content">
      <h1>{{ $t('MigrationAuthCorePage.header') }}</h1>
      <div>{{ $t('MigrationAuthCorePage.description') }}</div>
    </div>
    <auth-core-register
      :is-sign-in="false"
      :is-fix-contact="!!getUserInfo.email"
      :email="getUserInfo.email"
      :language="getCurrentLocale"
      @success="linkWithAuthCore"
    />
  </BaseDialogV2>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AuthCoreRegister from '~/components/AuthCore/Register';
import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';
import { tryPostLoginRedirect } from '~/util/client';

export default {
  name: 'in-migration-authcore',
  middleware: 'authenticated',
  components: {
    BaseDialogV2,
    AuthCoreRegister,
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getUserIsAuthCore',
      'getCurrentLocale',
    ]),
  },
  mounted() {
    if (this.getUserIsAuthCore) {
      this.redirectAfterSignIn();
    }
  },
  methods: {
    ...mapActions([
      'setAuthCoreToken',
      'linkUserAuthPlatform',
      'doPostAuthRedirect',
      'initAuthCoreCosmosWallet',
      'fetchAuthCoreCosmosWallet',
    ]),
    async linkWithAuthCore({ idToken, accessToken }) {
      if (idToken && accessToken) {
        await this.setAuthCoreToken(accessToken);
        await this.initAuthCoreCosmosWallet();
        const cosmosWallet = await this.fetchAuthCoreCosmosWallet();
        this.linkUserAuthPlatform({
          platform: 'authcore',
          payload: {
            accessToken,
            idToken,
            cosmosWallet,
          },
        });
        this.redirectAfterSignIn();
      }
    },
    async redirectAfterSignIn() {
      this.$nextTick(() => {
        if (!tryPostLoginRedirect({ route: this.$route })) {
          const router = this.$router;
          const route = this.$route;
          this.doPostAuthRedirect({ router, route });
        }
      });
    },
  },
};
</script>

<style lang="scss">
.migration-authcore-dialog {
  &__content {
    padding: 16px;
  }
  .lc-dialog-header{
    z-index: 1;
  }
}
</style>
