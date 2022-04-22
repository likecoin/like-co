<template>
  <div class="v2-form__content">
    <div class="v2-form__body">
      <img
        src="~/assets/v2/register-completed.svg"
        alt=""
      >
      <i18n
        path="V2_Form_Verify_description"
        tag="p"
      >
        <br place="br">
      </i18n>
    </div>

    <div class="v2-form__footer">
      <div class="v2-form__footer-left-slot">
        <Button
          preset="outlined"
          @click="handleSkip"
        >{{ $t('V2_Form_Button_VerifyLater') }}</Button>
      </div>
      <div class="v2-form__footer-right-slot">
        <Button
          :is-disabled="true"
        >{{ $t('V2_Form_Button_Next') }}<ArrowRightIcon /></Button>
      </div>
    </div>
  </div>
</template>

<script>
import ArrowRightIcon from '../icons/ArrowRIght';
import Button from '../Button';

export default {
  components: {
    ArrowRightIcon,
    Button,
  },
  methods: {
    handleSkip() {
      this.$emit('skip');
    },
  },
};
</script>

<style scoped>
.v2-form__body {
  padding: 32px 24px;

  text-align: center;

  border: 3px solid #d7ecec;
  border-radius: 12px;
  justify-items: center;
}
</style>
