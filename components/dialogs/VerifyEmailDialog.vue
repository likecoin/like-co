<template>
  <base-dialog
    ref="dialog"
    class="email-dialog"
    :md-props="{
      mdCloseOnEsc: false,
    }">

    <div class="lc-dialog-container-1">
      <h1
        class="lc-margin-bottom-16
          lc-font-size-32
          lc-font-weight-400
          lc-color-like-dark-brown-1
          lc-mobile">
        {{ $t('Register.form.error.emailFormat') }}
      </h1>

      <p
        class="lc-margin-bottom-16 lc-font-size-14 lc-font-weight-400 lc-color-like-green"
        v-html="$t('Dialog.emailInput.content')" />

      <verify-email-form
        ref="form"
        :email="email"
        :label="$t('Dialog.emailInput.label')"
        :email-ref="emailRef"
        @cancel="onCancel"
        @submit="onSubmit"/>
    </div>

  </base-dialog>
</template>

<script>
import BaseDialog from '~/components/dialogs/BaseDialog';
import VerifyEmailForm from '~/components/forms/VerifyEmailForm';

import { logTrackerEvent } from '@/util/EventLogger';

export default {
  name: 'verify-email-dialog',
  props: {
    emailRef: {
      default: '',
    },
    email: {
      default: '',
    },
  },
  components: {
    BaseDialog,
    VerifyEmailForm,
  },
  methods: {
    show() {
      this.$refs.dialog.show();
    },
    hide() {
      this.$refs.dialog.hide();
    },
    onCancel() {
      this.hide();
    },
    onSubmit() {
      this.hide();
      logTrackerEvent(this, 'RegFlow', 'StartEmailVerify', 'click confirm after enter email and the email is valid', 1);
    },
  },
};
</script>
