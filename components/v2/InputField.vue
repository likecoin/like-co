<template>
  <div class="v2-input-field">
    <label
      v-if="label"
      class="v2-input-field__label"
    >{{ label }}</label>
    <div
      class="v2-input-field__layout"
      @click="handleClick"
    >
      <div class="v2-input-field__text-container">
        <div
          v-if="!value"
          class="v2-input-field__placeholder"
        >{{ placeholder }}</div>
        <input
          ref="input"
          class="v2-input-field__input"
          :value="value"
          @input="handleInput"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClick() {
      const { input } = this.$refs;
      if (input) {
        input.focus();
      }
    },
    handleInput(event) {
      this.$emit('input', event.target.value);
    },
  },
};
</script>

<style>
.v2-input-field + .v2-input-field {
  margin-top: 24px;
}

.v2-input-field__label {
  display: block;

  margin-bottom: 4px;

  color: #9b9b9b;

  font-size: 12px;
}

.v2-input-field__layout {
  display: flex;

  min-height: 40px;
  padding: 8px 16px;

  border-radius: 12px;
  background-color: #ebebeb;

  font-size: 16px;
  line-height: 22px;
}

.v2-input-field__text-container {
  display: flex;
  align-items: center;
}

.v2-input-field__placeholder {
  position: absolute;

  pointer-events: none;

  color: #9b9b9b;
}

.v2-input-field__input {
  width: 100%;

  color: #4a4a4a;
  border: none;
  background: none;

  font-size: inherit;
}
.v2-input-field__input:focus {
  outline: none;
}
</style>
