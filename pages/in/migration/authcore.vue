<template>
  <div>
    <BaseDialogV2
      ref="dialog"
      :is-show="true"
      :is-show-backdrop="true"
      :is-show-header="true"
      :is-closable="true"
    >
      <auth-core-register
        :is-sign-in="false"
        :email="getUserInfo.email"
        @success="linkWithAuthCore"
      />
    </BaseDialogV2>
  </div>
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
    ]),
    linkWithAuthCore({ idToken, accessToken }) {
      if (idToken && accessToken) {
        this.setAuthCoreToken(accessToken);
        this.linkUserAuthPlatform({ platform: 'authcore', payload: { idToken } });
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
