<template>
  <div class="v2-register-form__content">
    <div class="v2-register-form__body">
      <InputField
        v-model="internalDisplayName"
        :label="$t('V2_Form_DisplayName_label')"
        :placeholder="$t('V2_Form_DisplayName_placeholder')"
      />
      <InputField
        v-model="internalDescription"
        :label="$t('V2_Form_Description_label')"
        :placeholder="$t('V2_Form_Description_placeholder')"
      />
    </div>

    <div class="v2-register-form__footer">
      <div class="v2-register-form__footer-left-slot">
        <Button
          preset="outlined"
          @click="handleSkip"
        >{{ $t('V2_Form_Button_Skip') }}</Button>
      </div>
      <div class="v2-register-form__footer-right-slot">
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

export default {
  components: {
    ArrowRightIcon,
    Button,
    InputField,
  },
  props: {
    displayName: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalDisplayName: this.displayName,
      internalDescription: this.description,
    };
  },
  computed: {
    isConfirmable() {
      return this.internalDisplayName && this.internalDescription;
    },
  },
  methods: {
    handleSkip() {
      this.$emit('skip');
    },
    handleConfirm() {
      if (!this.isConfirmable) return;
      this.$emit('confirm', {
        displayName: this.internalDisplayName,
        description: this.internalDescription,
      });
    },
  },
};
</script>
