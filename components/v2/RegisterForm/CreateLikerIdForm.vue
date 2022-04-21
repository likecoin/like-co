<template>
  <div class="v2-register-form__content">
    <div class="v2-register-form__body">
      <div>{{ $t('V2_Form_LikerId_description') }}</div>
      <InputField
        v-model="internalLikerId"
        :label="$t('V2_Form_LikerId_label')"
        :placeholder="$t('V2_Form_LikerId_placeholder')"
      />
    </div>

    <div class="v2-register-form__footer">
      <div class="v2-register-form__footer-right-slot">
        <Button
          :is-disabled="!isLikerIdValid"
          @click="handleConfirm"
        >{{ $t('V2_Form_Button_Confirm') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import Button from '../Button';
import InputField from '../InputField';

import { LIKECOIN_ID_REGEX } from '@/constant';

export default {
  components: {
    Button,
    InputField,
  },
  props: {
    likerId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalLikerId: this.likerId,
    };
  },
  computed: {
    isLikerIdValid() {
      return LIKECOIN_ID_REGEX.test(this.internalLikerId);
    },
  },
  methods: {
    handleConfirm() {
      if (!this.isLikerIdValid) return;
      this.$emit('confirm', { likerId: this.internalLikerId });
    },
  },
};
</script>
