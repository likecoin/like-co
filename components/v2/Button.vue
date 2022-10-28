<template>
  <component
    :is="tag"
    :class="rootClass"
    :href="href"
    :disabled="!href && isDisabled"
    v-on="$listeners"
  >
    <div class="v2-button__layout">
      <slot />
    </div>
  </component>
</template>

<script>

const PRESET = {
  PRIMARY: 'primary',
  OUTLINED: 'outlined',
};

export default {
  props: {
    preset: {
      type: String,
      default: PRESET.PRIMARY,
    },
    href: {
      type: String,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rootClass() {
      return [
        'v2-button',
        `v2-button--${this.preset}`,
        {
          'v2-button--disabled': this.isDisabled,
        },
      ];
    },
    tag() {
      if (this.href) return 'a';
      return 'button';
    },
  },
};
</script>

<style scoped>
.v2-button {
  --v2-button-bg-color: transparent;
  --v2-button-border-color: var(--v2-button-bg-color);
  --v2-button-text-color: #4a4a4a;
  min-height: 40px;

  padding: 8px 16px;

  cursor: pointer;

  transition: all 0.2s ease;

  color: var(--v2-button-text-color);
  border: 2px solid transparent;
  border-color: var(--v2-button-border-color);
  border-radius: 12px;
  background-color: var(--v2-button-bg-color);

  font-size: 16px;
  font-weight: 600;
}

.v2-button:not(.v2-button--disabled).v2-button--primary {
  --v2-button-text-color: #28646E;
  --v2-button-bg-color: #B9EFE7;
}
.v2-button:not(.v2-button--disabled).v2-button--primary:hover {
  --v2-button-bg-color: #CDF4EE;
}
.v2-button:not(.v2-button--disabled).v2-button--primary:active {
  --v2-button-bg-color: #9FD3CF;
}

.v2-button:not(.v2-button--disabled).v2-button--outlined {
  --v2-button-text-color: #4a4a4a;
  --v2-button-border-color: #9b9b9b;
}
.v2-button:not(.v2-button--disabled).v2-button--outlined:hover {
  --v2-button-border-color: #cbcbcb;
}
.v2-button:not(.v2-button--disabled).v2-button--outlined:active {
  --v2-button-border-color: #7b7b7b;
}

.v2-button.v2-button--disabled {
  --v2-button-text-color: #ebebeb;
  --v2-button-border-color: var(--v2-button-text-color);

  cursor: not-allowed;

  opacity: 0.5;
}

.v2-button .v2-button__layout {
  display: grid;
  grid-auto-flow: column;

  align-items: center;
  justify-items: center;
  column-gap: 8px;
}
</style>
