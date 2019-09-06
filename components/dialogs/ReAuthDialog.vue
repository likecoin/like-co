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
      @success="signInWithAuthCore"
    />
  </BaseDialogV2>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import AuthCoreRegister from '~/components/AuthCore/Register';
import BaseDialogV2 from '~/components/dialogs/BaseDialogV2';

export default {
  name: 're-auth-dialog',
  data() {
    return {
    };
  },
  components: {
    BaseDialogV2,
    AuthCoreRegister,
  },
  computed: {
    ...mapGetters([
      'getIsShowReAuthDialog',
    ]),
  },
  methods: {
    ...mapActions([
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
      console.log(isShow);
      this.setReAuthDialogShow(isShow);
    },
    close() {
      this.setIsShow(false);
    },
    signInWithAuthCore({ accessToken }) {
      this.setAuthCoreToken(accessToken);
      console.log('a');
      this.setIsShow(false);
    },
  },
};
</script>
