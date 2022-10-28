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
      <h1>{{ $t('V2_Account_Delete_Page_Header_Text') }}</h1>
    </header>
    <div class="likepay-panel">
      <section class="likepay-panel__section-container">
        <div class="likepay-panel__section-meta lc-text-align-center">
          <i18n
            path="V2_Account_Delete_Page_Message"
            tag="p"
          >
            <b
              class="lc-color-like-green"
              place="id"
            >{{ getUserInfo.user }}</b>
          </i18n>
          <p class="lc-margin-top-16 lc-color-gray-9b lc-font-size-12">{{ $t('V2_Account_Delete_Page_Notice_1') }}</p>
          <p class="lc-margin-top-8 lc-color-gray-9b lc-font-size-12">{{ $t('V2_Account_Delete_Page_Notice_2') }}</p>
        </div>
      </section>
    </div>
    <footer class="likepay-panel__footer">
      <Button
        v-if="!getUserIsRegistered"
        @click="onClickSignInButton"
      >
        {{ $t('Home.Header.button.signIn') }}
      </Button>
      <Button
        v-else-if="getAuthCoreNeedReAuth"
        @click="onClickAuthCoreReAuth"
      >
        {{ $t('AuthCore.button.reAuthNeeded') }}
      </Button>
      <template v-else>
        <i18n
          path="V2_Account_Delete_Page_Input_Label"
          tag="p"
        ><code place="code">{{ targetConfirmMessage }}</code></i18n>
        <InputField
          v-model="confirmMessage"
          class="lc-margin-top-8"
        />
        <Button
          class="lc-margin-top-16"
          :is-disabled="confirmMessage !== targetConfirmMessage"
          @click="onClickConfirmDelete"
        >{{ $t('V2_Account_Delete_Page_Confirm') }}</Button>
      </template>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { apiDeleteUser } from '~/util/api/api';
import User from '~/util/User';

import Button from '~/components/v2/Button';
import InputField from '~/components/v2/InputField';

export default {
  name: 'delete',
  layout: 'likepay',
  components: { Button, InputField },
  data() {
    return {
      isLoading: false,
      confirmMessage: '',
    };
  },
  head() {
    return {
      title: this.$t('V2_Account_Delete_Page_Title'),
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
    targetConfirmMessage() {
      return 'DELETE';
    },
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

code {
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
  border-radius: 4px;
  padding: 0 4px;
  background: #ececec;
  color: #DB4A4A;
}
</style>
