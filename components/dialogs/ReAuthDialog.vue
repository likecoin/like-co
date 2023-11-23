<template>
  <BaseDialogV2
    ref="dialog"
    :is-show="true"
    :is-show-backdrop="true"
    :is-show-header="true"
    :is-closable="true"
    @update:isShow="onUpdateIsShow"
    @click-outside="onClosed"
  >
    <auth-core-register
      :is-sign-in="true"
      :is-fix-contact="true"
      :language="getCurrentLocale"
      :email="getUserInfo.email"
      :redirect-url="getAuthCoreRedirectUrl"
      @loginWidgetLoaded="onAuthCoreLoginWidgetLoaded"
      @registerStarted="onAuthCoreRegisterStarted"
      @oauthStarted="onAuthCoreOAuthStarted"
      @loginStarted="onAuthCoreLoginStarted"
      @navigation="onAuthCoreNavigation"
      @success="signInWithAuthCore"
    />
  </BaseDialogV2>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import { logTrackerEvent } from '@/util/EventLogger';
import AuthCoreRegister from '~/components/AuthCore/Register';
import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';

import {
  EXTERNAL_URL,
} from '@/constant';

export default {
  name: 're-auth-dialog',
  components: {
    BaseDialogV2,
    AuthCoreRegister,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getIsShowReAuthDialog',
      'getCurrentLocale',
    ]),
    getAuthCoreRedirectUrl() {
      let url = `${EXTERNAL_URL}/in/register?`;
      url += 'redirect_sign_in=1&sign_in_platform=authcore';
      const { redirect, is_popup: isPopup } = this.$route.query;
      if (redirect) {
        url += `&redirect=${encodeURIComponent(redirect)}`;
      }
      if (isPopup !== undefined) {
        url += `&is_popup=${encodeURIComponent(isPopup)}`;
      }
      return url;
    },
  },
  mounted() {
    this.savePostAuthRoute({ route: this.$route });
  },
  methods: {
    ...mapActions([
      'savePostAuthRoute',
      'setReAuthDialogShow',
      'setAuthCoreToken',
    ]),
    onUpdateIsShow(isShow) {
      if (isShow !== this.getIsShowReAuthDialog) {
        this.setIsShow(isShow);
      }
    },
    onToggleSignIn() {
      this.toggleAuthDialogIsSignIn();
    },
    onConfirm() {
      this.setIsShow(false);
      this.$emit('confirm');
      this.onClosed();
    },
    onCancel() {
      this.setIsShow(false);
      this.$emit('cancel');
      this.onClosed();
    },
    onClosed() {
      this.$emit('closed');
    },
    setIsShow(isShow) {
      this.setReAuthDialogShow(isShow);
    },
    close() {
      this.setIsShow(false);
    },
    onAuthCoreLoaded() {
      logTrackerEvent(this, 'ReAuthFlow', 'AuthCoreReAuthDialogLoaded', 'AuthCoreReAuthDialogLoaded', 1);
    },
    onAuthCoreLoginWidgetLoaded() {
      logTrackerEvent(this, 'ReAuthFlow', 'AuthCoreReAuthLoginWidgetLoaded', 'AuthCoreReAuthLoginWidgetLoaded', 1);
    },
    onAuthCoreRegisterStarted(method) {
      logTrackerEvent(this, 'ReAuthFlow', 'AuthCoreReAuthRegisterTry', `AuthCoreReAuthRegisterTry(${method})`, 1);
    },
    onAuthCoreOAuthStarted(method) {
      logTrackerEvent(this, 'ReAuthFlow', 'AuthCoreReAuthOAuthTry', `AuthCoreReAuthRegisterTry(${method})`, 1);
    },
    onAuthCoreLoginStarted(method) {
      logTrackerEvent(this, 'ReAuthFlow', 'AuthCoreReAuthLoginTry', `AuthCoreReAuthLoginTry(${method})`, 1);
    },
    onAuthCoreNavigation(page) {
      this.logRegisterEvent(this, 'ReAuthFlow', `AuthCoreReAuthSwitchTo${page}`, `AuthCoreReAuthSwitchTo${page}`, 1);
    },
    async signInWithAuthCore({ accessToken }) {
      await this.setAuthCoreToken(accessToken);
      this.setIsShow(false);
    },
  },
};
</script>
