<template>
  <div class="v2-card-view__content">
    <div class="v2-modal__title">{{ $t('V2_SkipEmailModal_Title') }}</div>
    <div class="v2-modal__description">{{ $t('V2_SkipEmailModal_Description') }}</div>
    <div class="v2-modal__actions">
      <Button
        preset="outlined"
        @click="$emit('skip')"
      >{{ $t('V2_Form_Button_SkipAnyway') }}</Button>
      <Button
        @click="$emit('confirm')"
      >{{ $t('V2_Form_Button_VerifyEmail') }}<ArrowRightIcon /></Button>
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
};
</script>
