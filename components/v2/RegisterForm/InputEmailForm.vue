<template>
  <div class="v2-form__content">
    <div class="v2-form__body">
      <div>{{ $t('V2_Form_Email_description') }}</div>
      <InputField
        v-model="internalEmail"
        :label="$t('V2_Form_Email_label')"
        :placeholder="$t('V2_Form_Email_placeholder')"
      />
    </div>

    <div class="v2-form__footer">
      <div class="v2-form__footer-left-slot">
        <Button
          preset="outlined"
          @click="handleSkip"
        >{{ $t('V2_Form_Button_Skip') }}</Button>
      </div>
      <div class="v2-form__footer-right-slot">
        <Button
          :is-disabled="!isConfirmable"
          @click="handleConfirm"
        >{{ $t('V2_Form_Button_Confirm') }}<ArrowRightIcon /></Button>
      </div>
    </div>
  </div>
</template>

<script>
import ArrowRightIcon from '../icons/ArrowRIght';
import Button from '../Button';
import InputField from '../InputField';

import { REGISTER_EMAIL_REGEX } from '@/constant';

export default {
  components: {
    ArrowRightIcon,
    Button,
    InputField,
  },
  props: {
    email: {
      type: String,
      default: '',
    },
    isSubscribeNewsletter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      internalEmail: this.email,
      internalIsSubscribeNewsletter: this.isSubscribeNewsletter,
    };
  },
  computed: {
    isConfirmable() {
      return this.internalEmail && REGISTER_EMAIL_REGEX.test(this.internalEmail);
    },
  },
  methods: {
    handleSkip() {
      this.$modal.show('skip-verify-email');
    },
    handleForceSkip() {
      this.$modal.hide('skip-verify-email');
      this.$emit('skip');
    },
    handleNotSkip() {
      this.$modal.hide('skip-verify-email');
    },
    handleConfirm() {
      if (!this.isConfirmable) return;
      this.$emit('confirm', {
        email: this.internalEmail,
        isSubscribeNewsletter: this.internalIsSubscribeNewsletter,
      });
    },
  },
};
</script>
