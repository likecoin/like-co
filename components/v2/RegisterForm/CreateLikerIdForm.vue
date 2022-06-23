<template>
  <div class="v2-form__content">
    <div class="v2-form__body">
      <div>{{ $t('V2_Form_LikerId_description') }}</div>
      <InputField
        v-model="internalLikerId"
        :label="$t('V2_Form_LikerId_label')"
        :placeholder="$t('V2_Form_LikerId_placeholder')"
        :error="error"
      >
        <template #append>
          <div class="hint">{{ $t('V2_Form_LikerId_hint') }}</div>
        </template>
      </InputField>
    </div>

    <div class="v2-form__footer">
      <div class="v2-form__footer-right-slot">
        <Button
          :is-disabled="shouldDisableConfirmButton"
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
    isDuplicated: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      internalLikerId: this.likerId,
      isLoading: false,
    };
  },
  computed: {
    isLikerIdValid() {
      return LIKECOIN_ID_REGEX.test(this.internalLikerId);
    },
    shouldDisableConfirmButton() {
      return !this.isLikerIdValid || this.isLoading;
    },
    error() {
      if (this.isDuplicated) {
        return this.$t('V2_Form_LikerId_error_duplicated');
      }
      return '';
    },
  },
  watch: {
    likerId() {
      this.isLoading = false;
    },
    isDuplicated() {
      this.isLoading = false;
    },
  },
  methods: {
    handleConfirm() {
      if (!this.isLikerIdValid) return;
      this.isLoading = true;
      this.$emit('confirm', { likerId: this.internalLikerId });
    },
  },
};
</script>

<style scoped>
.hint {
  display: flex;
  align-items: center;

  margin: 0 8px;

  text-align: right;
  white-space: nowrap;

  color: #9B9B9B;

  font-size: 12px;
}
</style>
