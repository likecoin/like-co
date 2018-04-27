<template>
  <single-input-form
    ref="form"
    type="email"
    autocomplete="email"
    :pattern="W3C_EMAIL_REGEX"
    :text="email"
    :label="label"
    :errorText="getInfoIsError ? getInfoMsg : ''"
    @cancel="onCancel"
    @submit="onSubmit"/>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

import SingleInputForm from '@/components/forms/SingleInputForm';

import User from '@/util/User';
import { W3C_EMAIL_REGEX } from '@/constant';

export default {
  name: 'verify-email-form',
  props: {
    formId: {
      type: String,
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
      default: '',
    },
  },
  components: {
    SingleInputForm,
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
      'newUser',
      'setInfoMsg',
      'sendVerifyEmail',
    ]),
    async updateEmail(newEmail) {
      const userInfo = {
        user: this.getUserInfo.user,
        displayName: this.getUserInfo.displayName,
        wallet: this.getUserInfo.wallet,
        email: newEmail,
      };
      const data = await User.formatAndSignUserInfo(userInfo, this.$t('Sign.Message.signKYC'));
      return this.newUser(data);
    },
    onCancel() {
      this.$emit('cancel');
    },
    async onSubmit(inputText) {
      this.$emit('submit', inputText);
      const msg = this.$t('Edit.label.verifying');
      if (this.email !== inputText) {
        await this.updateEmail(inputText);
      }
      await this.sendVerifyEmail({ id: this.getUserInfo.user, ref: this.emailRef || '' });
      this.setInfoMsg(msg);
    },
  },
};
</script>
