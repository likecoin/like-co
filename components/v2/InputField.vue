<template>
  <div
    :class="[
      'v2-input-field',
      {
        'v2-input-field--multiline': isMultiline,
        'v2-input-field--readonly': isReadonly,
      },
    ]"
  >
    <label
      v-if="label"
      class="v2-input-field__label"
    >{{ label }}</label>
    <div class="v2-input-field__layout-outer">
      <div
        class="v2-input-field__layout"
        @click="handleClick"
      >
        <div class="v2-input-field__text-container">
          <div
            v-if="isReadonly"
            :class="[
              'v2-input-field__readonly-text',
              {
                'v2-input-field__readonly-text--no-value': !value,
              }
            ]"
          >{{ value || placeholder }}</div>
          <template v-else>
            <input
              v-if="!isMultiline"
              ref="input"
              class="v2-input-field__input"
              :value="value"
              @input="handleInput"
            >
            <textarea
              v-else
              ref="input"
              class="v2-input-field__input"
              :value="value"
              :rows="4"
              @input="handleInput"
            />
            <div
              v-if="!value"
              class="v2-input-field__placeholder"
            >{{ placeholder }}</div>
          </template>
        </div>
        <slot name="append" />
      </div>
      <slot name="append-outer" />
    </div>
    <div
      v-if="error"
      class="v2-input-field__error"
    >{{ error }}</div>
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
    error: {
      type: String,
      default: '',
    },
    isReadonly: {
      type: Boolean,
      default: false,
    },
    isMultiline: {
      type: Boolean,
      default: false,
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
  flex-grow: 1;
  justify-content: center;

  color: #4a4a4a;

  font-size: 16px;
  line-height: 22px;
}

.v2-input-field:not(.v2-input-field--readonly) .v2-input-field__layout {
  border-radius: 12px;
  background-color: #ebebeb;
}

.v2-input-field__layout:not(:first-child) {
  margin-left: 12px;
}

.v2-input-field__layout:not(:last-child) {
  margin-right: 12px;
}

.v2-input-field__layout-outer {
  display: flex;
  align-items: center;
}

.v2-input-field__text-container {
  display: flex;

  width: 100%;
}
.v2-input-field:not(.v2-input-field--multiline) .v2-input-field__text-container {
  align-items: center;
}

.v2-input-field__placeholder,
.v2-input-field__readonly-text.v2-input-field__readonly-text--no-value {
  position: absolute;

  pointer-events: none;

  color: #9b9b9b;
}

.v2-input-field__readonly-text.v2-input-field__readonly-text--no-value {
  font-style: italic;
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

textarea.v2-input-field__input {
  resize: vertical;
}

.v2-input-field__input,
.v2-input-field__placeholder,
.v2-input-field__readonly-text {
  min-height: 40px;
  padding: 8px 0;
}

.v2-input-field__input,
.v2-input-field__placeholder {
  padding-right: 16px;
  padding-left: 16px;
}

.v2-input-field__error {
  margin-top: 4px;

  color: #fc5757;

  font-size: 10px;
}
</style>
