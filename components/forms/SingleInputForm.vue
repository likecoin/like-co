<template>
  <form
    :id="getFormId"
    class="lc-form"
    @keydown.esc="onCancel"
    @submit.prevent="onSubmit">

    <md-field :class="['md-likecoin', { 'md-invalid': !!errorText }]">
      <md-icon v-if="errorText" class="md-accent">warning</md-icon>
      <label>{{ label }}</label>
      <md-input
        :type="type"
        :pattern="pattern"
        :autocomplete="autocomplete"
        v-model="inputText"
        required />
      <span class="md-error">
        {{ errorText }}
      </span>
    </md-field>

    <div class="lc-button-group">
      <md-button
        class="md-likecoin"
        type="submit"
        :form="getFormId">
        {{ $t('General.button.confirm') }}
      </md-button>
      <br/>
      <md-button
        class="md-likecoin lc-cancel"
        :form="getFormId"
        @click="onCancel">
        {{ $t('General.button.cancel') }}
      </md-button>
    </div>

  </form>
</template>

<script>
export default {
  name: 'input-form',
  props: {
    formId: {
      type: String,
    },
    type: {
      type: String,
      default: '',
    },
    autocomplete: {
      type: String,
    },
    pattern: {
      type: String,
    },
    text: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    errorText: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inputText: '',
    };
  },
  computed: {
    getFormId() {
      return this.formId || 'single-input-form';
    },
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onSubmit() {
      this.$emit('submit', this.inputText);
    },
    getText() {
      return this.inputText;
    },
  },
  watch: {
    text(value) {
      this.inputText = value;
    },
  },
  created() {
    this.inputText = this.text;
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/variables";

.md-error {
  color: $like-red;
}
</style>
