<template>
  <single-input-form
    ref="form"
    :pattern="W3C_EMAIL_REGEX"
    :text="email"
    :label="label"
    :errorText="getInfoIsError ? getInfoMsg : ''"
    type="email"
    autocomplete="email"
    @cancel="onCancel"
    @submit="onSubmit"
  />
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import SingleInputForm from '@/components/forms/SingleInputForm';

import User from '@/util/User';
import { logTrackerEvent } from '@/util/EventLogger';
import { W3C_EMAIL_REGEX } from '@/constant';

export default {
  name: 'verify-email-form',
  components: {
    SingleInputForm,
  },
  props: {
    formId: {
      type: String,
      default: undefined,
    },
    email: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    emailRef: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      W3C_EMAIL_REGEX,
    };
  },
  computed: {
    ...mapGetters([
      'getInfoIsError',
      'getInfoMsg',
      'getUserInfo',
    ]),
    getFormId() {
      return this.formId || 'email-form';
    },
  },
  methods: {
    ...mapActions([
      'updateUser',
      'setInfoMsg',
      'sendVerifyEmail',
      'refreshUserInfo',
    ]),
    async updateEmail(newEmail) {
      const userInfo = {
        user: this.getUserInfo.user,
        displayName: this.getUserInfo.displayName,
        wallet: this.getUserInfo.wallet,
        email: newEmail,
      };
      const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.signKYC'));
      return this.updateUser(data);
    },
    onCancel() {
      this.$emit('cancel');
    },
    async onSubmit(inputText) {
      this.$emit('submit', inputText);
      const msg = this.$t('Edit.label.verifying');
      if (this.email !== inputText) {
        await this.updateEmail(inputText);
        this.refreshUserInfo(this.getUserInfo.user);
      }
      await this.sendVerifyEmail({ id: this.getUserInfo.user, ref: this.emailRef || '' });
      logTrackerEvent(this, 'RegFlow', 'StartEmailVerify', 'click confirm after enter email and the email is valid', 1);
      this.setInfoMsg(msg);
    },
  },
};
</script>
